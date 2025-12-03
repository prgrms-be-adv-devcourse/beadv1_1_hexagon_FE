import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * 로그인이 필요한 페이지를 보호하는 컴포넌트.
 * 로컬 스토리지에 'accessToken'이 없으면 /login으로 리다이렉션
 */
const ProtectedRoute = () => {
    // 실제 환경에서는 토큰의 유효성 검사(만료 여부)도 함께 수행
    const isAuthenticated = !!localStorage.getItem('accessToken');
    
    // 토큰이 없거나 유효하지 않으면 로그인 페이지로 이동
    if (!isAuthenticated) {
        // State에 현재 경로를 저장하여 로그인 후 돌아오기 쉽게 할 수 있음
        return <Navigate to="/login" replace />;
    }

    // 토큰이 있다면 요청한 컴포넌트를 렌더링
    return <Outlet />;
};

export default ProtectedRoute;