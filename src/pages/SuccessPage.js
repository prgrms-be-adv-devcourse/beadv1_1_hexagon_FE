import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// Java 서버 주소
const API_BASE_URL = "http://localhost:8000/api/payments";

export default function SuccessPage() {
    const [searchParams] = useState(new URLSearchParams(window.location.search));
    const [paymentResult, setPaymentResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        // PaymentPage에서 저장한 금액을 가져옴
        const amount = sessionStorage.getItem("paymentAmount");

        if (!paymentKey || !orderId || !amount) {
            setIsLoading(false);
            setPaymentResult({ error: "필수 정보 누락" });
            return;
        }

        const requestPaymentConfirm = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/confirm`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ paymentKey, orderId, amount }),
                });
                const data = await response.json();
                if (response.ok) setPaymentResult(data);
                else setPaymentResult({ error: data.message || "승인 실패" });
            } catch (error) {
                setPaymentResult({ error: "서버 통신 오류" });
            } finally {
                setIsLoading(false);
                sessionStorage.removeItem("paymentAmount");
            }
        };
        requestPaymentConfirm();
    }, [searchParams]);

    if (isLoading) return <div><h1>결제 승인 중...</h1></div>;

    return (
        <div style={{ padding: '20px' }}>
            {paymentResult?.error ? (
                <><h1>실패</h1><p>{paymentResult.error}</p></>
            ) : (
                <>
                    <h1>충전 완료!</h1>
                    <p>금액: {Number(paymentResult.totalAmount).toLocaleString()}원</p>
                </>
            )}
            <button onClick={() => window.location.href = '/'}>홈으로</button>
        </div>
    );
}
