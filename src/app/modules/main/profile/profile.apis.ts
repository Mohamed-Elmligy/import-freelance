export const PROFILE_APIS = {
  GET_USERS_LIST: 'account/list',
  CREATE_USER: () => `account/add-new-user`,
  CREATE_COMPANY: () => `company/create`,
  USER_UPDATE: (id: string) => `account/update/${id}`,
  USER_DETAILS: (id: string) => `account/user/${id}`,
  USER_DELETE: (id: string) => `/account/delete/${id}`,
  USER_RESET_PASSWORD: (id: string) => `account/reset-password/${id}`,
  RESET_PASSWORD: `account/change-password`,
};
