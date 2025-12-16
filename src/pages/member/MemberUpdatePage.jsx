import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../../styles/signup";
import axios from "axios";
import api from "../../api/api";

export default function MyProfilePage() {
  const navigate = useNavigate();

  // 입력 데이터를 관리하는 State
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    birthDate: "",
    gender: "MAN",
    profileImageKey: "",
  });

  const [originalNickname, setOriginalNickname] = useState("");
  const [originalProfileImage, setOriginalProfileImage] = useState({
    preview: null,
    key: "",
  });

  // 닉네임 중복 확인 여부
  const [isNicknameChecked, setIsNicknameChecked] = useState(true);
  // 프로필 이미지 미리보기 URL
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // 데이터 로딩 상태
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await api.get("/members/me"); // 자신의 정보 조회 API
        const memberData = response.data.data.info;
        const imageData = response.data.data.images;
        
        setFormData({
          name: memberData.nickname || "",
          phoneNumber: memberData.phoneNumber || "",
          birthDate: memberData.birthDate || "",
          gender: memberData.gender || "MAN",
          profileImageKey: imageData?.[0]?.key || null
        });

        setOriginalNickname(memberData.nickname || "");
        
        if (memberData.profileImageUrl) {
          setProfileImagePreview(memberData.profileImageUrl);
          setOriginalProfileImage({
            preview: memberData.profileImageUrl,
            key: memberData.profileImageKey || "",
          });
        }
        
      } catch (error) {
        console.error("회원 정보 조회 에러:", error);
        alert("회원 정보를 불러오는데 실패했습니다.");
        navigate("/"); // 에러 발생 시 홈으로 이동
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [navigate]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "nickname") {
      if (value === originalNickname) {
        setIsNicknameChecked(true);
      } else {
        setIsNicknameChecked(false);
      }
    }
  };

  // 성별 선택 핸들러
  const handleGenderChange = (selectedGender) => {
    setFormData({
      ...formData,
      gender: selectedGender,
    });
  };

  // 닉네임 중복 체크 핸들러
  const handleNicknameCheck = async () => {
    if (!formData.nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      await api.get(`/members/check-name?name=${formData.nickname}`);
      alert("사용 가능한 닉네임입니다.");
      setIsNicknameChecked(true);
    } catch (error) {
      console.error("닉네임 중복 확인 에러:", error);
      alert("이미 사용 중인 닉네임입니다.");
      setIsNicknameChecked(false);
    }
  };

  // 프로필 이미지 변경 핸들러
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      // 파일 선택 취소 시 원래 이미지로 복원
      setProfileImagePreview(originalProfileImage.preview);
      setFormData((prevData) => ({
        ...prevData,
        profileImageKey: originalProfileImage.key,
      }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);

    try {
      const presignedResponse = await api.post("/s3/upload-url", {
        filename: file.name,
      });

      const { presignedUrl, key } = presignedResponse.data;

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      setFormData((prevData) => ({
        ...prevData,
        profileImageKey: key,
      }));
      alert("이미지 업로드가 완료되었습니다.");

    } catch (error) {
      console.error("이미지 업로드 에러:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
      setProfileImagePreview(originalProfileImage.preview); // 실패 시 원래 이미지로 복원
    }
  };

  // 회원정보 수정 완료 버튼 클릭 핸들러
  const handleUpdate = async () => {
    if (!formData.name || !formData.phoneNumber || !formData.birthDate || !formData.nickname) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    if (!isNicknameChecked) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }

    try {
      await api.put("/members", formData);
      alert("회원정보가 성공적으로 수정되었습니다.");
      navigate("/mypage"); // 마이페이지로 이동
    } catch (error) {
      console.error("회원정보 수정 에러:", error);
      const msg = error.response?.data?.message || error.message;
      alert(`정보 수정 중 오류가 발생했습니다: ${msg}`);
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
          <p style={styles.subtitle}>
            회원 정보를 수정할 수 있습니다.
          </p>
        </div>

        <div style={styles.formContainer}>

          <div style={styles.inputGroup}>
            <label style={styles.label}>프로필 이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ ...styles.input, marginBottom: "10px" }}
            />
            {profileImagePreview && (
              <img
                src={profileImagePreview}
                alt="Profile Preview"
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
              />
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>닉네임</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
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

          <button style={styles.submitButton} onClick={handleUpdate}>
            수정 완료
          </button>
        </div>
      </main>
    </div>
  );
}