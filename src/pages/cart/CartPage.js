import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const CartPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            // GET /api/cart
            const response = await api.get('/cart');
            // ResponseDto<List<CartItemsGetResponse>>
            setItems(response.data.data || []);
        } catch (error) {
            console.error("장바구니 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleDelete = async (itemCode) => {
        // DELETE /api/cart/{itemCode}
        try {
            await api.delete(`/cart/${itemCode}`);
            alert("아이템이 삭제되었습니다.");
            fetchCartItems(); // 목록 새로고침
        } catch (error) {
            console.error("아이템 삭제 실패:", error);
        }
    };

    const handlePay = async () => {
        // 장바구니 전체/선택 결제 요청
        // POST /api/cart/pay-request (ContractPayRequest 사용)
        try {
            const contractPayRequest = {
                // 필요한 결제 요청 데이터
            };
            await api.post('/cart/pay-request', contractPayRequest);
            alert("결제가 요청되었습니다. 계약 목록을 확인하세요.");
        } catch (error) {
            console.error("결제 요청 실패:", error);
            alert("결제 요청에 실패했습니다: " + error.response?.data.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-600">장바구니 로딩 중...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">🛒 장바구니</h2>
            
            <div className="space-y-4">
                {items.length === 0 ? (
                    <p className="text-gray-500 italic">장바구니가 비어있습니다.</p>
                ) : (
                    items.map(item => (
                        <div key={item.itemCode} className="flex justify-between items-center p-4 bg-gray-50 border rounded-lg hover:shadow-md transition duration-200">
                            <span className="text-lg font-semibold text-gray-700">
                                {item.title} - <span className="text-blue-600 font-bold">{item.amount}원</span>
                            </span>
                            <button 
                                onClick={() => handleDelete(item.itemCode)}
                                className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-150"
                            >
                                삭제
                            </button>
                        </div>
                    ))
                )}
            </div>
            
            <hr className="my-6 border-gray-300"/>
            
            <button 
                onClick={handlePay} 
                disabled={items.length === 0}
                className={`w-full py-3 text-white font-bold rounded-lg transition duration-200 ${
                    items.length === 0 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 shadow-lg'
                }`}
            >
                선택 상품 결제하기
            </button>
        </div>
    );
};

export default CartPage;