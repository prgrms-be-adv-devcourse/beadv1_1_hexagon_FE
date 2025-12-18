import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {styles} from "../styles/signup";
import axios from "axios";

export default function SignUpPage() {
    const navigate = useNavigate();

    // 입력 데이터를 관리하는 State
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        birthDate: '',
        gender: 'MAN', // 기본값: 남성 (이미지 데이터 기반)
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
            alert('모든 정보를 입력해주세요.');
            return;
        }

        const TOKEN_URL = 'http://localhost:8000/api/auth/reissue';
        const SIGNUP_URL = 'http://localhost:8000/api/members';

        const axiosConfig = {
            withCredentials: true // 쿠키 자동 전송
        };

        try {
            // -------------------------------------------------------
            // [Step 1] 쿠키 전송 -> 헤더에서 임시 AccessToken 추출
            // -------------------------------------------------------
            const res1 = await axios.post(TOKEN_URL, {}, axiosConfig);

            // Axios는 모든 헤더 키를 소문자로 변환하여 저장합니다.
            // 백엔드에서 "AccessToken"으로 보냈어도 여기선 "accesstoken"으로 꺼내야 합니다.
            const authHeader = res1.headers['authorization'];

            if (!authHeader) {
                throw new Error('헤더에서 임시 토큰을 찾을 수 없습니다. (CORS Expose 설정 확인 필요)');
            }

            const tempAccessToken = authHeader.replace('Bearer ', '');
            console.log('1단계 성공: 임시 토큰 추출 완료', formData.name, formData.birthDate, formData.gender, formData.phoneNumber);
            console.log("임시 토큰:", tempAccessToken);

            // -------------------------------------------------------
            // [Step 2] 회원가입 정보 + 임시 AccessToken(Header) 전송
            // -------------------------------------------------------
            await axios.post(SIGNUP_URL, formData, {
                ...axiosConfig,
                headers: {
                    'Authorization': `Bearer ${tempAccessToken}` // Bearer 스키마 사용
                }
            });

            console.log('2단계 성공: 회원가입 정보 등록');


            // -------------------------------------------------------
            // [Step 3] 쿠키 재전송 -> 헤더에서 정식 AccessToken 추출
            // -------------------------------------------------------
            const res3 = await axios.post(TOKEN_URL, {}, axiosConfig);

            // 마찬가지로 소문자 키로 접근
            const finalAuthHeader = res3.headers['authorization'];

            if (!finalAuthHeader) {
                throw new Error('헤더에서 정식 토큰을 찾을 수 없습니다.');
            }

            const finalAccessToken = finalAuthHeader.replace('Bearer ', '');
            console.log('3단계 성공: 정식 토큰 추출 완료');
            console.log("정식 토큰:", finalAccessToken);

            // -------------------------------------------------------
            // [Final] 토큰 저장 및 이동
            // -------------------------------------------------------
            localStorage.setItem('accessToken', finalAccessToken);

            alert('회원가입이 성공적으로 완료되었습니다!');
            navigate('/charge');

        } catch (error) {
            console.error('회원가입 프로세스 에러:', error);
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
                    <p style={styles.subtitle}>서비스 이용을 위해 추가 정보를 입력해주세요.</p>
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
                                style={formData.gender === 'MAN' ? styles.genderButtonActive : styles.genderButton}
                                onClick={() => handleGenderChange('MAN')}
                            >
                                남성
                            </button>
                            <button
                                style={formData.gender === 'FEMALE' ? styles.genderButtonActive : styles.genderButton}
                                onClick={() => handleGenderChange('FEMALE')}
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

