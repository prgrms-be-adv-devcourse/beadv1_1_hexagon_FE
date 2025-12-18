import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const ContractDetailPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);


  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/contracts/${code}`);
      const payload = res?.data?.data ?? {};
      setDetail(payload);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || '계약 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleCancel = async () => {
    if (!code) return;
    if (!window.confirm('정말 이 계약을 취소하시겠습니까?')) return;
    setCancelLoading(true);
    try {
      const res = await api.post(`/contracts/${code}/cancel`, {}, {
        validateStatus: () => true, // 수동 처리
      });
      if (res.status >= 200 && res.status < 300) {
        alert('계약이 취소되었습니다.');
        // 상세 재조회 또는 목록으로 이동
        await fetchDetail();
      } else {
        const backendMsg = res?.data?.message || res?.statusText || '';
        alert(`계약을 취소하지 못했습니다.${backendMsg ? `\n사유: ${backendMsg}` : ''}`);
      }
    } catch (e) {
      const backendMsg = e?.response?.data?.message || e?.message || '';
      alert(`계약을 취소하지 못했습니다.${backendMsg ? `\n사유: ${backendMsg}` : ''}`);
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl">계약 정보 로딩 중...</div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl text-red-700">{error}</div>
    );
  }

  if (!detail) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl">표시할 계약 정보가 없습니다.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">계약 상세</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
        >
          돌아가기
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded border">
            <div className="text-xs text-slate-500">계약 코드</div>
            <div className="font-mono text-sm">{code || detail.contractCode || '-'}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded border">
            <div className="text-xs text-slate-500">상태</div>
            <div className="font-semibold">{detail.status || '-'}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded border">
            <div className="text-xs text-slate-500">클라이언트</div>
            <div>{detail.clientName || '-'}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded border">
            <div className="text-xs text-slate-500">프리랜서</div>
            <div>{detail.freelancerName || '-'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded border">
            <div className="text-xs text-slate-500">생성일</div>
            <div className="font-medium">{formatDateTime(detail.createdAt)}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded border">
            <div className="text-xs text-slate-500">시작일</div>
            <div className="font-medium">{formatDateTime(detail.startedAt)}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded border">
            <div className="text-xs text-slate-500">종료일</div>
            <div className="font-medium">{formatDateTime(detail.endedAt)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded border">
            <div className="text-xs text-slate-500">결제 방식</div>
            <div>{detail.paymentType || '-'}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded border">
            <div className="text-xs text-slate-500">계약명</div>
            <div className="font-semibold">{detail.name || '-'}</div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded border">
          <div className="text-xs text-slate-500 mb-1">계약 내용</div>
          <pre className="whitespace-pre-wrap break-words text-sm">{detail.body || '-'}</pre>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-2">
        <button
          onClick={fetchDetail}
          className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition"
        >
          새로고침
        </button>
        <button
          onClick={handleCancel}
          disabled={cancelLoading}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${cancelLoading ? 'bg-red-300 text-white cursor-wait' : 'bg-red-600 text-white hover:bg-red-700'}`}
        >
          {cancelLoading ? '취소 처리 중...' : '계약 취소'}
        </button>
      </div>
    </div>
  );
};

export default ContractDetailPage;
