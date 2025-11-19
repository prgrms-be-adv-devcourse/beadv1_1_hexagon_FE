import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import App from "../App";

// V1 위젯 클라이언트 키
const widgetClientKey = "test_gck_docs_Ovk5rk1EwkRWBwXLpaerP";
// Java 서버 주소
const API_BASE_URL = "http://localhost:8080";

// ==========================================
// 1. ChargePage (충전 금액 입력 화면 - 스크린샷 UI)
// ==========================================
function ChargePage() {
    const navigate = useNavigate();
    const [amount, setAmount] = useState(''); // 문자열로 관리 (빈 값 처리 용이)

    // 금액 버튼 (+1만, +5만 등)
    const handleAddAmount = (val) => {
        setAmount((prev) => {
            const current = prev === '' ? 0 : parseInt(prev.replace(/,/g, ''), 10);
            return (current + val).toLocaleString();
        });
    };

    // 직접 입력 핸들러 (숫자만 허용 및 콤마 포맷팅)
    const handleInputChange = (e) => {
        const value = e.target.value.replace(/,/g, '');
        if (value === '') {
            setAmount('');
            return;
        }
        if (!isNaN(value)) {
            setAmount(parseInt(value, 10).toLocaleString());
        }
    };

    // 충전하기 버튼 클릭 (결제 페이지로 이동)
    const handleSubmit = () => {
        const finalAmount = amount === '' ? 0 : parseInt(amount.replace(/,/g, ''), 10);

        if (finalAmount <= 0) {
            alert("0원 이상을 입력해주세요.");
            return;
        }

        // PaymentPage로 이동하며 state에 금액 전달
        navigate('/payment', { state: { price: finalAmount } });
    };

    return (
        <div style={styles.container}>
            {/* 헤더 */}
            <header style={styles.header}>
                <button style={styles.backButton} onClick={() => alert('뒤로가기')}></button>
                <h2 style={styles.headerTitle}>충전하기 <span style={{fontSize: '14px', color: '#999'}}></span></h2>
                <span style={styles.headerRight}></span>
            </header>

            <div style={styles.content}>
                {/* 로고 및 텍스트 */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    {/*<div style={styles.logoIcon}>M</div> /!* 로고 대체 *!/*/}
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>충전 머니로</span>
                </div>

                {/* 금액 입력 인풋 */}
                <div style={styles.inputWrapper}>
                    <input
                        type="text"
                        placeholder="충전할 금액을 입력해 주세요."
                        value={amount}
                        onChange={handleInputChange}
                        style={styles.input}
                    />
                    {amount && <span style={styles.currencyUnit}>원</span>}
                </div>

                {/* 금액 추가 버튼들 */}
                <div style={styles.buttonGrid}>
                    <button style={styles.amountBtn} onClick={() => handleAddAmount(10000)}>+1만</button>
                    <button style={styles.amountBtn} onClick={() => handleAddAmount(50000)}>+5만</button>
                    <button style={styles.amountBtn} onClick={() => handleAddAmount(100000)}>+10만</button>
                    <button style={styles.amountBtn} onClick={() => handleAddAmount(1000000)}>+100만</button>
                </div>


            </div>

            {/* 하단 고정 버튼 */}
            <button
                style={{
                    ...styles.submitButton,
                    backgroundColor: amount ? '#3182f6' : '#E2E2E2', // 입력값 있으면 민트색, 없으면 회색
                    color: amount ? 'white' : '#999'
                }}
                disabled={!amount}
                onClick={handleSubmit}
            >
                충전하기
            </button>
        </div>
    );
}

export default ChargePage;

// 스크린샷과 유사하게 만들기 위한 CSS-in-JS 스타일 객체
const styles = {
    container: {
        maxWidth: '480px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: '#fff',
        position: 'relative',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 20px',
        height: '56px',
    },
    backButton: {
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
    },
    headerTitle: {
        fontSize: '18px',
        fontWeight: '600',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    headerRight: {
        fontSize: '14px',
        color: '#2AC1BC',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    content: {
        padding: '20px',
        paddingBottom: '100px', // 하단 고정 버튼을 위한 패딩
    },
    logoIcon: {
        width: '32px',
        height: '32px',
        backgroundColor: '#00C73C',
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        marginRight: '8px',
    },
    inputWrapper: {
        borderBottom: '2px solid #333',
        paddingBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        border: 'none',
        fontSize: '24px',
        outline: 'none',
        fontWeight: 'bold',
        color: '#333',
        '::placeholder': { color: '#ccc' },
    },
    currencyUnit: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginLeft: '5px',
    },
    buttonGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '8px',
    },
    amountBtn: {
        padding: '10px 0',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#333',
        cursor: 'pointer',
        fontWeight: '600',
    },
    accountBox: {
        marginTop: '10px',
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '15px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    bankIcon: {
        width: '40px',
        height: '40px',
        backgroundColor: '#FFE600',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '20px',
        marginRight: '12px',
    },
    submitButton: {
        width: '100%',
        padding: '18px',
        fontSize: '18px',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
};