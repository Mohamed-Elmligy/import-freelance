export const CUSTOMER_APIS = {
  CREATE_CUSTOMER: 'customer/create',
  DELETE_CUSTOMER: (id: number) => `customer/${id}/delete`,
  UPDATE_CUSTOMER: (id: number) => `customer/${id}/update`,
  GET_CUSTOMER: (id: number) => `customer/${id}`,
};
