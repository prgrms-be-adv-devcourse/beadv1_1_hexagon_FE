import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const SelfPromotionUpsertPage = () => {
    // 회원당 하나이므로, code 대신 memberCode 기반으로 존재 여부 확인
    const [promotion, setPromotion] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '', resumeCode: '' /* ...기타 필드 */ });
    const [loading, setLoading] = useState(true);
    const isExisting = !!promotion;

    useEffect(() => {
        // GET /api/self-promotions/me (내 프로모션 조회)
        const fetchMyPromotion = async () => {
            try {
                const response = await api.get('/self-promotions/me');
                if (response.data.data && response.data.data.length > 0) {
                    const existingPromo = response.data.data[0];
                    setPromotion(existingPromo);
                    setFormData(existingPromo); // 폼 초기화
                }
            } catch (error) {
                console.error("프로모션 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyPromotion();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isExisting) {
                // PUT /api/self-promotions/{promotionCode}
                await api.put(`/self-promotions/${promotion.code}`, formData);
                alert("프로모션이 수정되었습니다.");
            } else {
                // POST /api/self-promotions
                await api.post('/self-promotions', formData);
                alert("프로모션이 등록되었습니다.");
            }
            // 성공 후 페이지 새로고침 또는 리디렉션
        } catch (error) {
            alert("프로모션 처리 실패: " + error.response?.data.message);
        }
    };
    
    const handleDelete = async () => {
        if (!window.confirm('정말로 이 프로모션 게시글을 삭제하시겠습니까?')) return;
        try {
            // DELETE /api/self-promotions/{promotionCode}
            await api.delete(`/self-promotions/${promotion.code}`);
            alert('프로모션 게시글이 삭제되었습니다.');
            setPromotion(null);
            setFormData({ title: '', content: '', resumeCode: '' });
        } catch (error) {
            alert('삭제 실패: ' + error.response?.data.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-600">내 프로모션 정보 로딩 중...</div>;

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl">
            <h2 className="text-3xl font-extrabold mb-8 text-purple-700">
                {isExisting ? '📝 내 프로모션 수정' : '📢 새 프로모션 등록'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 제목 입력 */}
                <div className="flex flex-col">
                    <label htmlFor="title" className="mb-2 font-semibold text-gray-700">제목:</label>
                    <input 
                        type="text" 
                        id="title"
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        placeholder="프리랜서로서 자신을 홍보하는 제목"
                        required
                    />
                </div>
                
                {/* 내용 입력 */}
                <div className="flex flex-col">
                    <label htmlFor="content" className="mb-2 font-semibold text-gray-700">내용:</label>
                    <textarea 
                        id="content"
                        value={formData.content} 
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg h-40 focus:ring-purple-500 focus:border-purple-500 resize-none"
                        placeholder="경력, 기술, 수주 가능 분야 등을 상세히 홍보하세요"
                        required
                    />
                </div>
                
                {/* 이력서 코드 (임시 필드) */}
                <div className="flex flex-col">
                    <label htmlFor="resumeCode" className="mb-2 font-semibold text-gray-700">연결 이력서 코드:</label>
                    <input 
                        type="text" 
                        id="resumeCode"
                        value={formData.resumeCode} 
                        onChange={e => setFormData({...formData, resumeCode: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        placeholder="RESUME-..."
                    />
                </div>
                
                <button 
                    type="submit"
                    className="w-full py-3 text-lg font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition duration-300 shadow-lg"
                >
                    {isExisting ? '수정 완료' : '등록하기'}
                </button>
            </form>
            
            {isExisting && (
                <div className="mt-6 border-t pt-4">
                    <button 
                        onClick={handleDelete}
                        className="w-full py-3 text-lg font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        프로모션 삭제
                    </button>
                </div>
            )}
        </div>
    );
};

export default SelfPromotionUpsertPage;