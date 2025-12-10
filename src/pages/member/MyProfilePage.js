import React, { useEffect, useState } from "react";
import api from "../../api/api";

const MyProfilePage = () => {
  const [profile, setProfile] = useState({
    nickname: "",
    email: "",
    currentWorkState: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET /api/members
    const fetchProfile = async () => {
      try {
        const response = await api.get("/members");
        setProfile(response.data.data);
      } catch (error) {
        console.error("프로필 정보 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // PUT /api/members
    try {
      await api.put("/members", {
        nickname: profile.nickname,
        // 기타 수정 필드...
      });
      alert("정보가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다: " + error.response?.data.message);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600">내 정보 로딩 중...</div>
    );

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-2xl rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        👤 내 프로필 정보
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 닉네임 입력/수정 */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            닉네임:
            <input
              type="text"
              value={profile.nickname}
              onChange={(e) =>
                setProfile({ ...profile, nickname: e.target.value })
              }
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </label>
        </div>

        {/* 이메일 (읽기 전용) */}
        <div>
          <p className="block mb-2 font-semibold text-gray-700">이메일:</p>
          <p className="text-gray-500 p-3 bg-gray-100 rounded-lg">
            {profile.email}
          </p>
        </div>

        {/* 현재 상태 (읽기 전용) */}
        <div>
          <p className="block mb-2 font-semibold text-gray-700">현재 상태:</p>
          <span className="inline-block px-4 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
            {profile.currentWorkState}
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
        >
          수정하기
        </button>
      </form>
    </div>
  );
};

export default MyProfilePage;
