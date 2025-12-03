import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';

// action: 'create' 또는 'update'
const CommissionUpsertPage = ({ action }) => {
    const { code } = useParams(); // 수정 시 사용되는 commissionCode
    const navigate = useNavigate();
    const isUpdate = action === 'update';
    
    const [formData, setFormData] = useState({ title: '', content: '' /* 기타 필드 */ });
    const [loading, setLoading] = useState(isUpdate);

    useEffect(() => {
        if (isUpdate) {
            // 수정 모드일 때 기존 데이터 로딩: GET /api/commissions/{commissionCode}
            const fetchCommission = async () => {
                try {
                    const response = await api.get(`/commissions/${code}`);
                    setFormData(response.data.data); 
                } catch (error) {
                    alert("의뢰글을 불러오는 데 실패했습니다.");
                    navigate('/commissions');
                } finally {
                    setLoading(false);
                }
            };
            fetchCommission();
        }
    }, [isUpdate, code, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestData = formData; 

        try {
            if (isUpdate) {
                // PUT /api/commissions/{commissionCode}
                await api.put(`/commissions/${code}`, requestData);
                alert("의뢰글이 수정되었습니다.");
            } else {
                // POST /api/commissions
                await api.post('/commissions', requestData);
                alert("의뢰글이 생성되었습니다.");
            }
            navigate(`/commissions/${code || 'list'}`);
        } catch (error) {
            console.error(`${action} 실패:`, error);
            alert(`${action}에 실패했습니다: ${error.response?.data.message}`);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-600">{isUpdate ? '수정할 의뢰글 로딩 중...' : '페이지 로딩 중...'}</div>;

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl">
            <h2 className="text-3xl font-extrabold mb-8 text-indigo-700">
                {isUpdate ? '✍️ 의뢰글 수정' : '✨ 새 의뢰글 작성'}
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
                        className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="의뢰 제목을 입력하세요"
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
                        className="p-3 border border-gray-300 rounded-lg h-40 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        placeholder="상세 의뢰 내용을 입력하세요"
                        required
                    />
                </div>
                
                {/* 기타 필드 (추가될 예정) */}
                
                <button 
                    type="submit"
                    className="w-full py-3 text-lg font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-lg"
                >
                    {isUpdate ? '수정 완료' : '작성 완료'}
                </button>
            </form>
        </div>
    );
};

export default CommissionUpsertPage;