import React, { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk';
import { v4 as uuidv4 } from "uuid"; // npm install uuid

// V1 위젯 클라이언트 키 (V2와 다름)
const widgetClientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = uuidv4(); // 고객 고유 키

export default function PaymentPage() {
    const paymentWidgetRef = useRef(null);
    const paymentMethodsWidgetRef = useRef(null);
    const [price, setPrice] = useState(50000);

    useEffect(() => {
        const fetchPaymentWidget = async () => {
            try {
                const paymentWidget = await loadPaymentWidget(widgetClientKey, customerKey);

                // 결제 UI 렌더링
                const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                    "#payment-widget",
                    price
                );

                // 이용약관 UI 렌더링
                paymentWidget.renderAgreement("#agreement");

                paymentWidgetRef.current = paymentWidget;
                paymentMethodsWidgetRef.current = paymentMethodsWidget;
            } catch (error) {
                console.error("Error loading payment widget:", error);
            }
        };

        fetchPaymentWidget();
    }, []);

    const handlePaymentRequest = async () => {
        const paymentWidget = paymentWidgetRef.current;

        try {
            await paymentWidget?.requestPayment({
                orderId: uuidv4(),
                orderName: "토스 티셔츠 외 2건",
                successUrl: `${window.location.origin}/success`,
                failUrl: `${window.location.origin}/fail`,
                customerEmail: "customer123@gmail.com",
                customerName: "김토스",
            });
        } catch (error) {
            console.error("Error requesting payment:", error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>충전금액</h1>
            <span>{`금액: ${price.toLocaleString()}원`}</span>
            <div id="payment-widget" style={{ width: '100%' }} />
            <div id="agreement" style={{ width: '100%' }} />
            <button
                style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}
                onClick={handlePaymentRequest}>
                결제하기
            </button>
        </div>
    );
}