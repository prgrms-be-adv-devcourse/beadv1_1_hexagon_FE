import React, { useState } from 'react';
import api from '../../api/api';

const SellerRegisterPage = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    
    const handleRegister = async () => {
        if (!isConfirmed) {
            alert("판매자 등록 약관에 동의해야 합니다.");
            return;
        }

        // POST /api/members/work-state
        try {
            await api.post('/members/work-state');
            alert("판매자 등록이 성공적으로 완료되었습니다. 프로필 및 이력서를 작성해 주세요.");
            // 등록 후, 프로필 페이지 등으로 리디렉션 처리
        } catch (error) {
            console.error("판매자 등록 실패:", error);
            alert("판매자 등록에 실패했습니다: " + error.response?.data.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-8 bg-white shadow-2xl rounded-xl text-center">
            <h2 className="text-3xl font-bold mb-6 text-green-700">🚀 프리랜서(판매자) 등록</h2>
            <p className="mb-8 text-gray-600">
                프리랜서로 활동하며 의뢰를 수주하려면 약관에 동의하고 등록을 완료해야 합니다.
            </p>
            
            <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-700 italic">
                    [약관 내용 요약]: 플랫폼 이용 수수료, 계약 책임, 정산 주기 등 상세 내용.
                </p>
            </div>

            <div className="flex items-center justify-center mb-8">
                <input 
                    type="checkbox" 
                    id="confirm" 
                    checked={isConfirmed} 
                    onChange={(e) => setIsConfirmed(e.target.checked)} 
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="confirm" className="ml-3 text-lg font-medium text-gray-800 cursor-pointer">
                    프리랜서 활동 약관에 **동의**합니다.
                </label>
            </div>

            <button 
                onClick={handleRegister} 
                disabled={!isConfirmed}
                className={`w-full py-3 text-lg font-bold text-white rounded-lg transition duration-300 ${
                    !isConfirmed 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'
                }`}
            >
                판매자 등록하기
            </button>
        </div>
    );
};

export default SellerRegisterPage;