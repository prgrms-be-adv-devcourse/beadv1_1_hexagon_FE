import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api";

const CommissionSearchResultPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // ===== 1) URL에서 현재 필터값 읽기 =====
    const query = searchParams.get("query") || "";
    const scope = searchParams.get("scope") || "ALL";
    const tagsRaw = searchParams.get("tags") || "";
    const paymentType = searchParams.get("payment-type") || "";
    const minPay = searchParams.get("min-pay") || "";
    const startedAt = searchParams.get("started-at") || "";
    const endedAt = searchParams.get("ended-at") || "";
    const openStatus = searchParams.get("open-status") || "ALL";

    const pageFromUrl = Number(searchParams.get("page") ?? 0);
    const sizeFromUrl = Number(searchParams.get("size") ?? 10);

    const safePage =
        Number.isFinite(pageFromUrl) && pageFromUrl >= 0 ? pageFromUrl : 0;
    const safeSize =
        Number.isFinite(sizeFromUrl) && sizeFromUrl >= 1 ? sizeFromUrl : 10;

    // ===== 2) 화면 상태 =====
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(safePage);

    // ===== 3) 입력폼 state =====
    const [inputQuery, setInputQuery] = useState(query);
    const [inputScope, setInputScope] = useState(scope);
    const [inputTagsRaw, setInputTagsRaw] = useState(tagsRaw);
    const [inputPaymentType, setInputPaymentType] = useState(paymentType);
    const [inputMinPay, setInputMinPay] = useState(minPay);
    const [inputStartedAt, setInputStartedAt] = useState(startedAt);
    const [inputEndedAt, setInputEndedAt] = useState(endedAt);
    const [inputOpenStatus, setInputOpenStatus] = useState(openStatus);

    // ============================================================
    // ✅ 12) 키워드(query) 추천
    //    GET /search/commissions/suggest?query=...
    // ============================================================
    const [querySuggestions, setQuerySuggestions] = useState([]); // string[]
    const [querySuggestLoading, setQuerySuggestLoading] = useState(false);
    const [showQuerySuggestions, setShowQuerySuggestions] = useState(false);
    const querySuggestTimerRef = useRef(null);
    const skipNextQuerySuggestRef = useRef(false);

    // ============================================================
    // ✅ 13) 태그(tags) 자동완성 (skill 문자열만 사용)
    //    GET /search/tags/suggest?query=...
    // ============================================================
    const [tagSuggestions, setTagSuggestions] = useState([]); // string[]
    const [tagSuggestLoading, setTagSuggestLoading] = useState(false);
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const tagSuggestTimerRef = useRef(null);
    const skipNextTagSuggestRef = useRef(false);

    // ===== 4) URL 변경되면 입력폼 동기화 =====
    useEffect(() => setInputQuery(query), [query]);
    useEffect(() => setInputScope(scope), [scope]);
    useEffect(() => setInputTagsRaw(tagsRaw), [tagsRaw]);
    useEffect(() => setInputPaymentType(paymentType), [paymentType]);
    useEffect(() => setInputMinPay(minPay), [minPay]);
    useEffect(() => setInputStartedAt(startedAt), [startedAt]);
    useEffect(() => setInputEndedAt(endedAt), [endedAt]);
    useEffect(() => setInputOpenStatus(openStatus), [openStatus]);
    useEffect(() => setCurrentPage(safePage), [safePage]);

    // ===== 5) tags 입력값을 칩으로 보여주기 위한 파싱 =====
    const parsedTagsFromQuery = useMemo(() => {
        return (tagsRaw || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
    }, [tagsRaw]);

    // ===== 6) URL 업데이트 =====
    const updateUrlParams = (next) => {
        const params = new URLSearchParams(searchParams);

        Object.entries(next).forEach(([k, v]) => {
            const value = (v ?? "").toString().trim();
            if (value === "") params.delete(k);
            else params.set(k, value);
        });

        if (!params.get("size")) params.set("size", String(safeSize));
        setSearchParams(params);
    };

    // ===== 7) 검색 실행 =====
    const onSearch = () => {
        // 검색 버튼 누르면 추천 닫기
        setShowQuerySuggestions(false);
        setShowTagSuggestions(false);

        updateUrlParams({
            query: inputQuery,
            scope: inputScope,
            tags: inputTagsRaw,
            "payment-type": inputPaymentType,
            "min-pay": inputMinPay,
            "started-at": inputStartedAt,
            "ended-at": inputEndedAt,
            "open-status": inputOpenStatus,
            page: "0",
            size: String(safeSize),
        });
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") onSearch();
    };

    // ===== 8) 페이지 이동 =====
    const movePage = (nextPage) => {
        if (nextPage < 0) return;
        updateUrlParams({ page: String(nextPage) });
    };

    // ===== 9) content 미리보기 =====
    const truncateText = (text, maxLen = 30) => {
        if (!text) return "";
        return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
    };

    // 날짜 표시(빈 값이면 -)
    const formatRange = (s, e) => {
        const a = s || "-";
        const b = e || "-";
        return `${a} ~ ${b}`;
    };

    // ===== 10) 검색 결과 API 의존성 키 =====
    const depsKey = useMemo(() => {
        return [
            query,
            scope,
            tagsRaw,
            paymentType,
            minPay,
            startedAt,
            endedAt,
            openStatus,
            currentPage,
            safeSize,
        ].join("|");
    }, [
        query,
        scope,
        tagsRaw,
        paymentType,
        minPay,
        startedAt,
        endedAt,
        openStatus,
        currentPage,
        safeSize,
    ]);

    // ===== 11) 검색 결과 API 호출 =====
    useEffect(() => {
        const controller = new AbortController();

        const fetch = async () => {
            setLoading(true);
            try {
                const response = await api.get("/search/commissions", {
                    signal: controller.signal,
                    params: {
                        query,
                        scope,
                        tags: tagsRaw,
                        "payment-type": paymentType,
                        "min-pay": minPay,
                        "started-at": startedAt,
                        "ended-at": endedAt,
                        "open-status": openStatus,
                        page: currentPage,
                        size: safeSize,
                    },
                });

                setResults(response.data?.data?.content ?? []);
            } catch (error) {
                if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED")
                    return;
                console.error("의뢰글 검색 실패:", error);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetch();
        return () => controller.abort();
    }, [depsKey]);

    // ============================================================
    // ✅ 12) 키워드 추천 API 호출
    // ============================================================
    useEffect(() => {
        if (skipNextQuerySuggestRef.current) {
            skipNextQuerySuggestRef.current = false;
            return;
        }

        const q = (inputQuery ?? "").trim();

        if (q.length === 0) {
            setQuerySuggestions([]);
            setShowQuerySuggestions(false);
            setQuerySuggestLoading(false);
            return;
        }

        if (querySuggestTimerRef.current)
            clearTimeout(querySuggestTimerRef.current);

        const controller = new AbortController();

        querySuggestTimerRef.current = setTimeout(async () => {
            setQuerySuggestLoading(true);
            try {
                const res = await api.get("/search/commissions/suggest", {
                    signal: controller.signal,
                    params: { query: q },
                });

                const list = res.data?.data ?? [];
                setQuerySuggestions(Array.isArray(list) ? list : []);
                setShowQuerySuggestions(true);
            } catch (err) {
                if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED")
                    return;
                console.error("의뢰글 키워드 추천 조회 실패:", err);
                setQuerySuggestions([]);
                setShowQuerySuggestions(false);
            } finally {
                if (!controller.signal.aborted) setQuerySuggestLoading(false);
            }
        }, 250);

        return () => {
            controller.abort();
            if (querySuggestTimerRef.current)
                clearTimeout(querySuggestTimerRef.current);
        };
    }, [inputQuery]);

    const onPickQuerySuggestion = (text) => {
        skipNextQuerySuggestRef.current = true;
        setInputQuery(text);
        setShowQuerySuggestions(false);
    };

    // ============================================================
    // ✅ 13) 태그 자동완성 (마지막 토큰만)
    // ============================================================
    const lastTagToken = useMemo(() => {
        const raw = inputTagsRaw ?? "";
        const parts = raw.split(",");
        return (parts[parts.length - 1] ?? "").trim();
    }, [inputTagsRaw]);

    useEffect(() => {
        if (skipNextTagSuggestRef.current) {
            skipNextTagSuggestRef.current = false;
            return;
        }

        const q = (lastTagToken ?? "").trim();

        if (q.length === 0) {
            setTagSuggestions([]);
            setShowTagSuggestions(false);
            setTagSuggestLoading(false);
            return;
        }

        if (tagSuggestTimerRef.current) clearTimeout(tagSuggestTimerRef.current);

        const controller = new AbortController();

        tagSuggestTimerRef.current = setTimeout(async () => {
            setTagSuggestLoading(true);
            try {
                const res = await api.get("/search/tags/suggest", {
                    signal: controller.signal,
                    params: { query: q },
                });

                const rawList = res.data?.data ?? [];
                const skills = Array.isArray(rawList)
                    ? rawList.map((x) => x?.skill).filter(Boolean)
                    : [];

                setTagSuggestions(skills);
                setShowTagSuggestions(true);
            } catch (err) {
                if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED")
                    return;
                console.error("태그 자동완성 조회 실패:", err);
                setTagSuggestions([]);
                setShowTagSuggestions(false);
            } finally {
                if (!controller.signal.aborted) setTagSuggestLoading(false);
            }
        }, 250);

        return () => {
            controller.abort();
            if (tagSuggestTimerRef.current)
                clearTimeout(tagSuggestTimerRef.current);
        };
    }, [lastTagToken]);

    const onPickTagSuggestion = (skill) => {
        skipNextTagSuggestRef.current = true;

        const current = inputTagsRaw ?? "";
        const parts = current.split(",");

        parts[parts.length - 1] = ` ${skill}`;

        const next = parts
            .map((p) => p.trim())
            .filter((p) => p.length > 0)
            .join(", ");

        setInputTagsRaw(next);
        setShowTagSuggestions(false);
    };

    // ===== 화면 =====
    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
                🔎 의뢰글 검색
            </h2>

            {/* 검색 폼 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* query + 추천 */}
                    <div className="md:col-span-2 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            키워드
                        </label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            placeholder="예: 백엔드"
                            value={inputQuery}
                            onChange={(e) => setInputQuery(e.target.value)}
                            onKeyDown={onKeyDown}
                            onFocus={() => {
                                if ((inputQuery ?? "").trim().length > 0 && querySuggestions.length > 0) {
                                    setShowQuerySuggestions(true);
                                }
                            }}
                            onBlur={() => setTimeout(() => setShowQuerySuggestions(false), 150)}
                        />

                        {showQuerySuggestions && (
                            <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow-md overflow-hidden">
                                {querySuggestLoading && (
                                    <div className="px-3 py-2 text-sm text-gray-500">
                                        추천 검색어 불러오는 중...
                                    </div>
                                )}

                                {!querySuggestLoading && querySuggestions.length === 0 && (
                                    <div className="px-3 py-2 text-sm text-gray-500">
                                        추천 검색어가 없습니다.
                                    </div>
                                )}

                                {!querySuggestLoading &&
                                    querySuggestions.map((s, idx) => (
                                        <button
                                            key={`${s}-${idx}`}
                                            type="button"
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => onPickQuerySuggestion(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* scope */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            검색 범위
                        </label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={inputScope}
                            onChange={(e) => setInputScope(e.target.value)}
                        >
                            <option value="ALL">제목 + 내용</option>
                            <option value="TITLE">제목</option>
                            <option value="CONTENT">내용</option>
                        </select>
                    </div>

                    {/* open-status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            마감 여부
                        </label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={inputOpenStatus}
                            onChange={(e) => setInputOpenStatus(e.target.value)}
                        >
                            <option value="ALL">전체</option>
                            <option value="OPEN">모집중</option>
                            <option value="CLOSED">마감</option>
                        </select>
                    </div>
                </div>

                {/* tags + 자동완성 */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        태그 (콤마로 구분)
                    </label>

                    <div className="relative">
                        <input
                            className="w-full border rounded px-3 py-2"
                            placeholder="예: Backend, JPA"
                            value={inputTagsRaw}
                            onChange={(e) => setInputTagsRaw(e.target.value)}
                            onKeyDown={onKeyDown}
                            onFocus={() => {
                                if ((lastTagToken ?? "").trim().length > 0 && tagSuggestions.length > 0) {
                                    setShowTagSuggestions(true);
                                }
                            }}
                            onBlur={() => setTimeout(() => setShowTagSuggestions(false), 150)}
                        />

                        {showTagSuggestions && (
                            <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow-md overflow-hidden">
                                {tagSuggestLoading && (
                                    <div className="px-3 py-2 text-sm text-gray-500">
                                        태그 추천 불러오는 중...
                                    </div>
                                )}

                                {!tagSuggestLoading && tagSuggestions.length === 0 && (
                                    <div className="px-3 py-2 text-sm text-gray-500">
                                        추천 태그가 없습니다.
                                    </div>
                                )}

                                {!tagSuggestLoading &&
                                    tagSuggestions.map((skill, idx) => (
                                        <button
                                            key={`${skill}-${idx}`}
                                            type="button"
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => onPickTagSuggestion(skill)}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* 태그 칩 */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {parsedTagsFromQuery.map((t) => (
                            <span
                                key={t}
                                className="px-3 py-1 text-sm bg-indigo-200 text-indigo-800 rounded-full font-medium"
                            >
                #{t}
              </span>
                        ))}
                        {parsedTagsFromQuery.length === 0 && (
                            <span className="text-gray-500 italic">태그 없음</span>
                        )}
                    </div>
                </div>

                {/* payment-type + min-pay + size */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            지급 방식 (payment-type)
                        </p>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentType"
                                    value="MONTHLY"
                                    checked={inputPaymentType === "MONTHLY"}
                                    onChange={() => setInputPaymentType("MONTHLY")}
                                />
                                <span>월급</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentType"
                                    value="PER_JOB"
                                    checked={inputPaymentType === "PER_JOB" || inputPaymentType === "PERJOB"}
                                    onChange={() => setInputPaymentType("PER_JOB")}
                                />
                                <span>건당</span>
                            </label>

                            <button
                                type="button"
                                className="ml-auto text-sm px-3 py-2 rounded bg-gray-200"
                                onClick={() => setInputPaymentType("")}
                            >
                                선택 해제
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            최소 급여
                        </label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            placeholder="예: 500000"
                            value={inputMinPay}
                            onChange={(e) => {
                                const v = e.target.value;
                                if (v === "" || /^\d+$/.test(v)) setInputMinPay(v);
                            }}
                            onKeyDown={onKeyDown}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            페이지 크기 (size)
                        </label>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={String(safeSize)}
                            onChange={(e) => updateUrlParams({ size: e.target.value, page: "0" })}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                    </div>
                </div>

                {/* dates */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            시작일 (started-at)
                        </label>
                        <input
                            type="date"
                            className="w-full border rounded px-3 py-2"
                            value={inputStartedAt}
                            onChange={(e) => setInputStartedAt(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            종료일 (ended-at)
                        </label>
                        <input
                            type="date"
                            className="w-full border rounded px-3 py-2"
                            value={inputEndedAt}
                            onChange={(e) => setInputEndedAt(e.target.value)}
                        />
                    </div>
                </div>

                {/* buttons */}
                <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 rounded bg-indigo-600 text-white" onClick={onSearch}>
                        검색
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-gray-200"
                        onClick={() => {
                            setInputQuery("");
                            setInputScope("ALL");
                            setInputTagsRaw("");
                            setInputPaymentType("");
                            setInputMinPay("");
                            setInputStartedAt("");
                            setInputEndedAt("");
                            setInputOpenStatus("ALL");

                            setQuerySuggestions([]);
                            setShowQuerySuggestions(false);
                            setTagSuggestions([]);
                            setShowTagSuggestions(false);

                            updateUrlParams({
                                query: "",
                                scope: "ALL",
                                tags: "",
                                "payment-type": "",
                                "min-pay": "",
                                "started-at": "",
                                "ended-at": "",
                                "open-status": "ALL",
                                page: "0",
                            });
                        }}
                    >
                        초기화
                    </button>
                </div>
            </div>

            {/* 로딩 */}
            {loading && (
                <div className="p-3 mb-4 text-center text-gray-600 bg-gray-50 rounded">
                    의뢰글 검색 중...
                </div>
            )}

            {/* 결과 리스트 */}
            <div className="space-y-4">
                {results.length === 0 && !loading ? (
                    <p className="text-gray-500 italic text-center py-8">검색 결과가 없습니다.</p>
                ) : (
                    results.map((item) => (
                        <div
                            key={item.code}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigate(`/commission/${item.code}`)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    navigate(`/commission/${item.code}`);
                                }
                            }}
                            className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        >
                            <h4 className="text-xl font-semibold text-indigo-700">{item.title}</h4>

                            {item.content && (
                                <p className="mt-2 text-gray-700">{truncateText(item.content, 30)}</p>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                {/* ✅ 닉네임 클릭 -> members/{memberCode} (카드 클릭 막기 위해 stopPropagation) */}
                                <button
                                    type="button"
                                    className="font-medium text-gray-800 hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/member/${item.memberCode}`);
                                    }}
                                    onKeyDown={(e) => {
                                        // 카드의 onKeyDown으로 이벤트가 올라가는 것도 막아줌
                                        e.stopPropagation();
                                        if (e.key === "Enter" || e.key === " ") {
                                            navigate(`/member/${item.memberCode}`);
                                        }
                                    }}
                                >
                                    {item.memberNickname}
                                </button>

                                <span className="text-gray-400">|</span>
                                <span>기간: {formatRange(item.startedAt, item.endedAt)}</span>

                                {typeof item.isOpen === "boolean" && (
                                    <span
                                        className={
                                            "ml-auto text-xs px-2 py-0.5 rounded-full border " +
                                            (item.isOpen
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-gray-50 text-gray-600 border-gray-200")
                                        }
                                    >
              {item.isOpen ? "모집중" : "마감"}
            </span>
                                )}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {(item.tags ?? []).map((t) => (
                                    <span
                                        key={t}
                                        className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full"
                                    >
              #{t}
            </span>
                                ))}
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-bold text-green-600">
            {item.payAmount?.toLocaleString?.() ?? item.payAmount}원
          </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
            {item.paymentType}
          </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 이전/다음 */}
            <div className="flex justify-between mt-6">
                <button
                    className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                    disabled={currentPage === 0}
                    onClick={() => movePage(currentPage - 1)}
                >
                    이전
                </button>

                <button
                    className="px-4 py-2 rounded bg-gray-200"
                    onClick={() => movePage(currentPage + 1)}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default CommissionSearchResultPage;