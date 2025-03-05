export const API_AUTH = {
  LOGIN: 'token',
  REFRESH_TOKEN: 'token/refresh/',
  BLACKLIST_TOKEN: 'user/blacklist-refresh',
  REGISTER: 'account/register',
  FORGET_PASSWORD_REQUEST: 'account/forget-password/request',
  VERIFY: 'user/password/verify-otp',
  RESET_PASSWORD: (id: number) => `account/reset-password/${id}`,
} as const;
