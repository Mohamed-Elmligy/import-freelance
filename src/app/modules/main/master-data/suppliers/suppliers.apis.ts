export const SUPPLIERS_APIS = {
  CREATE_SUPPLIERS: 'supplier/create',
  DELETE_SUPPLIERS: (id: number) => `supplier/${id}/delete`,
  UPDATE_SUPPLIERS: (id: number) => `supplier/${id}/update`,
  GET_SUPPLIERS: (id: number) => `supplier/${id}`,
  GET_SUPPLIER_SEQUENCE: 'supplier/next-sequence',
};
