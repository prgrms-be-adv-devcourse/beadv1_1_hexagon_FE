import axios from 'axios';
import { getAuthService, AuthProvider } from '../components/AuthContext'; // Hook이 아닌 함수 참조
import { API_BASE_URL, REISSUE_URL } from '../constants';

const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

// 실패한 요청을 큐에 저장된 프로미스들 처리
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 요청 인터셉터 (Access Token 주입)
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (401 재발급 로직)
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const authService = getAuthService(); // Hook 규칙 준수: getAuthService() 사용

        // 1. 401 에러이며, 이미 재시도한 요청이 아닌 경우에만 처리
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // 회원가입(/api/members) 로직은 직접 토큰을 다루므로 인터셉터 무시
            if (originalRequest.url === '/members' && originalRequest.method === 'post') {
                return Promise.reject(error);
            }

            // 재발급 요청(/api/auth/reissue) 자체가 401을 받으면 로그아웃 처리
            if (originalRequest.url === '/auth/reissue') {
                // RefreshToken이 DB/Redis에 없어서 401 → 그때만 로그아웃
                if (error.response?.data?.customErrorCode === 'UNAUTHORIZATION') {
                    authService.logout(false);
                }
                
                return Promise.reject(error);
            }
            
            // 2. 토큰 재발급 프로세스 시작
            if (isRefreshing) {
                // 재발급 중이면 큐에 저장 후 대기
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return instance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // 3. 재발급 요청
                // Note: 여기서 axios.create() 대신 기본 axios를 사용하여 무한 루프 방지
                const reissueResponse = await axios.post(REISSUE_URL, {}, { withCredentials: true });
                const newAccessToken = reissueResponse.headers['authorization']?.replace('Bearer ', '');

                if (!newAccessToken) {
                    throw new Error("새 Access Token이 응답 헤더에 없습니다.");
                }

                // 4. 전역 상태 및 로컬 스토리지 업데이트
                authService.updateToken(newAccessToken);

                // 5. 대기 중이던 요청들 처리
                processQueue(null, newAccessToken);

                // 6. 현재 실패했던 요청 재시도
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(originalRequest);

            } catch (reissueError) {
                // 7. 재발급 실패 시 (Refresh Token 만료 또는 유효하지 않음)
                processQueue(reissueError, null);
                authService.logout(); // 로그아웃 처리 및 로그인 페이지로 이동
                return Promise.reject(reissueError);

            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance; // 모든 컴포넌트에서 이 인스턴스를 import하여 사용합니다.