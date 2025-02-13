import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVaultDto } from './dto/create-vault.dto';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vault } from './entities/vault.entity';
import { Repository } from 'typeorm';
import { PaginatedResponse } from 'shared/interfaces/paginated.response.interface';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class VaultService {
  constructor(
    @InjectRepository(Vault)
    private readonly vaultService: Repository<Vault>,
    private readonly categoryService : CategoryService
  ){}
  async create(userId : string , createVaultDto: CreateVaultDto) {
    const categories = await this.categoryService.findBulkCategories(userId , createVaultDto.category_ids);
    console.log(categories)
    if(categories.length !== createVaultDto.category_ids.length){
      throw new NotFoundException('One or more categories not found');
    }
    const vault = this.vaultService.create({
      user : {id : userId},
      categories,
      ...createVaultDto
    });
    return this.vaultService.save(vault);
  }

  async findAllVaultsByUserPaginated(userId : string , page : number, offset : number) : Promise<PaginatedResponse<Vault>> {
    const [vaults, total] = await this.vaultService.findAndCount({
      where : {user : {id : userId}},
      take : offset,
      skip : (page - 1) * offset,
      relations : ['categories'],
      select : {
        id : true,
        createdAt : true,
        updatedAt : true, 
        website_name : true,
        website_url : true,
      }
    })
    return {
      data : vaults,
      total,
      page,
      offset,
      totalPages: Math.ceil(total / offset),
    }
  }

  async findOneVault(userId : string , id: string , populate : boolean = true) {
    const vault = await this.vaultService.findOne({
      where : {
        id,
        user : {id : userId},
      },
      relations : populate  ? ['categories'] :  [] 
    });
    if(!vault) {
      throw new NotFoundException("Vault not found");
    }
    return vault;
  }

  async addCategoryToVault(userId: string, vaultId: string, categoryId: string) {
    const vault = await this.findOneVault(userId, vaultId);
    const category = await this.categoryService.findOneCategory(userId, categoryId);

    if (!vault || !category) {
        throw new NotFoundException('Vault or Category not found');
    }

    const categoryExists = await this.vaultService
        .createQueryBuilder()
        .relation(Vault, "categories")
        .of(vault)
        .loadMany();

    if (categoryExists.some(cat => cat.id === category.id)) {
        throw new ConflictException('Category is already assigned to this vault');
    }

    await this.vaultService
        .createQueryBuilder()
        .relation(Vault, "categories")
        .of(vault)
        .add(category);

    return vault;
}

  update(id: string, updateVaultDto: UpdateVaultDto) {
    return `This action updates a #${id} vault`;
  }

  async remove(userId : string , id: string) {
    const vault = await this.findOneVault(userId , id , true);
    return this.vaultService.remove(vault);
  }
  async removeCategoryFromVault(userId: string, vaultId: string, categoryId: string) : Promise<boolean> {
    const vault = await this.findOneVault(userId, vaultId);
    const category = await this.categoryService.findOneCategory(userId, categoryId);

    if (!vault || !category) {
        throw new NotFoundException('Vault or Category not found');
    }

    const existingCategories = await this.vaultService
        .createQueryBuilder()
        .relation(Vault, "categories")
        .of(vault)
        .loadMany();

    if (!existingCategories.some(cat => cat.id === category.id)) {
        throw new ConflictException('Category is not assigned to this vault');
    }

    // Remove category from the vault
    await this.vaultService
        .createQueryBuilder()
        .relation(Vault, "categories")
        .of(vault)
        .remove(category);

    return true;
}

}
