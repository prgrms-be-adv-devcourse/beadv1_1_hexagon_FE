import React, { useEffect, useState } from "react";
import api from "../../api/api";

const MyPromotionPage = () => {
  const [promotion, setPromotion] = useState(null);

  const getXCodeHeader = () => {
    let token = localStorage.getItem("accessToken");
    if (token && token.startsWith("Bearer "))
      token = token.replace("Bearer ", "");
    return token ? { "X-CODE": token } : {};
  };

  useEffect(() => {
    api
      .get("/self-promotions/me", { headers: getXCodeHeader() })
      .then((res) => setPromotion(res.data.data))
      .catch(() => setPromotion(null));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">내 수주 홍보글</h2>
      {promotion ? (
        <div className="bg-white border-2 border-indigo-100 rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-indigo-900">
              {promotion.title}
            </h3>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">
              활성 상태
            </span>
          </div>
          <hr className="my-4" />
          <p className="whitespace-pre-wrap text-gray-700">
            {promotion.content}
          </p>
          <div className="mt-6 flex gap-2">
            <button className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
              수정하기
            </button>
            <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
              삭제하기
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-500 mb-4">아직 등록된 홍보글이 없습니다.</p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold">
            홍보글 작성하기
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPromotionPage;
