import { IsUUID } from "class-validator";

export class AddCategoryToVaultDto {
    @IsUUID("4")
    category: string
}


export class RemoveCategoryFromVaultDto {
    @IsUUID("4")
    category: string
}