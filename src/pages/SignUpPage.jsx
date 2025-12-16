import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles/signup";
import { useAuth } from "../components/AuthContext";
import api from "../api/api";
import axios from "axios";

const EC2_DOMAIN = process.env.REACT_APP_EC2_DOMAIN;

export default function SignUpPage() {
  const navigate = useNavigate();
  const { updateToken } = useAuth();

  // 입력 데이터를 관리하는 State
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    birthDate: "",
    gender: "MAN", // 기본값: 남성 (이미지 데이터 기반)
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 성별 선택 핸들러
  const handleGenderChange = (selectedGender) => {
    setFormData({
      ...formData,
      gender: selectedGender,
    });
  };

  // 회원가입 완료 버튼 클릭 핸들러
  const handleSubmit = async () => {
    if (!formData.name || !formData.phoneNumber || !formData.birthDate) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    // API instance already has the base URL and withCredentials configured

    try {
      // -------------------------------------------------------
      // [Step 1] 쿠키 전송 -> 헤더에서 임시 AccessToken 추출
      // -------------------------------------------------------
      const res1 = await axios.post(
          `${EC2_DOMAIN}/api/auth/reissue`,
          {},
          {
            withCredentials: true, // 쿠키 포함
          }
      );
      const authHeader = res1.headers["authorization"];

      if (!authHeader) {
        throw new Error("임시 토큰을 찾을 수 없습니다.");
      }

      const tempAccessToken = authHeader.replace("Bearer ", "");

      // -------------------------------------------------------
      // [Step 2] 토큰(tempAccessToken)에서 member-code 직접 추출 로직
      // -------------------------------------------------------
      const base64Payload = tempAccessToken.split(".")[1]; // 페이로드 부분 추출
      const decodedPayload = JSON.parse(atob(base64Payload)); // Base64 디코딩

      // yml 설정에서 claims 필드로 지정된 'member-code'를 꺼냅니다.
      const rawMemberCode = decodedPayload["member-code"];

      console.log("토큰에서 추출된 멤버 코드:", rawMemberCode);

      // -------------------------------------------------------
      // [Step 3] 회원가입 정보 + 임시 AccessToken(Header) 전송
      // -------------------------------------------------------
      await axios.post(
          `${EC2_DOMAIN}/api/members`,
          formData, {
        headers: {
          Authorization: `Bearer ${tempAccessToken}`,
        },
      });

      console.log("2단계 성공: 회원가입 정보 등록");

      // -------------------------------------------------------
      // [Step 4] 쿠키 재전송 -> 헤더에서 정식 AccessToken 추출
      // -------------------------------------------------------
      const res3 = await api.post("/auth/reissue", {});

      // 마찬가지로 소문자 키로 접근
      const finalAuthHeader = res3.headers["authorization"];

      if (!finalAuthHeader) {
        throw new Error("헤더에서 정식 토큰을 찾을 수 없습니다.");
      }

      const finalAccessToken = finalAuthHeader.replace("Bearer ", "");
      console.log("3단계 성공: 정식 토큰 추출 완료");
      console.log("정식 토큰:", finalAccessToken);

      // -------------------------------------------------------
      // [Final] 토큰 저장 및 이동
      // -------------------------------------------------------
      updateToken(finalAccessToken);
      localStorage.setItem("accessToken", finalAccessToken);

      alert("회원가입이 성공적으로 완료되었습니다!");
      navigate("/charge", { replace: true });
    } catch (error) {
      console.error("회원가입 프로세스 에러:", error);
      const msg = error.response?.data?.message || error.message;
      alert(`회원가입 처리 중 오류가 발생했습니다: ${msg}`);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={styles.headerLogo}>이어드림</span>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.titleSection}>
          <h2 style={styles.title}>회원가입</h2>
          <p style={styles.subtitle}>
            서비스 이용을 위해 추가 정보를 입력해주세요.
          </p>
        </div>

        <div style={styles.formContainer}>
          {/* 이름 입력 */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              style={styles.input}
            />
          </div>

          {/* 전화번호 입력 */}
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

          {/* 생년월일 입력 */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>생년월일</label>
            <input
              type="date" // 달력 UI 제공
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* 성별 선택 (MAN / WOMAN) */}
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

          {/* 완료 버튼 */}
          <button style={styles.submitButton} onClick={handleSubmit}>
            회원가입 완료
          </button>
        </div>
      </main>
    </div>
  );
}
