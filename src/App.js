import PaymentPage from "./pages/PaymentPage";
import SuccessPage from "./pages/SuccessPage";
import FailPage from "./pages/FailPage";
import {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
    return (
        // 1. 반드시 BrowserRouter로 전체를 감싸야 합니다.
        <BrowserRouter>
            <Routes>
                {/* 2. 각 페이지를 Route로 정의합니다. */}
                <Route path="/payment" element={<PaymentPage />} />

                {/* 토스 페이먼츠에서 결제 성공 시 리다이렉트 될 경로 (예: /success) */}
                <Route path="/success" element={<SuccessPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
