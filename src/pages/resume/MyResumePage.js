import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/api";

const MyResumePage = () => {
  const [resume, setResume] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const getXCodeHeader = () => {
    let token = localStorage.getItem("accessToken");
    if (token && token.startsWith("Bearer "))
      token = token.replace("Bearer ", "");
    return token ? { "X-CODE": token } : {};
  };

  const fetchResumeData = useCallback(async () => {
    setLoading(true);
    try {
      // 내 이력서 상세 조회 (백엔드: GET /api/resumes/me)
      const res = await api.get("/resumes/me", { headers: getXCodeHeader() });
      const data = res.data.data;
      setResume(data);
      setExperiences(data.experiences || []); // 상세 응답에 포함되어 있다고 가정
    } catch (e) {
      console.error("이력서 없음 혹은 로드 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumeData();
  }, [fetchResumeData]);

  if (loading) return <div className="p-6">이력서 로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 이력서 기본 정보 카드 */}
      <div className="bg-white shadow rounded-xl p-6 border-t-4 border-indigo-500">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {resume?.title || "등록된 이력서가 없습니다"}
          </h2>
          <button className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded">
            수정
          </button>
        </div>
        <p className="text-gray-600">
          {resume?.content || "이력서를 등록하여 자신을 소개해보세요."}
        </p>
      </div>

      {/* 경력 사항 리스트 (Experience) */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">경력 및 경험</h3>
          <button className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded">
            + 추가
          </button>
        </div>
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div
              key={exp.experienceCode}
              className="p-4 bg-slate-50 rounded-lg border flex justify-between"
            >
              <div>
                <div className="font-bold">{exp.title}</div>
                <div className="text-sm text-gray-500">
                  {exp.startDate} ~ {exp.endDate || "진행중"}
                </div>
              </div>
              <button className="text-red-400 text-sm">삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyResumePage;
