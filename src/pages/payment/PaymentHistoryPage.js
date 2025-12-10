import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const PaymentHistoryPage = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // GET /api/payments
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const response = await api.get('/payments');
                setPayments(response.data.data.paymentHistory || []); 
            } catch (error) {
                console.error("결제 내역 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-600">결제 내역 로딩 중...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">💰 결제 내역</h2>
            
            <div className="space-y-4">
                {payments.length === 0 ? (
                    <p className="text-gray-500 italic">결제 내역이 없습니다.</p>
                ) : (
                    payments.map(p => (
                        <div 
                            key={p.orderId} 
                            className="p-4 flex justify-between items-center border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
                        >
                            <div>
                                <span className="text-xl font-bold text-red-600 mr-4">{p.amount}원</span>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                    p.status === 'COMPLETED' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {p.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">주문 코드: {p.orderId}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PaymentHistoryPage;