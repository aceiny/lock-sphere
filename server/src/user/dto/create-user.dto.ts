import { IsEmail, IsStrongPassword, Matches } from 'class-validator';

export class CreateUserDto {
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,100}$/, {
    message: 'Please entre a valid name',
  })
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
