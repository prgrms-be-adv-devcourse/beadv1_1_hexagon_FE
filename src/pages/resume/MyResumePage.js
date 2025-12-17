import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/api";

const MyResumePage = () => {
  const [resume, setResume] = useState({ title: "", content: "" });
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingResume, setIsEditingResume] = useState(false);

  // 경력 추가를 위한 로컬 상태
  const [newExp, setNewExp] = useState({
    title: "",
    content: "",
    startDate: "",
    endDate: "",
  });
  const [isAddingExp, setIsAddingExp] = useState(false);

  const getXCodeHeader = () => {
    let token = localStorage.getItem("accessToken");
    if (token && token.startsWith("Bearer "))
      token = token.replace("Bearer ", "");
    return token ? { "X-CODE": token } : {};
  };

  const fetchData = useCallback(async () => {
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
      console.log("데이터 없음");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 경력 추가 요청
  const handleAddExperience = async () => {
    try {
      await api.post("/experiences", newExp, { headers: getXCodeHeader() });
      alert("경력이 추가되었습니다.");
      setNewExp({ title: "", content: "", startDate: "", endDate: "" });
      setIsAddingExp(false);
      fetchData(); // 목록 새로고침
    } catch (e) {
      alert("경력 추가 실패");
    }
  };

  if (loading) return <div className="p-6 text-center">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 1. 이력서 본문 섹션 */}
      <section className="bg-white shadow-lg rounded-2xl p-8 border-l-8 border-indigo-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">내 이력서 정보</h2>
          <button
            onClick={() => setIsEditingResume(!isEditingResume)}
            className="text-indigo-600 font-semibold underline"
          >
            {isEditingResume ? "취소" : "이력서 수정"}
          </button>
        </div>
        {isEditingResume ? (
          <div className="space-y-4">
            <input
              className="w-full p-3 border rounded-xl"
              value={resume.title}
              onChange={(e) => setResume({ ...resume, title: e.target.value })}
            />
            <textarea
              className="w-full p-3 border rounded-xl h-32"
              value={resume.content}
              onChange={(e) =>
                setResume({ ...resume, content: e.target.value })
              }
            />
            <button
              onClick={async () => {
                await api.post("/resumes", resume, {
                  headers: getXCodeHeader(),
                });
                setIsEditingResume(false);
                fetchData();
              }}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
            >
              이력서 저장
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {resume.title || "제목을 입력하세요"}
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap">
              {resume.content || "소개글이 없습니다."}
            </p>
          </div>
        )}
      </section>

      {/* 2. 경력(Experience) 섹션 */}
      <section className="bg-white shadow-lg rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">상세 경력 사항</h2>
          <button
            onClick={() => setIsAddingExp(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
          >
            + 경력 추가
          </button>
        </div>

        {isAddingExp && (
          <div className="mb-8 p-6 bg-green-50 rounded-2xl border-2 border-green-200 space-y-4">
            <input
              className="w-full p-3 border rounded-xl"
              placeholder="경력 제목 (예: OO 프로젝트 개발)"
              value={newExp.title}
              onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
            />
            <textarea
              className="w-full p-3 border rounded-xl h-24"
              placeholder="상세 수행 내용"
              value={newExp.content}
              onChange={(e) =>
                setNewExp({ ...newExp, content: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="p-3 border rounded-xl"
                value={newExp.startDate}
                onChange={(e) =>
                  setNewExp({ ...newExp, startDate: e.target.value })
                }
              />
              <input
                type="date"
                className="p-3 border rounded-xl"
                value={newExp.endDate}
                onChange={(e) =>
                  setNewExp({ ...newExp, endDate: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddExperience}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold"
              >
                저장
              </button>
              <button
                onClick={() => setIsAddingExp(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold"
              >
                취소
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.experienceCode}
              className="p-5 border rounded-xl bg-slate-50 flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold text-lg text-gray-800">{exp.title}</h4>
                <p className="text-sm text-gray-500">
                  {exp.startDate} ~ {exp.endDate || "진행 중"}
                </p>
                <p className="text-gray-600 mt-2">{exp.content}</p>
              </div>
              <button
                onClick={async () => {
                  if (window.confirm("삭제하시겠습니까?")) {
                    await api.delete(`/experiences/${exp.experienceCode}`, {
                      headers: getXCodeHeader(),
                    });
                    fetchData();
                  }
                }}
                className="text-red-400 hover:text-red-600"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MyResumePage;
