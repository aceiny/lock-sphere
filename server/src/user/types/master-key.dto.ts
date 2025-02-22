import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateOrCheckMasterKeyDto {
    @ApiProperty({
        title : "master key",
        description : "encrypted master key sent from the frontend",
        example : "LqTKyH9QrgUq/oBtMe7qB9/SUBru0P1jS5InCxzVFHbjocowpGi30UXSxqWsIbYbrQ3TbxoQFd1nmNbXDmEj8A"
    })
    @IsString()
    master_key: string;
}