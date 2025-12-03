import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
// import { USER_ROLES } from '../constants'; // 역할 상수

// allowedRoles: null이면 로그인만 필요, 배열이면 역할까지 체크
const ProtectedRoute = ({ allowedRoles = null }) => {
    const { authState, loading } = useAuth();
    
    // 1. 로딩 중 처리 (UX 개선)
    if (loading) {
        // 
        return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>인증 정보 로딩 중...</div>; 
    }

    // 2. 비로그인 사용자 처리
    if (!authState.isLoggedIn) {
        // 로그인하지 않은 사용자는 무조건 로그인 페이지로
        return <Navigate to="/login" replace />;
    }

    // 3. 미가입 사용자 처리 (가입 완료 전에는 회원가입 페이지 외 접근 차단)
    // 미가입 상태인데 현재 경로가 회원가입 경로가 아니라면 리디렉션
    if (!authState.isSignedUp && window.location.pathname !== '/login/need-signed-up') {
        return <Navigate to="/login/need-signed-up" replace />;
    }
    
    // 4. 역할(Role) 기반 접근 제어
    /*
    if (allowedRoles && authState.role && !allowedRoles.includes(authState.role)) {
        // 역할이 허용되지 않으면 권한 없음 페이지로 이동
        return <Navigate to="/unauthorized" replace />;
    }
    */

    // 모든 검증을 통과하면 하위 라우트(Outlet) 렌더링
    return <Outlet />;
};

export default ProtectedRoute;