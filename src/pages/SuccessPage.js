import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// Java 서버 주소
const API_BASE_URL = "http://localhost:8000/api/payments";

export default function SuccessPage() {
    const [searchParams] = useSearchParams();
    const [paymentResult, setPaymentResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        // V1 위젯은 amount를 쿼리로 넘겨주지 않습니다.
        // V1 공식 예제에서는 amount를 서버가 이미 알고 있거나,
        // 클라이언트가 결제 요청 시 금액을 기억했다가 함께 넘겨야 합니다.
        // 여기서는 테스트를 위해 클라이언트가 기억한 금액을 사용합니다. (PaymentPage의 50000원)
        const amount = "50000"; // 고정값 사용 (실제로는 상태관리 필요)


        if (!paymentKey || !orderId || !amount) {
            setIsLoading(false);
            setPaymentResult({ error: "필수 결제 정보가 누락되었습니다." });
            return;
        }

        // Java 서버로 결제 승인 요청
        const requestPaymentConfirm = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/confirm`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        paymentKey: paymentKey,
                        orderId: orderId,
                        amount: amount, // 서버는 이 amount가 실제 주문 금액과 일치하는지 검증해야 함
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setPaymentResult(data);
                } else {
                    setPaymentResult({ error: data.message || "결제 승인 실패" });
                }
            } catch (error) {
                console.error("결제 승인 통신 실패:", error);
                setPaymentResult({ error: "서버 통신 중 오류가 발생했습니다." });
            } finally {
                setIsLoading(false);
            }
        };

        requestPaymentConfirm();
    }, [searchParams]);

    if (isLoading) {
        return <div><h1>결제 승인 중...</h1></div>;
    }

    return (
        <div>
            {paymentResult.error ? (
                <>
                    <h1>결제 승인 실패</h1>
                    <p>{paymentResult.error}</p>
                </>
            ) : (
                <>
                    <h1>결제 성공!</h1>
                    <p>주문번호: {paymentResult.orderId}</p>
                    <p>결제금액: {Number(paymentResult.totalAmount).toLocaleString()}원</p>
                    <p>결제수단: {paymentResult.method}</p>
                </>
            )}
        </div>
    );
}