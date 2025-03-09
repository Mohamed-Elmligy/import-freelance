export const EXPENSE_APIS = {
  CREATE_EXPENSE: 'expenses/create',
  DELETE_EXPENSE: (id: number) => `expenses/${id}/delete`,
  UPDATE_EXPENSE: (id: number) => `expenses/${id}/update`,
  GET_EXPENSE: (id: number) => `expenses/${id}`,
  GET_EXPENSE_FOR_UPDATE: (id: number) => `expenses/${id}/get-for-update`,
};
