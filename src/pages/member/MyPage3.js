import React, { useEffect, useState } from "react";
import api from "../../api/api";

const S3_BASE_URL = process.env.REACT_APP_S3_BASE_URL;

const MyPage2 = () => {
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buildS3DownloadUrl = (key, queryString) => {
    if (!key) return "";
    return `${S3_BASE_URL}/${key}${queryString ?? ""}`;
  };

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        // GET /members/me endpoint with X-CODE header
        // X-CODE header is automatically added by the API interceptor
        const response = await api.get("/members/me");
        setMemberData(response.data.data);
      } catch (err) {
        console.error("내 정보 조회 실패:", err);
        setError("내 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">내 정보 로딩 중...</div>;
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
        👤 내 프로필
      </h2>

      {/* 사용자 기본 정보 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">기본 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memberData.info && (
            <>
              <div>
                <p className="font-medium text-gray-700">닉네임: {memberData.info.nickName || "미설정"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">이메일: {memberData.info.email || "미설정"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">사용자 역할:
                <span className="inline-block px-4 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
                  {memberData.info.role || "미설정"}
                </span>
                </p>
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
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              프로필 이미지
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {memberData.images.map((image, index) => {
                const imageUrl = buildS3DownloadUrl(
                    image.key,
                    image.queryString
                );

                return (
                    <div key={index} className="relative">
                      <img
                          src={imageUrl}
                          alt={`프로필 이미지 ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                );
              })}
            </div>
          </div>
      )}
    </div>
  );
};

export default MyPage2;
