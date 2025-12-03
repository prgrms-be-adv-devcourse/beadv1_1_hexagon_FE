import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';

const ResumeListPage = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // GET /api/resumes
        const fetchResumes = async () => {
            try {
                const response = await api.get('/resumes');
                setResumes(response.data.data || []);
            } catch (error) {
                console.error("이력서 목록 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResumes();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-600">이력서 목록 로딩 중...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-3xl font-bold text-gray-800">📄 내 이력서 목록</h2>
                <Link to="/mypage/resumes/new">
                    <button
                        className="px-5 py-2 text-white bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
                    >
                        새 이력서 등록
                    </button>
                </Link>
            </div>
            
            <div className="space-y-4">
                {resumes.length === 0 ? (
                    <p className="text-gray-500 italic text-center">아직 등록된 이력서가 없습니다.</p>
                ) : (
                    resumes.map(resume => (
                        <div 
                            key={resume.code} 
                            className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition duration-200"
                        >
                            <h4 className="text-xl font-semibold text-gray-700 truncate">
                                {resume.title}
                            </h4>
                            <div className="space-x-3">
                                <Link to={`/mypage/resumes/${resume.code}/edit`}>
                                    <button
                                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-150"
                                    >
                                        수정
                                    </button>
                                </Link>
                                {/* 삭제 버튼 (추가 예정) */}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ResumeListPage;