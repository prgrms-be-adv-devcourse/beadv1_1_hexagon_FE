import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages (로그인 없이 접근 가능)
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import FailPage from "./pages/FailPage";
import CommissionSearchResultPage from "./pages/CommissionSearchResultPage";
import PromotionSearchResultPage from "./pages/PromotionSearchResultPage";

// Protected Pages (로그인 필수)
// 결제 관련
import ChargePage from "./pages/ChargePage";
import PaymentPage from "./pages/PaymentPage";
import SuccessPage from "./pages/SuccessPage";

// 마이페이지 및 등록/관리 관련
import CartPage from "./pages/CartPage";
import CommissionUpsertPage from "./pages/CommissionUpsertPage"; // Create/Update 공용
import MyCommissionsPage from "./pages/MyCommissionsPage";
import MyContractsPage from "./pages/MyContractsPage";
import MyProfilePage from "./pages/MyProfilePage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import ResumeListPage from "./pages/ResumeListPage";
import SellerRegisterPage from "./pages/SellerRegisterPage";
import SelfPromotionUpsertPage from "./pages/SelfPromotionUpsertPage"; // Create/Update 공용
import TagManagementPage from "./pages/TagManagementPage";
import MemberRatingPage from "./pages/MemberRatingPage"; // 다른 회원 평가도 로그인 후 가능

function App() {
    
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes: 로그인 불필요 */}
                <Route path="/" element={<p style={{padding: '20px'}}>홈 페이지 (나중에 /charge 또는 /search로 리다이렉트)</p>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login/need-signed-up" element={<SignUpPage/>} />
                <Route path="/fail" element={<FailPage />} />
                <Route path="/search/commissions" element={<CommissionSearchResultPage />} />
                <Route path="/search/promotions" element={<PromotionSearchResultPage />} />

                {/* Protected Routes: 로그인 필수 */}
                <Route element={<ProtectedRoute />}>
                    {/* 결제/충전 */}
                    <Route path="/charge" element={<ChargePage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/success" element={<SuccessPage />} />

                    {/* 의뢰글 등록/수정 (CommissionUpsertPage는 action props를 받아야 함) */}
                    {/* Action props 전달을 위해 래핑 컴포넌트 사용 또는 페이지 내부에서 파싱 */}
                    <Route path="/commissions/new" element={<CommissionUpsertPage action="create" />} />
                    <Route path="/commissions/:code/edit" element={<CommissionUpsertPage action="update" />} />

                    {/* 마이페이지/관리 영역 */}
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/mypage/profile" element={<MyProfilePage />} />
                    <Route path="/mypage/commissions/own" element={<MyCommissionsPage />} />
                    <Route path="/mypage/contracts" element={<MyContractsPage />} />
                    <Route path="/mypage/payments" element={<PaymentHistoryPage />} />
                    <Route path="/mypage/tags" element={<TagManagementPage />} />
                    <Route path="/mypage/resumes" element={<ResumeListPage />} />
                    <Route path="/mypage/seller-register" element={<SellerRegisterPage />} />
                    <Route path="/mypage/promotion" element={<SelfPromotionUpsertPage />} />
                    
                    {/* 회원 평가 페이지 (로그인 상태에서 평가 가능하도록 Protected) */}
                    <Route path="/member/:memberCode/rating" element={<MemberRatingPage />} />
                </Route>

                {/* 404 Not Found (모든 경로와 일치하지 않을 때) */}
                <Route path="*" element={<h1 style={{padding: '20px', textAlign: 'center'}}>404 Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;