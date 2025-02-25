export const AUTH_API = {
  LOGIN: 'token',
  REGISTER: 'user/register',
  CHANGE_PASSWORD: 'user/change-password',
  FORGET_PASSWORD: 'user/checking-username-and-otp/',
  REFRESH_TOKEN: 'token/refresh',
  BLACKLIST_TOKEN: 'user/blacklist-refresh',
} as const;
