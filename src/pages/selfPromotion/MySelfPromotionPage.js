import React, { useEffect, useState } from "react";
import api from "../../api/api";

const MyPromotionPage = () => {
  const [promotion, setPromotion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // 1. 내 이력서 목록을 저장할 상태 추가
  const [myResumes, setMyResumes] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    paymentType: "PER_JOB",
    unitAmount: 0,
    resumeCode: "", // 여기에 선택한 이력서 코드가 들어갑니다.
  });

  const getXCodeHeader = () => {
    let token = localStorage.getItem("accessToken");
    if (token && token.startsWith("Bearer "))
      token = token.replace("Bearer ", "");
    return token ? { "X-CODE": token } : {};
  };

  // 2. 이력서 목록 불러오기 함수
  const fetchMyResumes = async () => {
    try {
      // 본인의 전체 이력서 목록을 가져오는 API (백엔드에 맞춰 조정 가능)
      const res = await api.get("/resumes/me", { headers: getXCodeHeader() });
      // 만약 단건 조회라면 배열로 감싸주고, 목록 조회라면 그대로 저장
      const data = Array.isArray(res.data.data)
        ? res.data.data
        : [res.data.data];
      setMyResumes(data.filter((r) => r !== null));
    } catch (e) {
      console.log("이력서 목록 로드 실패");
    }
  };

  const fetchPromotion = () => {
    api
      .get("/self-promotions/me", { headers: getXCodeHeader() })
      .then((res) => {
        if (res.data.data) {
          setPromotion(res.data.data);
          setFormData({
            title: res.data.data.title,
            content: res.data.data.content,
            paymentType: res.data.data.paymentType,
            unitAmount: res.data.data.unitAmount,
            resumeCode: res.data.data.resumeCode || "",
          });
        }
      })
      .catch(() => setPromotion(null));
  };

  useEffect(() => {
    fetchPromotion();
    fetchMyResumes(); // 페이지 로드 시 이력서 목록도 가져옴
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // resumeCode가 빈 문자열이면 null로 처리해서 전송
      const payload = { ...formData, resumeCode: formData.resumeCode || null };

      if (promotion) {
        await api.patch(
          `/self-promotions/${promotion.promotionCode}`,
          payload,
          { headers: getXCodeHeader() }
        );
        alert("홍보글이 수정되었습니다!");
      } else {
        await api.post("/self-promotions", payload, {
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">수주 홍보 관리</h2>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50 space-y-6"
        >
          {/* --- 이력서 선택 섹션 추가 --- */}
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <label className="block text-sm font-bold text-indigo-700 mb-2">
              연결할 이력서 선택
            </label>
            <select
              className="w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-400"
              value={formData.resumeCode}
              onChange={(e) =>
                setFormData({ ...formData, resumeCode: e.target.value })
              }
            >
              <option value="">연결 안 함 (선택 사항)</option>
              {myResumes.map((r) => (
                <option key={r.resumeCode} value={r.resumeCode}>
                  {r.title} (작성일:{" "}
                  {new Date(r.createdAt).toLocaleDateString()})
                </option>
              ))}
            </select>
            <p className="text-xs text-indigo-400 mt-2">
              * 이력서를 연결하면 클라이언트가 내 경력을 더 자세히 볼 수
              있습니다.
            </p>
          </div>

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
        /* ... 기존의 홍보글 카드 UI ... */
        <div className="bg-white border-t-8 border-indigo-600 rounded-2xl p-8 shadow-md">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-indigo-900 mb-2">
                {promotion?.title}
              </h3>
              {promotion?.resumeCode && (
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded font-bold">
                  이력서 연결됨
                </span>
              )}
            </div>
          </div>
          {/* 중략: 기존 내용 출력 */}
          <div className="flex gap-3 justify-end mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50"
            >
              수정
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPromotionPage;
