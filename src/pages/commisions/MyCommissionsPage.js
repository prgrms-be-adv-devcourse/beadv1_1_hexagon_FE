import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const MyCommissionsPage = () => {
    const [myCommissions, setMyCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0); // 페이징 컨트롤

    useEffect(() => {
        const fetchMyCommissions = async () => {
            setLoading(true);
            try {
                // GET /api/commissions/own
                const response = await api.get('/commissions/own', {
                    params: { page, size: 10, sort: 'isOpen,asc' } 
                });
                setMyCommissions(response.data.data.content); 
            } catch (error) {
                console.error("내 의뢰글 목록 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCommissions();
    }, [page]);

    const handleFinish = async (commissionCode) => {
        // PUT /api/commissions/{commissionCode}/finish
        try {
            await api.put(`/commissions/${commissionCode}/finish`);
            alert("의뢰글이 마감 처리되었습니다.");
            setPage(0); // 목록 새로고침 (첫 페이지로)
        } catch (error) {
            console.error("의뢰글 마감 실패:", error);
            alert("마감 처리에 실패했습니다: " + error.response?.data.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-600">내 의뢰글 목록 로딩 중...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">내가 작성한 의뢰글</h2>
            
            <div className="space-y-4">
                {myCommissions.map(comm => (
                    <div 
                        key={comm.code} 
                        className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold text-indigo-600 truncate mr-4">
                                {comm.title}
                            </h3>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                comm.isOpen 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {comm.isOpen ? '진행 중' : '마감'}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                            {comm.content.substring(0, 50)}...
                        </p>
                        {comm.isOpen && (
                            <button 
                                onClick={() => handleFinish(comm.code)}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-150"
                            >
                                마감 처리
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {/* 페이지네이션 UI 추가 (Tailwind CSS 적용 필요) */}
        </div>
    );
};

export default MyCommissionsPage;