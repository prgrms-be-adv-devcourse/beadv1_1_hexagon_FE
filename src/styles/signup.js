// 스타일 정의 (CSS-in-JS) - 이전 로그인 페이지 스타일과 통일성 유지
export const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#fff',
        fontFamily: "'Noto Sans KR', sans-serif",
    },
    header: {
        padding: '20px 40px',
        width: '100%',
    },
    headerLogo: {
        color: '#4F46E5',
        fontWeight: '900',
        fontSize: '24px',
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        marginTop: '-50px', // 시각적 밸런스
    },
    titleSection: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    title: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#333',
        marginBottom: '10px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
    },
    formContainer: {
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#444',
    },
    input: {
        padding: '14px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    genderContainer: {
        display: 'flex',
        gap: '10px',
    },
    genderButton: {
        flex: 1,
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        color: '#666',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s',
    },
    genderButtonActive: {
        flex: 1,
        padding: '12px',
        border: '1px solid #4F46E5', // 브랜드 컬러
        borderRadius: '8px',
        backgroundColor: '#EEF2FF', // 연한 파란 배경
        color: '#4F46E5',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.2s',
    },
    submitButton: {
        marginTop: '10px',
        padding: '16px',
        backgroundColor: '#4F46E5', // 브랜드 컬러
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
};