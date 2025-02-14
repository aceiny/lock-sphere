import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async checkCategoryExistanceByName(name: string): Promise<boolean> {
    const category = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });
    return !!category;
  }
  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    if (await this.checkCategoryExistanceByName(createCategoryDto.name)) {
      throw new ConflictException('Category already exists');
    }
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      user: { id: userId },
    });
    return this.categoryRepository.save(category);
  }

  async findBulkCategories(userId: string, ids: string[]) {
    return this.categoryRepository.find({
      where: { id: In(ids), user: { id: userId } },
    });
  }
  async findAllUserCategories(userId: string) {
    return this.categoryRepository.find({
      where: {
        user: { id: userId },
      },
    });
  }

  async findOneCategory(userId: string, id: string) {
    const category = await this.categoryRepository.findOneBy({
      id,
      user: { id: userId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryRepository.delete(id);
    if (category.affected === 0) {
      throw new NotFoundException('Category not found');
    }
    return true;
  }
}
