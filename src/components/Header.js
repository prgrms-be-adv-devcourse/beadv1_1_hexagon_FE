import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import api from "../api/api";
import Sidebar from "./Sidebar";

const Header = () => {
  const { authState, logout } = useAuth();
  const { isLoggedIn } = authState;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      const response = await api.delete("auth/logout");

      // If successful, remove the accessToken
      if (response.status === 200) {
        localStorage.removeItem("accessToken");
        // Update auth state
        logout(false); // Pass false to avoid calling the backend again
        // Redirect to front page
        navigate("/");
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  useEffect(() => {
    // Only fetch profile if user is logged in
    if (isLoggedIn) {
      setLoading(true);
      const fetchProfile = async () => {
        try {
          const response = await api.get("/members/me");
          setProfile(response.data.data.info);
        } catch (error) {
          console.error("프로필 정보 조회 실패:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [isLoggedIn]);

  return (
      <>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 text-slate-300 py-5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            {/* 1. 좌측: 햄버거 + 로고 */}
            <div className="flex items-center gap-2 font-medium">
              <button
                  onClick={toggleSidebar}
                  aria-label="사이드바 열기"
                  className="mr-2 p-2 rounded hover:bg-slate-800 text-white"
              >
                <span className="block w-5 h-0.5 bg-current mb-1" />
                <span className="block w-5 h-0.5 bg-current mb-1" />
                <span className="block w-5 h-0.5 bg-current" />
              </button>
              <Link to="/" className="text-white font-bold text-lg mr-2">
                이어드림
              </Link>
            </div>

            {/* 3. 로그인/회원가입 또는 사용자 정보 */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                  <>
                    {loading ? (
                        <span className="text-slate-400">로딩 중...</span>
                    ) : (
                        <Link to="/mypage" className="hover:text-white transition-colors">
                          {profile?.nickName || "사용자"}님
                        </Link>
                    )}
                    <Link
                        to="/mypage"
                        className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded transition-colors"
                    >
                      마이페이지
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
                    >
                      로그아웃
                    </button>
                  </>
              ) : (
                  <Link
                      to="/login"
                      className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded transition-colors"
                  >
                    로그인
                  </Link>
              )}
            </div>
          </div>
        </header>
      </>
  );
};

export default Header;
