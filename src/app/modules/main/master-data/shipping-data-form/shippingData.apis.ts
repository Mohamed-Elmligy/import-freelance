import { environment } from '../../../../../environments/environment';

export const SHIPPING_DATA_APIS = {
  CREATE_SHIPPING_DATA: 'shipment/create',
  DELETE_SHIPPING_DATA: (id: number) => `shipment/${id}/delete`,
  UPDATE_SHIPPING_DATA: (id: number) => `shipment/${id}/update`,
  GET_SHIPPING_DATA: (id: number) => `shipment/${id}`,
  GET_SHIPPING_DATA_FOR_UPDATE: (id: number) => `shipment/${id}/get-for-update`,
  GET_EXCHANGE_RATE: (based_currency: string) =>
    `https://v6.exchangerate-api.com/v6/${
      environment.exchangeRateApiKey
    }/latest/${based_currency.toUpperCase()}`,
};
