import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const MyContractsPage = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    // 커서 기반 페이징을 위한 상태
    const [cursor, setCursor] = useState({ date: null, code: null }); 
    const [hasMore, setHasMore] = useState(true);

    const fetchContracts = async () => {
        setLoading(true);
        try {
            // GET /api/contracts
            const response = await api.get('/contracts', {
                params: {
                    'cursor-date': cursor.date,
                    'cursor-code': cursor.code,
                    order: 'DESC'
                }
            });
            
            const newContracts = response.data.data.contracts || [];
            const nextCursor = response.data.data.nextCursor; 

            setContracts(prev => [...prev, ...newContracts]);
            
            if (nextCursor) {
                setCursor({ date: nextCursor.date, code: nextCursor.code });
                setHasMore(true);
            } else {
                setCursor({ date: null, code: null });
                setHasMore(false); // 더 이상 데이터 없음
            }

        } catch (error) {
            console.error("계약 목록 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            fetchContracts();
        }
    };

    if (loading && contracts.length === 0) return <div className="p-8 text-center text-gray-600">계약 목록 로딩 중...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">내 계약 목록</h2>
            
            <div className="space-y-4">
                {contracts.map(c => (
                    <div key={c.code} className="p-4 border border-blue-100 rounded-lg bg-blue-50 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-xl font-semibold text-blue-800">{c.title}</h3>
                            <span className="px-3 py-1 text-xs font-medium bg-blue-200 text-blue-900 rounded-full">
                                {c.status}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-3">금액: <span className="font-bold text-lg">{c.amount}</span></p>
                        <button 
                            onClick={() => { /* navigate(`/contract/${c.code}`) */ }}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150"
                        >
                            상세 보기
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 text-center">
                {hasMore && (
                    <button 
                        onClick={handleLoadMore} 
                        disabled={loading}
                        className={`px-6 py-3 font-semibold rounded-lg transition duration-200 ${
                            loading 
                                ? 'bg-gray-300 text-gray-600 cursor-wait' 
                                : 'bg-indigo-500 text-white hover:bg-indigo-600'
                        }`}
                    >
                        {loading ? '더 불러오는 중...' : '더 보기'}
                    </button>
                )}
                {!hasMore && contracts.length > 0 && (
                    <p className="text-gray-500">모든 계약을 불러왔습니다.</p>
                )}
            </div>
        </div>
    );
};

export default MyContractsPage;