import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const DepositPage = () => {
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDeposits = async () => {
    setLoading(true);
    setError(null);
    try {
      // 로컬 스토리지의 액세스 토큰 가져오기 (Bearer 접두어 제거)
      let token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }
      if (token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "");
      }

      const res = await api.get("/deposits", {
        headers: {
          "X-CODE": token,
        },
      });

      // 응답 스키마: { code, httpStatus, message, data: { amount } }
      const value = res?.data?.data?.amount;
      setAmount(typeof value === "number" ? value : 0);
    } catch (e) {
      console.error("예치금 조회 실패:", e);
      const msg = e.response?.data?.message || e.message || "조회 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">예치금 정보를 불러오는 중...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        내 예치금
      </h2>

      {error ? (
        <div className="p-4 mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-blue-50 border border-blue-100 shadow-sm text-center">
          <p className="text-gray-600 mb-2">현재 보유 예치금</p>
          <p className="text-4xl font-extrabold text-blue-700">
            {Number(amount || 0).toLocaleString()}원
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          onClick={fetchDeposits}
          className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150"
        >
          새로고침
        </button>
        <button
          onClick={() => navigate('/mypage/deposits/histories')}
          className="px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition duration-150"
        >
          내역 조회
        </button>
      </div>
    </div>
  );
};

export default DepositPage;
