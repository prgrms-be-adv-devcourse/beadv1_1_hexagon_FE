import React, { useEffect, useState } from "react";
import api from "../../api/api";

const MyPromotionPage = () => {
  const [promotion, setPromotion] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const getXCodeHeader = () => {
    let token = localStorage.getItem("accessToken");
    if (token && token.startsWith("Bearer "))
      token = token.replace("Bearer ", "");
    return token ? { "X-CODE": token } : {};
  };

  const fetchPromotion = () => {
    api
      .get("/self-promotions/me", { headers: getXCodeHeader() })
      .then((res) => setPromotion(res.data.data))
      .catch(() => setPromotion(null));
  };

  useEffect(() => {
    fetchPromotion();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/self-promotions", formData, {
        headers: getXCodeHeader(),
      });
      alert("홍보글이 게시되었습니다!");
      setIsCreating(false);
      fetchPromotion();
    } catch (e) {
      alert("등록 실패: " + (e.response?.data?.message || "오류 발생"));
    }
  };

  if (!promotion && !isCreating) {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          나를 홍보하고 일감을 찾아보세요!
        </h2>
        <p className="text-gray-500 mb-8">
          수주 홍보글을 작성하면 클라이언트들이 당신을 찾을 수 있습니다.
        </p>
        <button
          onClick={() => setIsCreating(true)}
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

      {isCreating ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                홍보 제목
              </label>
              <input
                required
                className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="예: 5년차 풀스택 개발자, 빠른 작업 가능합니다."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                상세 내용
              </label>
              <textarea
                required
                className="w-full p-4 border rounded-xl h-60 outline-none focus:ring-2 focus:ring-indigo-400"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="자신의 강점, 주요 프로젝트 경험 등을 자유롭게 작성하세요."
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700"
              >
                등록 완료
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold"
              >
                취소
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white border-t-8 border-indigo-600 rounded-2xl p-8 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-indigo-900">
              {promotion?.title}
            </h3>
            <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
              노출 중
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-8 p-6 bg-slate-50 rounded-xl italic">
            "{promotion?.content}"
          </p>
          <div className="flex gap-3 justify-end">
            <button className="px-5 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50">
              수정
            </button>
            <button className="px-5 py-2 border border-red-100 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50">
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPromotionPage;
