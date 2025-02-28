export const API_AUTH = {
  LOGIN: "token",
  REFRESH_TOKEN: "token/refresh",
  BLACKLIST_TOKEN: "user/blacklist-refresh",
  LOGOUT: "logout",
  REGISTER: "",
  GET_OTP: "user/password/get-otp",
  VERIFY: "user/password/verify-otp",
  RESET_PASSWORD: "user/password/forget",
  CHANGE_PASSWORD: "user/password/change",
} as const;
