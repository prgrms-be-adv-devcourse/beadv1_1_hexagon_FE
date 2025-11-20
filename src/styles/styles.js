// ==========================================
// Styles Module
// ==========================================

// 로그인 페이지 전용 스타일
export const loginStyles = {
    container: {
        maxWidth: '100%',
        minHeight: '100vh',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
        padding: '20px 30px',
        display: 'flex',
        alignItems: 'center',
    },
    headerLogo: {
        fontSize: '24px',
        fontWeight: '900',
        color: '#2b4bf2',
        letterSpacing: '-1px',
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px 50px 20px',
    },
    titleSection: {
        textAlign: 'center',
        marginBottom: '60px',
    },
    mainLogo: {
        fontSize: '48px',
        fontWeight: '900',
        color: '#2b4bf2',
        marginBottom: '20px',
        letterSpacing: '-2px',
    },
    subTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    description: {
        fontSize: '15px',
        color: '#666',
        lineHeight: '1.5',
    },
    buttonGroup: {
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    socialButton: {
        position: 'relative',
        width: '100%',
        height: '52px',
        backgroundColor: '#fff',
        border: '1px solid #e2e2e2',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s',
    },
    iconWrapper: {
        position: 'absolute',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#333',
    },
    footerLink: {
        marginTop: '30px',
        fontSize: '14px',
        color: '#333',
        fontWeight: '500',
    },
};

// 공통 및 기타 페이지 스타일
export const styles = {
    container: { maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fff', position: 'relative', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', height: '56px' },
    backButton: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
    headerTitle: { fontSize: '18px', fontWeight: '600', margin: 0 },
    headerRight: { fontSize: '14px', color: '#2AC1BC', fontWeight: 'bold' },
    content: { padding: '20px', paddingBottom: '100px' },
    logoIcon: { width: '32px', height: '32px', backgroundColor: '#00C73C', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '8px' },
    inputWrapper: { borderBottom: '2px solid #333', paddingBottom: '10px', display: 'flex', alignItems: 'center', marginBottom: '20px' },
    input: { width: '100%', border: 'none', fontSize: '24px', outline: 'none', fontWeight: 'bold', color: '#333' },
    currencyUnit: { fontSize: '24px', fontWeight: 'bold', marginLeft: '5px' },
    buttonGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' },
    amountBtn: { padding: '10px 0', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', color: '#333', cursor: 'pointer', fontWeight: '600' },
    submitButton: { width: '100%', padding: '18px', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: 'pointer', position: 'absolute', bottom: 0, left: 0 },
    successContainer: { maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' },
    iconCircle: { width: '80px', height: '80px', backgroundColor: '#3182f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', boxShadow: '0 4px 10px rgba(49, 130, 246, 0.2)' },
    successTitle: { fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '30px' },
    resultInfoBox: { width: '100%', backgroundColor: '#f9f9f9', borderRadius: '16px', padding: '24px', marginBottom: '40px', textAlign: 'center', boxSizing: 'border-box' },
    amountText: { fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '20px' },
    detailRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' },
    label: { color: '#888' },
    value: { color: '#333', fontWeight: '500' },
    confirmButton: { width: '100%', padding: '16px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#3182f6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' },
    homeButton: { padding: '12px 24px', fontSize: '15px', backgroundColor: '#f2f4f6', color: '#4e5968', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px' },
    errorMessage: { color: '#f44336', marginBottom: '20px' },
    loadingSpinner: { width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3182f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }
};