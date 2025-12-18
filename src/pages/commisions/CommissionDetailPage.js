import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Calendar,
    User,
    CreditCard,
    Tag,
    FileText,
    Users,
    CheckCircle,
    AlertCircle,
    Share2,
    Bookmark
} from 'lucide-react';
const mockData = {
    title: "반응형 쇼핑몰 웹사이트 프론트엔드 개발 의뢰",
    content: `안녕하세요, 현재 운영 중인 의류 쇼핑몰의 리뉴얼 프로젝트를 함께하실 프리랜서 개발자분을 모십니다.

[주요 업무]
- Figma 디자인을 바탕으로 React 기반 웹사이트 퍼블리싱 및 개발
- PC/Mobile 반응형 웹 구현
- REST API 연동 (로그인, 상품 목록, 장바구니, 결제 등)

[필수 기술]
- React.js, TypeScript
- Tailwind CSS (또는 Styled Components)
- Git 협업 경험

[우대 사항]
- 쇼핑몰 개발 경험이 있으신 분
- 퍼포먼스 최적화 경험이 있으신 분

[일정]
- 착수일: 2024년 6월 1일
- 마감일: 2024년 7월 31일 (2개월)

관심 있으신 분들의 많은 지원 바랍니다.`,
    paymentType: "FIXED", // 'HOURLY', 'FIXED', 'FLAT'
    unitAmount: 5500000,
    startedAt: "2024-06-01",
    endedAt: "2024-07-31",
    recruitmentStatus: "OPEN", // 'OPEN', 'CLOSED'
    writerName: "김스타트업",
    tagCode: ["React", "TypeScript", "TailwindCSS", "ShoppingMall"],
    plannedHires: 2,
    selectedCount: 1,
    eligibleApplicants: 5,
    appliedCount: 12
};


const CommissionDetail = () => {
    // [수정 포인트 1] 타입 제네릭 <{ code: string }> 제거
    const { code } = useParams();
    const navigate = useNavigate();

    // [수정 포인트 2] useState의 타입 정의 제거
    const [data, setData] = useState(mockData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     if (!code) {
    //         setError("잘못된 접근입니다 (의뢰 코드가 없습니다).");
    //         setLoading(false);
    //         return;
    //     }
    //
    //     const fetchCommission = async () => {
    //         try {
    //             setLoading(true);
    //             setError(null);
    //
    //             const response = await axios.get(`/api/commissions/${code}`);
    //
    //             // 데이터 구조에 맞춰서 수정 (response.data.data 또는 response.data)
    //             const result = response.data.data || response.data;
    //
    //             setData(result);
    //         } catch (err) {
    //             // [수정 포인트 3] catch(err: any) -> catch(err) 로 타입 제거
    //             console.error("데이터 로딩 실패:", err);
    //             setError("의뢰 정보를 불러오는 데 실패했습니다.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //
    //     fetchCommission();
    // }, [code]);

    // --------------------------------------------------------------------
    // 헬퍼 함수들 (매개변수 타입 제거)
    // --------------------------------------------------------------------

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount);
    };

    const getPaymentLabel = (type) => {
        const map = {
            HOURLY: '시급',
            FIXED: '고정급',
            FLAT: '건당 지급',
        };
        return map[type] || type;
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'OPEN':
            case 'RECRUITING':
                return (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-1">
            <CheckCircle size={14} /> 모집중
          </span>
                );
            case 'CLOSED':
            case 'COMPLETED':
                return (
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-bold flex items-center gap-1">
            <AlertCircle size={14} /> 마감됨
          </span>
                );
            default:
                return (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
            {status}
          </span>
                );
        }
    };

    // --------------------------------------------------------------------
    // 렌더링 로직
    // --------------------------------------------------------------------

    if (!loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl text-gray-500 font-medium">데이터를 불러오는 중입니다...</div>
            </div>
        );
    }

    // if (error || !data) {
    //     return (
    //         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
    //             <div className="text-xl text-red-500 font-bold">{error || "데이터가 없습니다."}</div>
    //             <button
    //                 onClick={() => navigate(-1)}
    //                 className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
    //             >
    //                 뒤로 가기
    //             </button>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header Section */}
                <div className="p-6 md:p-8 border-b border-gray-100 bg-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            {getStatusBadge(data.recruitmentStatus)}
                            <span className="text-gray-400 text-xs font-mono">CODE: {code}</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <User size={16} />
                                <span className="font-medium text-gray-700">{data.writerName}</span>
                            </div>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>{data.startedAt} ~ {data.endedAt}</span>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                        {data.title}
                    </h1>

                    {/* Tags */}
                    {data.tagCode && data.tagCode.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {data.tagCode.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                                >
                  <Tag size={12} className="mr-1" />
                                    {tag}
                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats & Info Grid */}
                <div className="bg-slate-50 border-b border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">

                        {/* Payment Info */}
                        <div className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-white rounded-full text-blue-600 shadow-sm border border-gray-100">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">지급 방식</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-blue-600 font-bold">{getPaymentLabel(data.paymentType)}</span>
                                    <span className="text-lg font-bold text-gray-900">{formatCurrency(data.unitAmount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recruitment Progress */}
                        <div className="p-6 flex flex-col justify-center">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">총 모집 인원</p>
                            <div className="flex items-center gap-2">
                                <Users size={20} className="text-gray-400" />
                                <span className="text-2xl font-bold text-gray-900">{data.plannedHires}명</span>
                            </div>
                        </div>

                        {/* Applicant Stats */}
                        <div className="p-6 flex flex-col justify-center">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">지원 현황</p>
                            <div className="flex items-center gap-4">
                                <div>
                                    <span className="block text-xl font-bold text-gray-900">{data.appliedCount}</span>
                                    <span className="text-xs text-gray-500">지원함</span>
                                </div>
                                <div className="h-8 w-px bg-gray-200"></div>
                                <div>
                                    <span className="block text-xl font-bold text-blue-600">{data.eligibleApplicants}</span>
                                    <span className="text-xs text-gray-500">적격</span>
                                </div>
                            </div>
                        </div>

                        {/* Selection Stats */}
                        <div className="p-6 flex flex-col justify-center bg-blue-50/50">
                            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">선발 완료</p>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={20} className="text-green-500" />
                                <span className="text-2xl font-bold text-gray-900">{data.selectedCount}명</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Main Content */}
                <div className="p-8 md:p-10 min-h-[400px]">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-2">
                        <FileText size={20} className="text-gray-500" />
                        상세 의뢰 내용
                    </h3>

                    <div className="prose prose-slate max-w-none text-gray-700 leading-8 whitespace-pre-wrap">
                        {data.content}
                    </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-0">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition shadow-sm">
                            <Share2 size={18} /> 공유
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition shadow-sm">
                            <Bookmark size={18} /> 스크랩
                        </button>
                    </div>

                    <button className="w-full sm:w-auto px-10 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2">
                        지원하기
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CommissionDetail;