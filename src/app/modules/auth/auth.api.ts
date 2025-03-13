export const API_AUTH = {
  LOGIN: 'token',
  REGISTER: 'account/register',
  REFRESH_TOKEN: 'token/refresh/',
  VERIFY_OTP: 'user/password/verify-otp',
  CONFIRM_EMAIL: 'account/forget-password/request',
  FORGET_PASSWORD_REQUEST: 'account/forget-password/request',
  RESET_PASSWORD: (id: number) => `account/reset-password/${id}`,
} as const;
