import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../../styles/signup";
import axios from "axios";
import api from "../../api/api";

const S3_BASE_URL = process.env.REACT_APP_S3_BASE_URL;


export default function MemberUpdatePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phoneNumber: "",
    birthDate: "",
    gender: "MAN",
    name: "",
    profileImageKey: "",
  });

  const [loading, setLoading] = useState(true);
  const [isNicknameChecked, setIsNicknameChecked] = useState(true);
  const [originalNickname, setOriginalNickname] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [originalProfileImage, setOriginalProfileImage] = useState({
    key: "",
    preview: null,
  });

  // 이미지 제거 핸들러 추가
  const handleRemoveImage = () => {
    if (window.confirm("프로필 이미지를 삭제하시겠습니까?")) {
      // 로컬 프리뷰 URL 해제 (메모리 정리)
      if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profileImagePreview);
      }

      // state 초기화
      setProfileImagePreview(null);
      setFormData((prev) => ({
        ...prev,
        profileImageKey: "", // 빈 문자열로 설정 (백엔드에서 null 처리)
      }));

      // 원본 이미지 정보도 초기화 (필요시)
      setOriginalProfileImage({
        key: "",
        preview: null,
      });
    }
  };

  // 최초 진입 시 내 정보 조회
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const res = await api.get("/members/me");
        const data = res.data.data;

        const info = data.info;
        const images = data.images || [];

        const nickName = info.nickName || "";
        const phoneNumber = info.phoneNumber || "";
        const birthDay = info.birthDay || "";
        const gender = info.gender || "MAN";

        // presign download URL 조합
        let imageKey = "";
        let imagePreview = null;
        if (images.length > 0 && images[0].fileType === "IMAGE") {
          const { key, queryString } = images[0];
          imageKey = key;
          imagePreview = `${S3_BASE_URL}/${key}${queryString}`;
        }

        setFormData({
          name: nickName,
          phoneNumber,
          birthDate: birthDay,
          gender,
          profileImageKey: imageKey,
        });

        setOriginalNickname(nickName);
        setIsNicknameChecked(true); // 처음에는 본인 닉네임이므로 true
        setProfileImagePreview(imagePreview);
        setOriginalProfileImage({
          key: imageKey,
          preview: imagePreview,
        });
      } catch (error) {
        console.error("내 정보 조회 에러:", error);
        alert("회원 정보를 불러오는데 실패했습니다.");
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchMyInfo();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 닉네임 변경 시 중복 체크 플래그 리셋
    if (name === "name") {
      if (value === originalNickname) {
        setIsNicknameChecked(true);
      } else {
        setIsNicknameChecked(false);
      }
    }
  };

  const handleGenderChange = (selectedGender) => {
    setFormData((prev) => ({
      ...prev,
      gender: selectedGender,
    }));
  };

  const handleNicknameCheck = async () => {
    if (!formData.name) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      await api.get(`/members/check-name?name=${formData.name}`);
      alert("사용 가능한 닉네임입니다.");
      setIsNicknameChecked(true);
    } catch (error) {
      console.error("닉네임 중복 확인 에러:", error);
      alert("이미 사용 중인 닉네임입니다.");
      setIsNicknameChecked(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      // 선택 취소 시 원래 이미지로 롤백
      setProfileImagePreview(originalProfileImage.preview);
      setFormData((prev) => ({
        ...prev,
        profileImageKey: originalProfileImage.key,
      }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);

    try {
      // 여기에서 file.type 함께 보냄
      console.log("file.type:", file.type);
      console.log("file:", file.name);
      const presignedResponse = await api.post("/s3/upload-url", {
        serviceName: "MEMBERS",           // 실제 서비스명 enum 값에 맞게
        fileName: file.name,
        contentType: file.type,          // image/jpeg, image/png, image/webp, application/pdf 중 하나
      });

      const { key, queryString } = presignedResponse.data.data;
      // 최종 presigned URL
      const presignedUrl = `${S3_BASE_URL}/${key}${queryString}`;

      console.log("presignedUrl:", presignedUrl);

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      setFormData((prev) => ({
        ...prev,
        profileImageKey: key,
      }));

      alert("이미지 업로드가 완료되었습니다.");
    } catch (error) {
      console.error("이미지 업로드 에러:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
      setProfileImagePreview(originalProfileImage.preview);
      setFormData((prev) => ({
        ...prev,
        profileImageKey: originalProfileImage.key,
      }));
    }
  };

  const handleUpdate = async () => {
    if (!formData.phoneNumber || !formData.birthDate || !formData.name) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    if (!isNicknameChecked) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }

    try {

      console.log("formData:", formData);
      await api.patch("/members", {
        phoneNumber: formData.phoneNumber,
        birthDate: formData.birthDate,
        gender: formData.gender,
        name: formData.name,
        profileImageKey: formData.profileImageKey,
      });

      alert("회원 정보가 수정되었습니다.");
      navigate("/mypage", { replace: true });
    } catch (error) {
      console.error("회원 정보 수정 에러:", error);
      const msg = error.response?.data?.message || error.message;
      alert(`회원 정보 수정 중 오류가 발생했습니다: ${msg}`);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
      <div style={styles.container}>
        <header style={styles.header}>
          <span style={styles.headerLogo}>이어드림</span>
        </header>

        <main style={styles.mainContent}>
          <div style={styles.titleSection}>
            <h2 style={styles.title}>회원 정보 수정</h2>
            <p style={styles.subtitle}>회원 정보를 수정할 수 있습니다.</p>
          </div>

          <div style={styles.formContainer}>
            {/* 프로필 이미지 */}
            {/* 프로필 이미지 */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>프로필 이미지</label>

              {profileImagePreview && (
                  <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                        marginTop: "10px",
                        width: "160px",   // 이미지와 동일한 폭 (w-40 = 160px 기준)
                        height: "160px",  // 이미지와 동일한 높이
                      }}
                  >
                    <img
                        src={profileImagePreview}
                        alt="Profile Preview"
                        style={{
                          width: "100%",          // 컨테이너에 맞게
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "9999px", // rounded-full
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          border: "4px solid #DBEAFE", // border-blue-100
                        }}
                    />

                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{
                          position: "absolute",
                          top: "-6px",      // 살짝 밖으로
                          right: "-6px",    // 우상단에 밀착
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
                          zIndex: 10,
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#dc2626";
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#ef4444";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                      ×
                    </button>
                  </div>
              )}

              <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ ...styles.input, marginTop: "10px" }}
              />
            </div>
            {/* 닉네임 */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>닉네임</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="닉네임을 입력하세요"
                    style={{ ...styles.input, flex: 1 }}
                />
                <button
                    onClick={handleNicknameCheck}
                    disabled={isNicknameChecked}
                    style={{
                      ...styles.genderButton,
                      marginLeft: "10px",
                      backgroundColor: isNicknameChecked ? "#4CAF50" : "#f0f0f0",
                      color: isNicknameChecked ? "white" : "black",
                      cursor: isNicknameChecked ? "not-allowed" : "pointer",
                    }}
                >
                  {isNicknameChecked ? "확인완료" : "중복확인"}
                </button>
              </div>
            </div>

            {/* 전화번호 */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>전화번호</label>
              <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  style={styles.input}
              />
            </div>

            {/* 생년월일 */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>생년월일</label>
              <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  style={styles.input}
              />
            </div>

            {/* 성별 */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>성별</label>
              <div style={styles.genderContainer}>
                <button
                    style={
                      formData.gender === "MAN"
                          ? styles.genderButtonActive
                          : styles.genderButton
                    }
                    onClick={() => handleGenderChange("MAN")}
                >
                  남성
                </button>
                <button
                    style={
                      formData.gender === "FEMALE"
                          ? styles.genderButtonActive
                          : styles.genderButton
                    }
                    onClick={() => handleGenderChange("FEMALE")}
                >
                  여성
                </button>
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                {/* 수정 완료 */}
                <button
                    onClick={handleUpdate}
                    className="px-6 py-3 text-sm font-semibold text-gray-100 bg-blue-500 hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
                    disabled={!isNicknameChecked}
                >
                  수정완료
                </button>

                {/* 취소 - 간단한 회색 버튼 */}
                <button
                    onClick={() => navigate("/mypage", { replace: true })}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}