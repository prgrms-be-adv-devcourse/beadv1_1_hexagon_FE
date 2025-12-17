import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/api";

const MyResumePage = () => {
  const [resume, setResume] = useState({ title: "", content: "" });
  const [experiences, setExperiences] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
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
      const res = await api.get("/resumes/me", { headers: getXCodeHeader() });
      if (res.data.data) {
        setResume({
          title: res.data.data.title,
          content: res.data.data.content,
        });
        setExperiences(res.data.data.experiences || []);
      }
    } catch (e) {
      console.log("기존 이력서 없음");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumeData();
  }, [fetchResumeData]);

  const handleSaveResume = async () => {
    try {
      // 이력서가 이미 있으면 PUT(수정), 없으면 POST(생성)
      await api.post("/resumes", resume, { headers: getXCodeHeader() });
      alert("이력서가 저장되었습니다.");
      setIsEditing(false);
      fetchResumeData();
    } catch (e) {
      alert("저장에 실패했습니다.");
    }
  };

  if (loading) return <div className="p-6 text-center">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-indigo-500">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">내 이력서</h2>
          <button
            onClick={() =>
              isEditing ? handleSaveResume() : setIsEditing(true)
            }
            className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
              isEditing
                ? "bg-green-600 hover:bg-green-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isEditing ? "저장하기" : "수정하기"}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="이력서 제목을 입력하세요"
              value={resume.title}
              onChange={(e) => setResume({ ...resume, title: e.target.value })}
            />
            <textarea
              className="w-full p-3 border rounded-lg h-40 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="자기소개를 입력하세요"
              value={resume.content}
              onChange={(e) =>
                setResume({ ...resume, content: e.target.value })
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">
              {resume.title || "제목 없음"}
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {resume.content || "등록된 소개 내용이 없습니다."}
            </p>
          </div>
        )}
      </div>

      {/* 경력 사항은 별도 컴포넌트나 모달로 구현하는 것이 깔끔 */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">경력 사항</h3>
        {experiences.length === 0 ? (
          <p className="text-gray-400 text-sm">등록된 경력이 없습니다.</p>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp.experienceCode}
              className="mb-3 p-4 bg-slate-50 rounded-lg border"
            >
              <div className="font-bold">{exp.title}</div>
              <div className="text-sm text-gray-500">
                {exp.startDate} ~ {exp.endDate || "진행중"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyResumePage;
