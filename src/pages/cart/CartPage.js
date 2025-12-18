import React, { useEffect, useState } from "react";
import axios from "axios"; // 실제 사용 시 필요
import {
    Trash2,
    CreditCard,
    Calendar,
    User,
    FileText,
    CheckCircle,
    ShoppingBag,
    AlertCircle,
    X,          // 삭제용 X 아이콘
    Sparkles,   // AI 추천용 아이콘
    Bot         // AI 봇 아이콘
} from "lucide-react";

const CartPage = () => {
    const [cartGroups, setCartGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- AI 추천 팝업 관련 상태 ---
    const [aiModal, setAiModal] = useState({
        isOpen: false,
        content: "",
        isLoading: false,
        targetTitle: ""
    });

    // ----------------------------------------------------------------------
    // 1. Mock Data (기본 데이터)
    // ----------------------------------------------------------------------
    const MOCK_DATA = [
        {
            commissionCode: "COM-2024-001",
            startedAt: "2024-05-01T09:00:00Z",
            endedAt: "2024-06-30T18:00:00Z",
            paymentType: "FIXED",
            amount: 4500000,
            contractInfos: [
                {
                    contractCode: "CTR-A001",
                    itemCode: "ITEM-101",
                    clientName: "주식회사 테크",
                    freelancerName: "김개발",
                    freelancerCode: "DEV-001",
                    isRecommend: true,
                    contractTitle: "쇼핑몰 프론트엔드 개발 (React)",
                },
                {
                    contractCode: "CTR-A002",
                    itemCode: "ITEM-102",
                    clientName: "주식회사 테크",
                    freelancerName: "이서버",
                    freelancerCode: "DEV-002",
                    isRecommend: false,
                    contractTitle: "쇼핑몰 백엔드 API 설계",
                }
            ]
        },
        {
            commissionCode: "COM-2024-002",
            startedAt: "2024-07-01T09:00:00Z",
            endedAt: "2024-07-15T18:00:00Z",
            paymentType: "FLAT",
            amount: 500000,
            contractInfos: [
                {
                    contractCode: "CTR-B001",
                    itemCode: "ITEM-201",
                    clientName: "스타트업 A",
                    freelancerName: "박디자인",
                    freelancerCode: "DES-005",
                    isRecommend: true,
                    contractTitle: "모바일 앱 로고 및 아이콘 디자인",
                }
            ]
        }
    ];

    // ----------------------------------------------------------------------
    // 2. 데이터 조회
    // ----------------------------------------------------------------------
    const fetchCartItems = async () => {
        setLoading(true);

        // [Mock]
        setTimeout(() => {
            setCartGroups(MOCK_DATA);
            setLoading(false);
        }, 600);

        // [Real API]
        /*
        try {
          const response = await axios.get("/api/cart");
          setCartGroups(response.data.data || []);
        } catch (error) {
          console.error("장바구니 조회 실패:", error);
        } finally {
          setLoading(false);
        }
        */
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    // ----------------------------------------------------------------------
    // 3. 삭제 핸들러 (X 버튼)
    // ----------------------------------------------------------------------
    const handleDelete = async (itemCode) => {
        if (!window.confirm("정말 이 아이템을 삭제하시겠습니까?")) return;

        // [Mock] 로컬 상태 즉시 반영
        setCartGroups(prevGroups => {
            return prevGroups.map(group => ({
                ...group,
                contractInfos: group.contractInfos.filter(c => c.itemCode !== itemCode)
            })).filter(group => group.contractInfos.length > 0);
        });

        // [Real API]
        /*
        try {
          await axios.delete(`/api/cart/${itemCode}`);
          // fetchCartItems(); // 목록 새로고침
        } catch (error) {
          console.error("아이템 삭제 실패:", error);
          alert("삭제 처리에 실패했습니다.");
        }
        */
    };

    // ----------------------------------------------------------------------
    // 4. 결제 핸들러
    // ----------------------------------------------------------------------
    const handlePay = async () => {
        if (cartGroups.length === 0) return;
        const allItemCodes = cartGroups.flatMap(g => g.contractInfos.map(c => c.itemCode));
        alert(`[TEST] 결제 요청 진행: ${allItemCodes.length}건`);
    };

    // ----------------------------------------------------------------------
    // 5. AI 추천 사유 조회 핸들러
    // ----------------------------------------------------------------------
    const handleOpenAiRecommend = async (contract) => {
        // 모달 열기 & 로딩 시작
        setAiModal({
            isOpen: true,
            content: "",
            isLoading: true,
            targetTitle: contract.contractTitle
        });

        // [Mock] 가짜 AI 응답 생성
        setTimeout(() => {
            const mockReason = `이 프리랜서는 '${contract.freelancerName}'님은 과거 유사한 프로젝트에서 
평점 4.9점을 기록했으며, 특히 ${contract.contractTitle} 관련 기술 스택(React, Node.js 등) 보유자로서
의뢰하신 요구사항과 95% 이상 일치하여 추천되었습니다.`;

            setAiModal(prev => ({
                ...prev,
                isLoading: false,
                content: mockReason
            }));
        }, 1500); // 1.5초 딜레이

        // [Real API]
        /*
        try {
          // 예: POST /api/ai/recommend-reason { contractCode: ... }
          const response = await axios.post("/api/ai/recommend-reason", {
            contractCode: contract.contractCode
          });
          setAiModal(prev => ({
            ...prev,
            isLoading: false,
            content: response.data.data.reason // 응답 구조에 맞게 수정
          }));
        } catch (error) {
          setAiModal(prev => ({
            ...prev,
            isLoading: false,
            content: "추천 사유를 불러오는 데 실패했습니다."
          }));
        }
        */
    };

    const closeAiModal = () => {
        setAiModal(prev => ({ ...prev, isOpen: false }));
    };

    // ----------------------------------------------------------------------
    // 헬퍼 함수
    // ----------------------------------------------------------------------
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
    };

    const formatCurrency = (amount) => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);
    const getPaymentLabel = (type) => ({ HOURLY: "시급제", FIXED: "고정급", FLAT: "건당" }[type] || type);
    const totalPaymentAmount = cartGroups.reduce((acc, group) => acc + (group.amount || 0), 0);


    // ----------------------------------------------------------------------
    // 렌더링
    // ----------------------------------------------------------------------
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[50vh] text-gray-500">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                <p>장바구니 목록을 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen relative">

            {/* 헤더 */}
            <div className="mb-8 flex items-center gap-3 border-b border-gray-200 pb-4">
                <ShoppingBag className="text-blue-600" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">장바구니</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-2">
          {cartGroups.reduce((acc, group) => acc + group.contractInfos.length, 0)}건
        </span>
            </div>

            <div className="space-y-8">
                {cartGroups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center bg-white p-16 rounded-xl shadow-sm border border-gray-100 text-center">
                        <AlertCircle size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg mb-6">장바구니가 비어있습니다.</p>
                    </div>
                ) : (
                    cartGroups.map((group, index) => (
                        <div key={`${group.commissionCode}-${index}`} className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">

                            {/* 그룹 헤더 */}
                            <div className="bg-slate-50 p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                    <span className="font-mono bg-white border border-gray-200 px-2 py-0.5 rounded text-xs text-gray-500">
                      {group.commissionCode}
                    </span>
                                        <span className="text-sm font-medium text-slate-500 px-2 py-0.5 bg-slate-200 rounded-full text-xs">
                      {getPaymentLabel(group.paymentType)}
                    </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span>{formatDate(group.startedAt)} ~ {formatDate(group.endedAt)}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col md:items-end">
                                    <span className="text-xs text-gray-500 mb-1">그룹 소계</span>
                                    <span className="text-xl font-bold text-gray-900">{formatCurrency(group.amount)}</span>
                                </div>
                            </div>

                            {/* 계약 리스트 */}
                            <div className="divide-y divide-gray-100">
                                {group.contractInfos.map((contract) => (
                                    <div key={contract.itemCode} className="relative p-6 hover:bg-blue-50/50 transition-colors group">

                                        {/* [기능 1] 우측 상단 X 버튼 (삭제) */}
                                        <button
                                            onClick={() => handleDelete(contract.itemCode)}
                                            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            title="삭제하기"
                                        >
                                            <X size={20} />
                                        </button>

                                        <div className="pr-10"> {/* X 버튼 공간 확보 */}
                                            <div className="flex items-center gap-2 mb-2">
                                                {/* 추천 뱃지 */}
                                                {contract.isRecommend && (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded border border-orange-200">
                             <CheckCircle size={10} /> 추천
                          </span>
                                                )}
                                                <h4 className="font-bold text-gray-800 text-lg leading-tight flex items-center gap-2">
                                                    <FileText size={18} className="text-gray-400"/>
                                                    {contract.contractTitle}
                                                </h4>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                                                    <User size={14} className="text-gray-400"/>
                                                    <span>프리랜서: <span className="font-semibold text-gray-700">{contract.freelancerName}</span></span>
                                                </div>
                                            </div>

                                            {/* [기능 2] AI 추천 사유 보기 버튼 */}
                                            <button
                                                onClick={() => handleOpenAiRecommend(contract)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:shadow-sm transition-all"
                                            >
                                                <Sparkles size={14} className="text-purple-600" />
                                                AI 매칭 분석 보기
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer: 결제 버튼 */}
            {cartGroups.length > 0 && (
                <div className="mt-8 bg-white p-6 rounded-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border border-blue-100 sticky bottom-4 z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                                <CreditCard size={24} />
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-sm text-gray-500 mb-0.5 font-medium">총 결제 예정 금액</p>
                                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    {formatCurrency(totalPaymentAmount)}
                                </p>
                            </div>
                        </div>
                        <button onClick={handlePay} className="w-full sm:w-auto px-12 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2">
                            결제하기
                        </button>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* AI 추천 사유 모달 (Popup) */}
            {/* ========================================================= */}
            {aiModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-purple-100">
                        {/* 모달 헤더 */}
                        <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <Bot size={24} />
                                <h3 className="text-lg font-bold">AI 매칭 분석 리포트</h3>
                            </div>
                            <button onClick={closeAiModal} className="text-white/80 hover:text-white hover:bg-purple-500 rounded-full p-1 transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* 모달 내용 */}
                        <div className="p-6">
                            <h4 className="text-sm text-gray-500 font-semibold mb-2">대상 계약</h4>
                            <p className="text-gray-900 font-bold mb-6 border-l-4 border-purple-500 pl-3">
                                {aiModal.targetTitle}
                            </p>

                            <h4 className="text-sm text-gray-500 font-semibold mb-2 flex items-center gap-1">
                                <Sparkles size={14} className="text-purple-500"/> AI 분석 내용
                            </h4>

                            <div className="bg-purple-50 p-4 rounded-xl text-gray-700 leading-relaxed min-h-[120px]">
                                {aiModal.isLoading ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-2 py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                                        <span className="text-sm text-purple-600 font-medium animate-pulse">AI가 데이터를 분석 중입니다...</span>
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-line text-sm">{aiModal.content}</p>
                                )}
                            </div>
                        </div>

                        {/* 모달 푸터 */}
                        <div className="p-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={closeAiModal}
                                className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CartPage;