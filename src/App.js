import PaymentPage from "./pages/PaymentPage";
import SuccessPage from "./pages/SuccessPage";
import FailPage from "./pages/FailPage";
import ChargePage from "./pages/ChargePage";
import {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ChargePage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/fail" element={<FailPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
