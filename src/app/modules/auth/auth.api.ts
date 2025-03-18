export const API_AUTH = {
  LOGIN: 'token',
  REGISTER: 'account/register',
  REFRESH_TOKEN: 'token/refresh/',
  CONFIRM_EMAIL: 'account/forget-password/request',
  VERIFY_OTP: 'account/forget-password/verify',
  FORGET_PASSWORD_REQUEST: 'account/forget-password/request',
  FORGET_PASSWORD_CHANGE: 'account/forget-password/change',
  RESET_PASSWORD: (id: number) => `account/reset-password/${id}`,
} as const;
