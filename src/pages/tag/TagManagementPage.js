import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/api";

const TagManagementPage = () => {
  const [allTags, setAllTags] = useState([]); // 시스템 전체 태그
  const [myTagCodes, setMyTagCodes] = useState([]); // 내가 선택한 태그 코드들
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // X-CODE 가져오기
  const getXCodeHeader = () => {
    let token = localStorage.getItem("accessToken");
    if (token && token.startsWith("Bearer "))
      token = token.replace("Bearer ", "");
    return token ? { "X-CODE": token } : {};
  };

  // 초기 데이터 로드
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. 전체 태그 목록 조회
      const allTagsRes = await api.get("/tags");
      setAllTags(allTagsRes.data.data);

      // 2. 내 태그 목록 조회
      const myTagsRes = await api.get("/tags/me", {
        headers: getXCodeHeader(),
      });
      setMyTagCodes(myTagsRes.data.data.map((t) => t.tagCode));
    } catch (e) {
      alert("데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 태그 토글 (선택/해제)
  const toggleTag = (tagCode) => {
    setMyTagCodes((prev) =>
      prev.includes(tagCode)
        ? prev.filter((code) => code !== tagCode)
        : [...prev, tagCode]
    );
  };

  // 서버에 저장 (동기화 API 호출)
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/tags/members/me", myTagCodes, {
        headers: getXCodeHeader(),
      });
      alert("기술 스택이 업데이트되었습니다!");
    } catch (e) {
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">기술 스택 설정</h2>
      <p className="text-gray-500 mb-6 text-sm">
        보유하신 기술 태그를 선택해주세요. 이력서와 매칭에 활용됩니다.
      </p>

      <div className="flex flex-wrap gap-3 mb-8">
        {allTags.map((tag) => {
          const isSelected = myTagCodes.includes(tag.tagCode);
          return (
            <button
              key={tag.tagCode}
              onClick={() => toggleTag(tag.tagCode)}
              className={`px-4 py-2 rounded-full border transition ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
              }`}
            >
              {isSelected && <span className="mr-1">✓</span>}
              {tag.skill}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end border-t pt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 rounded-lg font-semibold text-white ${
            saving ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {saving ? "저장 중..." : "변경사항 저장"}
        </button>
      </div>
    </div>
  );
};

export default TagManagementPage;
