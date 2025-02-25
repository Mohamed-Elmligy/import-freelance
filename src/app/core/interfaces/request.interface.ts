export interface ResponseDto {
  response_id: number;
  message: string;
  count: number;
  data: any;
}

export class FilterModelDto {
  customer_category!: number;
  request_number!: string;
  request_type!: string;
  request_status!: number;
  branch!: number;
  mobile!: number;
  name!: string;
  is_deleted!: boolean;

  first_name!: string;
  username!: string;

  customer_number!: number;
  sago_customer_id!: number;
  sago_record_id!: number;
  sap_customer_id!: number;
  order_by!: string;

  constructor() {
    this.order_by = '-id';
  }
}
