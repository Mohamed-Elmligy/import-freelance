export const SHIPPING_DATA_APIS = {
  CREATE_SHIPPING_DATA: 'shipment/create',
  DELETE_SHIPPING_DATA: (id: number) => `shipment/${id}/delete`,
  UPDATE_SHIPPING_DATA: (id: number) => `shipment/${id}/update`,
  GET_SHIPPING_DATA: (id: number) => `shipment/${id}`,
};
