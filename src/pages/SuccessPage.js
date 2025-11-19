import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Java 서버 주소
const API_BASE_URL = "http://localhost:8000/api/payments";

export default function SuccessPage() {
    const [searchParams] = useState(new URLSearchParams(window.location.search));
    const [paymentResult, setPaymentResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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

    if (isLoading) {
        return (
            <div style={styles.successContainer}>
                {/* 스피너 애니메이션을 위한 스타일 태그 삽입 */}
                <style>
                    {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    `}
                </style>
                <div style={styles.loadingSpinner}></div>
                <p style={{marginTop: '20px', color: '#666'}}>결제 승인 중입니다...</p>
            </div>
        );
    }

    return (
        <div style={styles.successContainer}>
            {paymentResult?.error ? (
                // 실패 화면
                <div style={{textAlign: 'center', width: '100%'}}>
                    {/* 아이콘을 중앙에 배치하기 위해 margin: 0 auto 적용됨 */}
                    <div style={{...styles.iconCircle, backgroundColor: '#f44336', boxShadow: '0 4px 10px rgba(244, 67, 54, 0.2)'}}>
                        {/* 텍스트 ! 대신 SVG 사용으로 중앙 정렬 맞춤 */}
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h2 style={styles.successTitle}>결제에 실패했어요</h2>
                    <p style={styles.errorMessage}>{paymentResult.error}</p>
                    <button onClick={() => navigate('/')} style={styles.homeButton}>홈으로 돌아가기</button>
                </div>
            ) : (
                // 성공 화면
                <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={styles.iconCircle}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <h2 style={styles.successTitle}>결제를 완료했어요</h2>

                    <div style={styles.resultInfoBox}>
                        <p style={styles.amountText}>
                            {Number(paymentResult.totalAmount || paymentResult.amount).toLocaleString()}원
                        </p>
                        <div style={styles.detailRow}>
                            <span style={styles.label}>주문번호</span>
                            <span style={styles.value}>{paymentResult.orderId}</span>
                        </div>
                        <div style={styles.detailRow}>
                            <span style={styles.label}>결제수단</span>
                            <span style={styles.value}>{paymentResult.method}</span>
                        </div>
                    </div>

                    <div style={styles.bottomButtonArea}>
                        <button onClick={() => navigate('/')} style={styles.confirmButton}>
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// 스타일 객체
const styles = {
    successContainer: {
        maxWidth: '480px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    iconCircle: {
        width: '80px',
        height: '80px',
        backgroundColor: '#3182f6',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // 여기서 margin: 0 auto가 핵심입니다. (상하 마진은 bottom만 24px)
        margin: '0 auto 24px auto',
        boxShadow: '0 4px 10px rgba(49, 130, 246, 0.2)',
    },
    successTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '30px',
    },
    resultInfoBox: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '40px',
        textAlign: 'center',
        boxSizing: 'border-box',
    },
    amountText: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px',
    },
    detailRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '14px',
    },
    label: {
        color: '#888',
    },
    value: {
        color: '#333',
        fontWeight: '500',
    },
    bottomButtonArea: {
        width: '100%',
        marginTop: 'auto',
    },
    confirmButton: {
        width: '100%',
        padding: '16px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: '#3182f6',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
    },
    homeButton: {
        padding: '12px 24px',
        fontSize: '15px',
        backgroundColor: '#f2f4f6',
        color: '#4e5968',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    errorMessage: {
        color: '#f44336',
        marginBottom: '20px',
    },
    loadingSpinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3182f6',
        borderRadius: '50%',
        // spin 애니메이션 적용 (위의 style 태그와 연동됨)
        animation: 'spin 1s linear infinite',
    }
};