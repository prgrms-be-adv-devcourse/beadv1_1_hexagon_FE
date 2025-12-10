import React, { useEffect, useState } from 'react';
import api from '../../api/api';

const TagManagementPage = () => {
    const [myTags, setMyTags] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTags = async () => {
        setLoading(true);
        try {
            // GET /api/tags/me
            const myResponse = await api.get('/tags/me');
            setMyTags(myResponse.data.data || []);

            // GET /api/tags
            const allResponse = await api.get('/tags');
            setAllTags(allResponse.data.data || []);
            
        } catch (error) {
            console.error("태그 정보 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleToggleTag = async (tagCode, isLinked) => {
        try {
            if (isLinked) {
                // DELETE /api/tags/member-tags/{tagCode}
                await api.delete(`/tags/member-tags/${tagCode}`);
                alert("태그 연결이 해제되었습니다.");
            } else {
                // POST /api/tags/member-tags/{tagCode}
                await api.post(`/tags/member-tags/${tagCode}`);
                alert("태그가 연결되었습니다.");
            }
            fetchTags(); // 목록 새로고침
        } catch (error) {
            console.error("태그 연결/해제 실패:", error);
            alert("태그 연결/해제 실패: " + error.response?.data.message);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-600">태그 관리 정보 로딩 중...</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-xl">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">🏷️ 기술 태그 관리</h2>
            
            <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-blue-50">
                <p className="font-semibold text-blue-800 mb-2">✅ 현재 보유 태그:</p>
                <div className="flex flex-wrap gap-3">
                    {myTags.map(t => (
                        <span key={t.code} className="px-4 py-1 text-sm font-bold bg-indigo-500 text-white rounded-full shadow-md">
                            {t.skill}
                        </span>
                    ))}
                    {myTags.length === 0 && <span className="text-gray-600 italic">연결된 태그가 없습니다.</span>}
                </div>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-gray-700">전체 태그 목록에서 선택/해제하기:</h3>
            <div className="flex flex-wrap gap-3 p-4 border border-gray-300 rounded-lg">
                {allTags.map(tag => {
                    const isLinked = myTags.some(t => t.code === tag.code);
                    return (
                        <button 
                            key={tag.code} 
                            onClick={() => handleToggleTag(tag.code, isLinked)} 
                            className={`px-4 py-2 text-sm font-medium rounded-full transition duration-150 shadow-sm ${
                                isLinked 
                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {tag.skill} {isLinked ? '✔️ 해제' : '➕ 추가'}
                        </button>
                    );
                })}
            </div>
            {/* 태그 생성 API 영역 (관리자 또는 별도 폼) */}
        </div>
    );
};

export default TagManagementPage;