import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/api';

const PromotionSearchResultPage = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const query = searchParams.get('query') || '';
    const scope = searchParams.get('scope') || 'all';

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                // GET /api/search/self-promotions
                const response = await api.get('/search/self-promotions', {
                    params: {
                        query,
                        scope,
                        page: currentPage,
                        size: 10,
                    }
                });
                setResults(response.data.data.content || []); 
            } catch (error) {
                console.error("프로모션 검색 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSearchResults();
    }, [query, scope, currentPage]);

    if (loading) return <div className="p-8 text-center text-gray-600">Self Promotion 검색 중...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
                🔎 Self Promotion 검색 결과 (키워드: <span className="text-green-600">"{query}"</span>)
            </h2>
            
            <div className="search-input-area mb-4">
                {/* 검색 입력 폼 및 추천 검색어 영역 */}
                <p className="text-sm text-gray-500 italic">검색 범위: {scope}</p>
            </div>

            <div className="space-y-4">
                {results.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-8">검색 결과가 없습니다.</p>
                ) : (
                    results.map(item => (
                        <div key={item.code} className="p-5 border border-green-200 rounded-lg bg-green-50 shadow-sm hover:shadow-md transition duration-200">
                            <h4 className="text-xl font-semibold text-green-700">{item.title}</h4>
                            <p className="mt-1 text-gray-600">
                                <span className="font-medium">{item.memberNickname}</span> / 
                                <span className="ml-1 font-bold text-red-600">{item.payAmount}원</span>
                            </p>
                        </div>
                    ))
                )}
            </div>
            {/* 페이지네이션/더보기 버튼 UI */}
        </div>
    );
};

export default PromotionSearchResultPage;