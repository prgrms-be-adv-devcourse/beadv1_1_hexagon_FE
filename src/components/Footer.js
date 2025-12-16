import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        {/* 1. 로고 & 저작권 */}
        <div className="flex items-center gap-4 font-medium">
          <span className="text-white font-bold text-lg mr-2">이어드림</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <p>© 2025 Team Hexagon.</p>
        </div>

        {/* 2. 가로 메뉴 (주요 링크) */}
        <nav className="flex items-center gap-6">
          <Link
            to="/search/commissions"
            className="hover:text-white transition-colors"
          >
            의뢰 찾기
          </Link>
          <Link
            to="/mypage/seller-register"
            className="hover:text-white transition-colors"
          >
            판매자 등록
          </Link>
          <Link to="/charge" className="hover:text-white transition-colors">
            포인트 충전
          </Link>
          <Link to="/mypage/deposits" className="hover:text-white transition-colors">
            내 포인트 조회
          </Link>
          <Link to="/mypage/contracts" className="hover:text-white transition-colors">
            계약 목록
          </Link>
          <Link to="/cart" className="hover:text-white transition-colors">
            장바구니
          </Link>
        </nav>

        {/* 3. 소셜/외부 링크 */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/prgrms-be-adv-devcourse/beadv1_1_hexagon_BE"
            target="_blank"
            rel="noreferrer"
            className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded transition-colors text-xs"
          >
            BE GitHub
          </a>
          <a
            href="https://github.com/prgrms-be-adv-devcourse/beadv1_1_hexagon_FE"
            target="_blank"
            rel="noreferrer"
            className="bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded transition-colors text-xs"
          >
            FE GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
