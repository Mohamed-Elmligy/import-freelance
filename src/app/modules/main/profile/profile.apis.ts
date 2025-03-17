export const PROFILE_APIS = {
  GET_USERS_LIST: 'account/list',
  GET_USER_CREATE: () => `account/add-new-user`,
  GET_USER_UPDATE: (id: string) => `account/user-data/${id}`,
  GET_USER_DETAILS: (id: string) => `account/user/${id}`,
  GET_USER_DELETE: (id: string) => `account/user/${id}`,
};
