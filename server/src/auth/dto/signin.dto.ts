import { IsEmail , IsStrongPassword } from "class-validator";

export class SigninDto {
    @IsEmail()
    email : string

    @IsStrongPassword()
    password : string
}
