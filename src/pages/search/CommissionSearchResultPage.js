import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/api';

const CommissionSearchResultPage = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const query = searchParams.get('query') || '';
    const tags = searchParams.getAll('tags');
    const tagsKey = tags.join(',');

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await api.get('/search/commissions', {
                    params: {
                        query,
                        tags: tagsKey,
                        page: currentPage,
                        size: 10,
                    }
                });
                setResults(response.data.data.content || []);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, tagsKey, currentPage]);

    if (loading) return <div className="p-8 text-center text-gray-600">의뢰글 검색 중...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
                🔎 의뢰글 검색 결과 (키워드: <span className="text-indigo-600">"{query}"</span>)
            </h2>
            
            <div className="search-filters mb-6 p-4 bg-gray-100 rounded-lg">
                <p className="font-semibold text-gray-700">적용된 태그:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                        <span key={tag} className="px-3 py-1 text-sm bg-indigo-200 text-indigo-800 rounded-full font-medium">
                            #{tag}
                        </span>
                    ))}
                    {tags.length === 0 && <span className="text-gray-500 italic">없음</span>}
                </div>
                {/* 태그 추천 API 영역 */}
            </div>

            <div className="space-y-4">
                {results.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-8">검색 결과가 없습니다.</p>
                ) : (
                    results.map(item => (
                        <div key={item.code} className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200">
                            <h4 className="text-xl font-semibold text-indigo-700">{item.title}</h4>
                            <p className="mt-1 text-gray-600">
                                <span className="font-bold text-green-600">{item.pay}</span> / 
                                <span className="ml-1 text-sm font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{item.paymentType}</span>
                            </p>
                        </div>
                    ))
                )}
            </div>
            {/* 페이지네이션/더보기 버튼 UI */}
        </div>
    );
};

export default CommissionSearchResultPage;