import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../../api/api";

const UserPage = () => {
  const { memberCode } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paramCode = queryParams.get("member-code") || memberCode;

  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!paramCode) {
        setError("사용자 코드가 제공되지 않았습니다.");
        setLoading(false);
        return;
      }

      try {
        // GET /members?member-code={code} endpoint
        const response = await api.get(`/members`, {
          params: { "member-code": paramCode }
        });
        setMemberData(response.data.data);
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
        setError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [paramCode]);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">사용자 정보 로딩 중...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!memberData) {
    return <div className="p-8 text-center text-gray-600">정보가 없습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        👤 사용자 프로필
      </h2>

      {/* 사용자 기본 정보 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">기본 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memberData.info && (
            <>
              <div>
                <p className="font-medium text-gray-700">닉네임:</p>
                <p className="text-gray-800">{memberData.info.nickname || "미설정"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">이메일:</p>
                <p className="text-gray-800">{memberData.info.email || "미설정"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">현재 상태:</p>
                <span className="inline-block px-4 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
                  {memberData.info.currentWorkState || "미설정"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 사용자 평가 정보 */}
      {memberData.rating && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">평가 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="font-medium text-gray-700">평균 평점</p>
              <p className="text-2xl font-bold text-blue-600">
                {memberData.rating.averageRating?.toFixed(1) || "0.0"}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="font-medium text-gray-700">총 평가 수</p>
              <p className="text-2xl font-bold text-green-600">
                {memberData.rating.totalRatings || "0"}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="font-medium text-gray-700">최근 평가</p>
              <p className="text-2xl font-bold text-purple-600">
                {memberData.rating.recentRating?.toFixed(1) || "없음"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 사용자 기술 태그 */}
      {memberData.tags && memberData.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">기술 태그</h3>
          <div className="flex flex-wrap gap-2">
            {memberData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 사용자 프로필 이미지 */}
      {memberData.images && memberData.images.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">프로필 이미지</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {memberData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt={`프로필 이미지 ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;