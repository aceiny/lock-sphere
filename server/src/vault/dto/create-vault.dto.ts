import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateVaultDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  encrypted_payload: string;

  @IsString()
  @IsNotEmpty()
  website_name: string;

  @IsString()
  @IsUrl()
  @IsOptional()w
  website_url?: string;

  @IsOptional()
  @IsUUID('4')
  category?: string;
}
