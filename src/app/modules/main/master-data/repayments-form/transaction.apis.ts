export const TRANSACTION_APIS = {
  CREATE_TRNSACTION: 'transaction/create',
  DELETE_TRNSACTION: (id: number) => `transaction/${id}/delete`,
  UPDATE_TRNSACTION: (id: number) => `transaction/${id}/update`,
  GET_TRNSACTION: (id: number) => `transaction/${id}`,
  GET_TRNSACTION_FOR_UPDATE: (id: number) => `transaction/${id}/get-for-update`,
};

export const TRANSACTION_LOOKUP_APIS = {
  GET_INVOICE_DATA_LOOKUP: (id: string) => `lookup/invoice-details/${id}`,
  GET_INVOICE_PAYMENT_LOOKUP: (id: string) => `lookup/invoice-payments/${id}`,
};
