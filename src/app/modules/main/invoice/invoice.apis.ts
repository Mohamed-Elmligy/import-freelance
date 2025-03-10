export const INVOICE_APIS = {
  CREATE_INVOICE: 'invoice/create',
  DELETE_INVOICE: (id: number) => `invoice/${id}/delete`,
  UPDATE_INVOICE: (id: number) => `invoice/${id}/update`,
  GET_INVOICE: (id: number) => `invoice/${id}`,
  GET_INVOICE_FOR_UPDATE: (id: number) => `invoice/${id}/get-for-update`,
};
