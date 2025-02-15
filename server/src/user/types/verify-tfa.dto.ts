import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class VerifyTfaDto {
  @Matches(/^\d{6}$/)
  token: string;
  
  @IsString()
  @IsNotEmpty()
  challange: string;
}
export class VerifyTfaSetupDto {
  @Matches(/^\d{6}$/)
  token: string;
  
}