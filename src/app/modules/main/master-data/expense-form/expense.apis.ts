export const EXPENSE_APIS = {
  CREATE_EXPENSE: 'expense/create',
  DELETE_EXPENSE: (id: number) => `expense/${id}/delete`,
  UPDATE_EXPENSE: (id: number) => `expense/${id}/update`,
  GET_EXPENSE: (id: number) => `expense/${id}`,
};
