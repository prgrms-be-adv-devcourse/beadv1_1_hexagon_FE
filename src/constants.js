export const API_BASE_URL = "http://localhost:8000/api";
export const REISSUE_URL = `${API_BASE_URL}/api/auth/reissue`;

// JWT Access Token의 Claim Key 상수화 (백엔드 JwtProperties와 일치해야 함)
export const CLAIMS = {
  // 백엔드 @Value("${jwt.claims.member-code}") 값과 일치해야 함
  MEMBER_CODE: "member-code",
  // 백엔드 @Value("${jwt.claims.is-sign}") 값과 일치해야 함
  IS_SIGNED_UP: "is-signed-up",
  // 역할 클레임이 있다면 추가: ROLE: "role"
};

// 라우팅 시 필요한 역할 상수
export const USER_ROLES = {
  CLIENT: "CLIENT",
  FREELANCER: "FREELANCER",
  GUEST: "GUEST",
};
