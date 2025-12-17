import React, { useEffect, useState } from "react";
import api from "../../api/api";

const MyPromotionPage = () => {
  const [promotion, setPromotion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // 백엔드 SelfPromotionCreateRequest 스펙에 맞춘 초기값
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    paymentType: "PER_JOB", // 기본값 설정
    unitAmount: 0,
    resumeCode: null,
  });

  const getXCodeHeader = () => {
    let token = localStorage.getItem("accessToken");
    if (token && token.startsWith("Bearer "))
      token = token.replace("Bearer ", "");
    return token ? { "X-CODE": token } : {};
  };

  const fetchPromotion = () => {
    api
      .get("/self-promotions/me", { headers: getXCodeHeader() })
      .then((res) => {
        if (res.data.data) {
          setPromotion(res.data.data);
          // 수정 시 기존 데이터를 폼에 채워줌
          setFormData({
            title: res.data.data.title,
            content: res.data.data.content,
            paymentType: res.data.data.paymentType,
            unitAmount: res.data.data.unitAmount,
            resumeCode: res.data.data.resumeCode,
          });
        }
      })
      .catch(() => setPromotion(null));
  };

  useEffect(() => {
    fetchPromotion();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (promotion) {
        // 수정 (PATCH /api/self-promotions/{promotionCode})
        await api.patch(
          `/self-promotions/${promotion.promotionCode}`,
          formData,
          {
            headers: getXCodeHeader(),
          }
        );
        alert("홍보글이 수정되었습니다!");
      } else {
        // 등록 (POST /api/self-promotions)
        await api.post("/self-promotions", formData, {
          headers: getXCodeHeader(),
        });
        alert("홍보글이 게시되었습니다!");
      }
      setIsEditing(false);
      fetchPromotion();
    } catch (e) {
      alert("처리 실패: " + (e.response?.data?.message || "오류 발생"));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/self-promotions/${promotion.promotionCode}`, {
        headers: getXCodeHeader(),
      });
      alert("삭제되었습니다.");
      setPromotion(null);
      setFormData({
        title: "",
        content: "",
        paymentType: "PER_JOB",
        unitAmount: 0,
        resumeCode: null,
      });
    } catch (e) {
      alert("삭제 실패");
    }
  };

  // 등록/수정 폼 UI
  if (!promotion && !isEditing) {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          나를 홍보하고 일감을 찾아보세요!
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-indigo-600 text-white px-10 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg"
        >
          홍보글 작성하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">수주 홍보 관리</h2>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              홍보 제목
            </label>
            <input
              required
              className="w-full p-4 border rounded-xl"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                지급 방식
              </label>
              <select
                className="w-full p-4 border rounded-xl"
                value={formData.paymentType}
                onChange={(e) =>
                  setFormData({ ...formData, paymentType: e.target.value })
                }
              >
                <option value="MONTHLY">월급 (MONTHLY)</option>
                <option value="PER_JOB">건당 (PER_JOB)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                단위 금액 (원)
              </label>
              <input
                type="number"
                required
                className="w-full p-4 border rounded-xl"
                value={formData.unitAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unitAmount: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              상세 내용
            </label>
            <textarea
              required
              className="w-full p-4 border rounded-xl h-40"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700"
            >
              저장 완료
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white border-t-8 border-indigo-600 rounded-2xl p-8 shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-indigo-900 mb-2">
                {promotion?.title}
              </h3>
              <p className="text-indigo-600 font-bold">
                {promotion?.paymentType === "MONTHLY" ? "월 " : "건당 "}
                {promotion?.unitAmount?.toLocaleString()}원
              </p>
            </div>
            <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
              노출 중
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-8 p-6 bg-slate-50 rounded-xl">
            {promotion?.content}
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2 border border-red-100 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPromotionPage;
