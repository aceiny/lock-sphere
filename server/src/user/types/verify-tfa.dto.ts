import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyTfaDto {
  @Matches(/^\d{6}$/)
  token: string;
}
