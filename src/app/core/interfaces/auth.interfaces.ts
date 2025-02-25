export interface UserLoginResponseDto {
  access: string;
  customer_id: number;
  customer_category: number;
  customer_branch: number;
  name: string;
  password_changed: boolean;
  refresh: string;
  user_type: string;
  otp: string;
  valid_mobile: boolean;
}
