import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

// 날짜 포맷터: ISO-8601(UTC) → 로컬, 초까지 표시
const formatDateTime = (isoUtc) => {
  if (!isoUtc) return '-';
  try {
    const d = new Date(isoUtc);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
  } catch {
    return isoUtc;
  }
};

const ORDER_OPTIONS = [
  { label: '최신순', value: 'DESC' },
  { label: '오래된순', value: 'ASC' },
];

const MyContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 커서 및 페이지 상태
  const [cursorCode, setCursorCode] = useState(null);
  const [cursorDate, setCursorDate] = useState(null);
  const [hasNext, setHasNext] = useState(false);

  // 정렬(order) 상태: 기본 최신순(DESC)
  const [order, setOrder] = useState('DESC');
  useMemo(() => ORDER_OPTIONS.find(o => o.value === order)?.label || '최신순', [order]);
  const fetchContracts = async ({ append } = { append: true }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/contracts', {
        params: {
          'cursor-date': append ? cursorDate : null,
          'cursor-code': append ? cursorCode : null,
          order,
        }
      });

      // [DEBUG] 응답 구조 로깅 (개발 중 확인용)
      try {
        // eslint-disable-next-line no-console
        console.log('[DEBUG][contracts] res.data =', res?.data);
      } catch (_) {}

      // 응답 스키마: data 아래에 contracts/cursor/hasNext가 들어있음
      const payload = (res && res.data && (res.data.data ?? res.data)) || {};

      // 서버 스펙 우선: contracts, 필요시 다른 키도 방어적 확인
      const rawList = Array.isArray(payload.contracts)
        ? payload.contracts
        : (Array.isArray(payload.contractResponses) ? payload.contractResponses : []);

      // [DEBUG] 파싱 결과 로깅
      try {
        // eslint-disable-next-line no-console
        console.log('[DEBUG][contracts] parsed payload =', {
          hasNext: payload?.hasNext,
          cursorCode: payload?.cursorCode,
          cursorDate: payload?.cursorDate,
          listLen: rawList.length,
        });
      } catch (_) {}

      setHasNext(Boolean(payload?.hasNext));
      setCursorCode(payload?.cursorCode ?? null);
      setCursorDate(payload?.cursorDate ?? null);

      const list = rawList.filter(Boolean);
      setContracts(prev => (append ? [...prev, ...list] : list));
    } catch (e) {
      console.error('계약 목록 조회 실패:', e);
      setError(e?.response?.data?.message || e.message || '계약 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 최초 로드
  useEffect(() => {
    fetchContracts({ append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const handleLoadMore = () => {
    if (!loading && hasNext) {
      fetchContracts({ append: true });
    }
  };

  const handleChangeOrder = (e) => {
    const next = e.target.value;
    if (next !== order) {
      // 정렬 변경 시 처음부터 다시 조회
      setOrder(next);
      setCursorCode(null);
      setCursorDate(null);
      setHasNext(false);
      setContracts([]);
      // fetchContracts는 order 의존 useEffect가 호출
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">내 계약 목록</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600" htmlFor="orderSelect">정렬:</label>
          <select
            id="orderSelect"
            value={order}
            onChange={handleChangeOrder}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
          >
            {ORDER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 rounded-md bg-red-50 border border-red-200 text-red-700">{error}</div>
      )}

      {loading && contracts.length === 0 ? (
        <div className="p-8 text-center text-gray-600">계약 목록 로딩 중...</div>
      ) : contracts.length === 0 ? (
        <div className="p-8 text-center text-gray-500">표시할 계약이 없습니다.</div>
      ) : (
        <div className="space-y-4">
          {contracts.map((c) => (
            <div key={c.contractCode} className="p-4 border border-blue-100 rounded-lg bg-blue-50 shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold text-blue-800">{c.name || '이름 없음'}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-medium bg-blue-200 text-blue-900 rounded-full">{c.status || '-'}</span>
                  {c.contractCode && (
                    <Link
                      to={`/mypage/contracts/${c.contractCode}`}
                      className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 rounded hover:bg-indigo-50"
                    >
                      상세 보기
                    </Link>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-700 grid grid-cols-1 md:grid-cols-3 gap-2">
                <p>생성일: <span className="font-medium">{formatDateTime(c.createdAt)}</span></p>
                <p>시작일: <span className="font-medium">{formatDateTime(c.startedAt)}</span></p>
                <p>종료일: <span className="font-medium">{formatDateTime(c.endedAt)}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        {hasNext && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className={`px-6 py-3 font-semibold rounded-lg transition duration-200 ${loading ? 'bg-gray-300 text-gray-600 cursor-wait' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
          >
            {loading ? '더 불러오는 중...' : '더 보기'}
          </button>
        )}
        {!hasNext && contracts.length > 0 && (
          <p className="text-gray-500">모든 계약을 불러왔습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyContractsPage;
