import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { decode } from "jwt-js-decode";

// 사이드바: 햄버거로 열고 닫는 좌측 드로어
// props:
// - open: boolean
// - onClose: () => void
const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { isLoggedIn } = authState;

  // ESC로 닫기
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // 토큰에서 역할 추출
  let role = null; // CLIENT | FREELANCER | BOTH | null
  if (isLoggedIn) {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const { payload } = decode(token);
        role = payload?.role || null;
      }
    } catch (e) {
      // role을 알 수 없는 경우 메뉴는 공통만 표시
      role = null;
    }
  }

  const handleNavigate = (to) => () => {
    onClose?.();
    navigate(to);
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 드로어 */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b">
          <span className="font-semibold">메뉴</span>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="p-2 rounded hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <nav className="p-2 text-sm">
          {/* 로그인 여부와 무관한 공통 검색 메뉴 */}
          <button
            onClick={handleNavigate("/search/commissions")}
            className="w-full text-left px-3 py-2 rounded hover:bg-slate-100"
          >
            의뢰글 검색
          </button>
          <button
            onClick={handleNavigate("/search/promotions")}
            className="w-full text-left px-3 py-2 rounded hover:bg-slate-100"
          >
            셀프 프로모션 검색
          </button>

          {/* 로그인 분기 */}
          {!isLoggedIn ? (
            <button
              onClick={handleNavigate("/login")}
              className="w-full text-left px-3 py-2 rounded hover:bg-slate-100"
            >
              로그인
            </button>
          ) : (
            <>
              {/* 공통 메뉴 (로그인 후) */}
              <button
                onClick={handleNavigate("/chat")}
                className="w-full text-left px-3 py-2 rounded hover:bg-slate-100"
              >
                채팅
              </button>
              <button
                onClick={handleNavigate("/mypage/deposits")}
                className="w-full text-left px-3 py-2 rounded hover:bg-slate-100"
              >
                예치금 조회
              </button>
              <button
                onClick={handleNavigate("/mypage/contracts")}
                className="w-full text-left px-3 py-2 rounded hover:bg-slate-100"
              >
                계약 조회
              </button>

              {/* 역할 기반 메뉴 */}
              {(role === "CLIENT" || role === "BOTH") && (
                <>
                  <button
                    onClick={handleNavigate("/mypage/commissions/own")}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100"
                  >
                    내 의뢰글
                  </button>
                  <button
                    onClick={handleNavigate("/cart")}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100"
                  >
                    장바구니
                  </button>
                </>
              )}
              {(role === "FREELANCER" || role === "BOTH") && (
                <button
                  onClick={handleNavigate("/mypage/promotion")}
                  className="w-full text-left px-3 py-2 rounded hover:bg-slate-100"
                >
                  내 셀프 프로모션
                </button>
              )}
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
