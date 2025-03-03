export const API_AUTH = {
  LOGIN: 'token',
  REFRESH_TOKEN: 'token/refresh/',
  BLACKLIST_TOKEN: 'user/blacklist-refresh',
  REGISTER: 'account/register',
  GET_OTP: 'user/password/get-otp',
  VERIFY: 'user/password/verify-otp',
  RESET_PASSWORD: (id: number) => `account/reset-password/${id}`,
} as const;
