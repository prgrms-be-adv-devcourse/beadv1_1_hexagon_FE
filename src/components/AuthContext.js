import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decode } from 'jwt-js-decode';
import instance from '../api/api';
import { CLAIMS } from '../constants';

// 외부 참조용 변수
let externalAuth = null;
export const getAuthService = () => externalAuth;

const initialAuthState = {
    isLoggedIn: false,
    memberCode: null,
    isSignedUp: false,
    role: null,
};

const AuthContext = createContext(initialAuthState);

// Auth Provider
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(initialAuthState);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 토큰 디코딩 및 상태 설정 함수
    const decodeAndSetState = (token) => {
        try {
            const decodedToken = decode(token);
            const memberCode = decodedToken.payload[CLAIMS.MEMBER_CODE];
            const isSignedUp = decodedToken.payload[CLAIMS.IS_SIGNED_UP];
            // const role = decodedToken.payload[CLAIMS.ROLE]; // 역할 클레임이 있다면

            if (memberCode) {
                setAuthState({
                    isLoggedIn: true,
                    memberCode: memberCode,
                    isSignedUp: isSignedUp === true,
                    role: null, // role
                });
                return true;
            }
        } catch (e) {
            console.error("Token decode failed:", e);
        }
        return false;
    };

    // 로그아웃 처리 함수 (외부/내부 모두 사용 가능)
    const logout = async (callBackend = true) => {
        // 1. 프론트엔드 상태 초기화 및 토큰 삭제
        localStorage.removeItem('accessToken');
        setAuthState(initialAuthState);

        if (callBackend) {
            try {
                // 2. 백엔드 로그아웃 API 호출 (Refresh Token 무효화)
                // Refresh Token이 HTTP Only Cookie로 전송되어 서버에서 삭제됩니다.
                await instance.delete('/auth/logout'); 
            } catch (e) {
                console.warn("Backend logout failed:", e);
            }
        }
        // 3. 로그인 페이지로 리다이렉션
        navigate('/login', { replace: true });
    };

    // 로그인 처리 (Access Token 저장 및 상태 업데이트)
    const login = (accessToken) => {
        if (decodeAndSetState(accessToken)) {
            localStorage.setItem('accessToken', accessToken);
        } else {
            logout(false);
        }
    };

    // 토큰만 업데이트 (인터셉터에서 사용)
    const updateToken = (accessToken) => {
        decodeAndSetState(accessToken);
        localStorage.setItem('accessToken', accessToken);
    };

    // 외부 참조 변수 초기화 (Hook 규칙을 준수하며 외부에 함수 제공)
    useEffect(() => {
        externalAuth = { logout, updateToken };
    }, []);

    // 컴포넌트 마운트 시 초기 토큰 상태 확인
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            decodeAndSetState(token);
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ authState, login, logout, updateToken, loading }}>
            {/* 로딩 중에는 children을 렌더링하지 않아 UX flickering 방지 */}
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);