import React, { useEffect, useState } from "react";
import api from "../../api/api";

const RatingComponent = ({ memberCode }) => {
  const [rating, setRating] = useState({
    satisfiedCount: 0,
    unsatisfiedCount: 0,
  });

  useEffect(() => {
    // 특정 회원 평가 조회 (백엔드: GET /api/ratings/{memberCode})
    api.get(`/ratings/${memberCode}`).then((res) => setRating(res.data.data));
  }, [memberCode]);

  const handleRate = async (type) => {
    try {
      // 평가 업데이트 (백엔드: PATCH /api/ratings/{memberCode})
      const res = await api.patch(
        `/ratings/${memberCode}`,
        { isSatisfied: type === "good" },
        { headers: { "X-CODE": localStorage.getItem("memberCode") } } // 호출자 코드
      );
      setRating(res.data.data);
      alert("평가가 반영되었습니다!");
    } catch (e) {
      alert(e.response?.data?.message || "본인은 평가할 수 없습니다.");
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-around border">
      <button onClick={() => handleRate("good")} className="text-center group">
        <div className="text-2xl group-hover:scale-125 transition">👍</div>
        <div className="text-sm font-bold text-blue-600">
          {rating.satisfiedCount}
        </div>
      </button>
      <div className="h-8 w-px bg-gray-300"></div>
      <button onClick={() => handleRate("bad")} className="text-center group">
        <div className="text-2xl group-hover:scale-125 transition">👎</div>
        <div className="text-sm font-bold text-red-600">
          {rating.unsatisfiedCount}
        </div>
      </button>
    </div>
  );
};
