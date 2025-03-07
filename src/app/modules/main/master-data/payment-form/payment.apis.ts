export const PAYMENT_APIS = {
  CREATE_PAYMENT: 'payments/create',
  DELETE_PAYMENT: (id: number) => `payments/${id}/delete`,
  UPDATE_PAYMENT: (id: number) => `payments/${id}/update`,
  GET_PAYMENT: (id: number) => `payments/${id}`,
};
