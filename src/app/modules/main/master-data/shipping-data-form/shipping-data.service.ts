import { formatDate, Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ShowMessageService } from '../../../../core/services/show-message.service';
import { SHIPPING_DATA_APIS } from './shippingData.apis';
import { ConfirmSaveDeleteService } from '../../../../core/services/confirm-save-delete.service';

@Injectable({
  providedIn: 'root',
})
export class ShippingDataService {
  private apiService = inject(ApiService);
  private location = inject(Location);
  private confirmService = inject(ConfirmSaveDeleteService);
  private showMessageService = inject(ShowMessageService);
  listOfCustomers = signal([]);
  shippingDataDeleted = signal(false);
  USDRateData = signal<exchangeRateApiResponse>({} as any);
  CNYRateData = signal<exchangeRateApiResponse>({} as any);

  ShippingHeaders = [
    'name',
    'containerNumber',
    'containerSequance',
    'ShippingDate',
    'port',
    'created_at',
  ];

  getList(page?: any, size?: any, filter?: any) {
    return this.apiService.getDataFromServer(
      `shipment/list`,
      { page, count: size },
      filter
    );
  }

  componentModelToApiModel(form: FormGroup) {
    return {
      customer: form.get('name')?.value.id,
      container_number: form.get('containerNumber')?.value,
      container_sequence: form.get('containerSequence')?.value,
      port_name: form.get('port')?.value,
      shipping_date: formatDate(
        form.get('ShippingDate')?.value,
        'YYYY-MM-dd',
        'en-US'
      ),
      description: form.get('description')?.value,
      land_shipping_cost: form.get('land_shipping_cost')?.value,
      sea_shipping_cost: form.get('sea_shipping_cost')?.value,
      customs_cost: form.get('customs_cost')?.value,
      usd_exchange_rate: form.get('usd_exchange_rate')?.value,
      rmb_exchange_rate: form.get('rmb_exchange_rate')?.value,
    };
  }

  apiModelToComponentModel(form: FormGroup, data: any) {
    const selectedCustomer = this.listOfCustomers().find(
      (item: any) => item.id === data.customer
    );
    form.patchValue({
      name: selectedCustomer,
      containerNumber: data.container_number,
      containerSequence: data.container_sequence,
      port: data.port_name,
      ShippingDate: new Date(data.shipping_date),
      description: data.description,
      land_shipping_cost: data.land_shipping_cost,
      sea_shipping_cost: data.sea_shipping_cost,
      customs_cost: data.customs_cost,
      usd_exchange_rate: data.usd_exchange_rate,
      rmb_exchange_rate: data.rmb_exchange_rate,
    });
  }

  apiModelToComponentModelList(
    data: {
      customer: string;
      container_number: string;
      container_sequence: number;
      shipping_date: string;
      port_name: string;
      created_at: string;
      actions: string;
      id: number;
    }[]
  ) {
    return data.map((item) => {
      return {
        name: item.customer,
        containerNumber: item.container_number,
        containerSequance: item.container_sequence,
        ShippingDate: item.shipping_date,
        port: item.port_name,
        created_at: new Date(item.created_at).toLocaleDateString('en-GB'),
        id: item.id,
      };
    });
  }

  createShipping(data: FormGroup) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .sendDataToServer(SHIPPING_DATA_APIS.CREATE_SHIPPING_DATA, modifiedModel)
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Shipping Created',
            'Shipping has been created successfully'
          );
          this.location.back();
        },
      });
  }

  getShippingById(id: string) {
    return this.apiService.getDataFromServer(
      SHIPPING_DATA_APIS.GET_SHIPPING_DATA(+id)
    );
  }

  getShippingByIdForUpdate(id: string) {
    return this.apiService.getDataFromServer(
      SHIPPING_DATA_APIS.GET_SHIPPING_DATA_FOR_UPDATE(+id)
    );
  }

  updateShipping(data: FormGroup, id: string) {
    let modifiedModel = this.componentModelToApiModel(data);
    this.apiService
      .updateDataOnServer(
        'put',
        SHIPPING_DATA_APIS.UPDATE_SHIPPING_DATA(+id),
        modifiedModel
      )
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Shipping Updated',
            'Shipping has been updated successfully'
          );
          this.location.back();
        },
      });
  }

  deleteShipping(id: number) {
    this.confirmService.confirmDelete(
      'Are you sure you want to delete this shipping?',
      () => {
        this.deleteShippingApi(id);
      }
    );
  }

  deleteShippingApi(id: number) {
    this.apiService
      .deleteDataOnServer(SHIPPING_DATA_APIS.DELETE_SHIPPING_DATA(id))
      .subscribe({
        next: () => {
          this.showMessageService.showMessage(
            'success',
            'Shipping Deleted',
            'Shipping has been deleted successfully'
          );
          this.shippingDataDeleted.set(true);
        },
        error: (err) => {
          this.showMessageService.showMessage(
            'error',
            'Delete Failed',
            'Failed to delete shipping data'
          );
        },
      });
  }

  getExchangeRate(based_currency: string) {
    return this.apiService.getDataFromServer(
      SHIPPING_DATA_APIS.GET_EXCHANGE_RATE(based_currency)
    );
  }
}

interface exchangeRateApiResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: {
    [key: string]: number;
  };
}

// {
//  "result":"success",
//  "documentation":"https://www.exchangerate-api.com/docs",
//  "terms_of_use":"https://www.exchangerate-api.com/terms",
//  "time_last_update_unix":1745280002,
//  "time_last_update_utc":"Tue, 22 Apr 2025 00:00:02 +0000",
//  "time_next_update_unix":1745366402,
//  "time_next_update_utc":"Wed, 23 Apr 2025 00:00:02 +0000",
//  "base_code":"USD",
//  "conversion_rates":{
//   "USD":1,
//   "AED":3.6725,
//   "AFN":71.9964,
//   "ALL":86.7108,
//   "AMD":390.7278,
//   "ANG":1.7900,
//   "AOA":919.3407,
//   "ARS":1070.4200,
//   "AUD":1.5586,
//   "AWG":1.7900,
//   "AZN":1.7001,
//   "BAM":1.6986,
//   "BBD":2.0000,
//   "BDT":121.5009,
//   "BGN":1.6987,
//   "BHD":0.3760,
//   "BIF":2952.9379,
//   "BMD":1.0000,
//   "BND":1.3045,
//   "BOB":6.9168,
//   "BRL":5.8073,
//   "BSD":1.0000,
//   "BTN":85.2469,
//   "BWP":13.7754,
//   "BYN":3.0616,
//   "BZD":2.0000,
//   "CAD":1.3829,
//   "CDF":2891.9076,
//   "CHF":0.8087,
//   "CLP":966.3928,
//   "CNY":7.2908,
//   "COP":4311.4105,
//   "CRC":502.2187,
//   "CUP":24.0000,
//   "CVE":95.7639,
//   "CZK":21.7324,
//   "DJF":177.7210,
//   "DKK":6.4812,
//   "DOP":60.2530,
//   "DZD":132.1579,
//   "EGP":51.1146,
//   "ERN":15.0000,
//   "ETB":130.7486,
//   "EUR":0.8688,
//   "FJD":2.2880,
//   "FKP":0.7475,
//   "FOK":6.4806,
//   "GBP":0.7476,
//   "GEL":2.7474,
//   "GGP":0.7475,
//   "GHS":15.4482,
//   "GIP":0.7475,
//   "GMD":72.7081,
//   "GNF":8702.0096,
//   "GTQ":7.7011,
//   "GYD":209.8204,
//   "HKD":7.7601,
//   "HNL":25.9205,
//   "HRK":6.5436,
//   "HTG":130.7737,
//   "HUF":353.6647,
//   "IDR":16833.5364,
//   "ILS":3.7199,
//   "IMP":0.7475,
//   "INR":85.2201,
//   "IQD":1308.4843,
//   "IRR":42001.4454,
//   "ISK":127.4638,
//   "JEP":0.7475,
//   "JMD":157.9794,
//   "JOD":0.7090,
//   "JPY":140.8526,
//   "KES":129.6945,
//   "KGS":87.2712,
//   "KHR":4027.3868,
//   "KID":1.5589,
//   "KMF":427.2685,
//   "KRW":1419.4455,
//   "KWD":0.3062,
//   "KYD":0.8333,
//   "KZT":521.5236,
//   "LAK":21733.9974,
//   "LBP":89500.0000,
//   "LKR":298.9083,
//   "LRD":199.9701,
//   "LSL":18.7434,
//   "LYD":5.4752,
//   "MAD":9.2803,
//   "MDL":17.2815,
//   "MGA":4546.8161,
//   "MKD":54.1438,
//   "MMK":2097.6391,
//   "MNT":3554.6635,
//   "MOP":7.9926,
//   "MRU":39.6462,
//   "MUR":44.8432,
//   "MVR":15.4531,
//   "MWK":1740.2222,
//   "MXN":19.7116,
//   "MYR":4.3730,
//   "MZN":63.7739,
//   "NAD":18.7434,
//   "NGN":1603.6195,
//   "NIO":36.7980,
//   "NOK":10.3832,
//   "NPR":136.3951,
//   "NZD":1.6668,
//   "OMR":0.3845,
//   "PAB":1.0000,
//   "PEN":3.7346,
//   "PGK":4.1283,
//   "PHP":56.6043,
//   "PKR":280.8868,
//   "PLN":3.7217,
//   "PYG":8029.4899,
//   "QAR":3.6400,
//   "RON":4.3522,
//   "RSD":102.9805,
//   "RUB":81.1595,
//   "RWF":1458.2425,
//   "SAR":3.7500,
//   "SBD":8.5384,
//   "SCR":14.5357,
//   "SDG":453.9919,
//   "SEK":9.5259,
//   "SGD":1.3046,
//   "SHP":0.7475,
//   "SLE":22.7819,
//   "SLL":22781.8563,
//   "SOS":571.2269,
//   "SRD":36.8883,
//   "SSP":4548.6215,
//   "STN":21.2780,
//   "SYP":12875.8762,
//   "SZL":18.7434,
//   "THB":33.1589,
//   "TJS":10.7724,
//   "TMT":3.5002,
//   "TND":2.9773,
//   "TOP":2.3895,
//   "TRY":38.2106,
//   "TTD":6.7877,
//   "TVD":1.5589,
//   "TWD":32.3837,
//   "TZS":2689.6302,
//   "UAH":41.4191,
//   "UGX":3663.4360,
//   "UYU":42.2334,
//   "UZS":12922.2839,
//   "VES":81.7613,
//   "VND":25892.6792,
//   "VUV":119.1577,
//   "WST":2.7771,
//   "XAF":569.6914,
//   "XCD":2.7000,
//   "XCG":1.7900,
//   "XDR":0.7373,
//   "XOF":569.6914,
//   "XPF":103.6385,
//   "YER":245.2019,
//   "ZAR":18.7448,
//   "ZMW":28.5349,
//   "ZWL":26.7994
//  }
// }
