import { IsEmail, IsJSON, IsOptional, IsString } from 'class-validator';

export interface SendEmailData {
  firstname?: string;
  lastname?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  date?: string;
  device?: string;
  location?: string | string[];
  ip_address?: string | string[];
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  data?: SendEmailData;
}
