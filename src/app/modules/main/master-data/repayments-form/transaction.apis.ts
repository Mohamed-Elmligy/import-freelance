export const TRANSACTION_APIS = {
  CREATE_TRNSACTION: 'transaction/create',
  DELETE_TRNSACTION: (id: number) => `transaction/${id}/delete`,
  UPDATE_TRNSACTION: (id: number) => `transaction/${id}/update`,
  GET_TRNSACTION: (id: number) => `transaction/${id}`,
};
