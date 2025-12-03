import PaymentPage from "./pages/PaymentPage";
import SuccessPage from "./pages/SuccessPage";
import FailPage from "./pages/FailPage";
import ChargePage from "./pages/ChargePage";
import LoginPage from "./pages/LoginPage";
import {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login/need-signed-up" element={<SignUpPage/>} />
                <Route path="/charge" element={<ChargePage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/fail" element={<FailPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;