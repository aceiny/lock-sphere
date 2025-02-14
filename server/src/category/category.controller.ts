import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetUser } from 'common/decorators/auth/get-user.decorator';
import { SessionInterface } from 'shared/interfaces/session.interface';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseInterface } from 'shared/interfaces/response.interface';
import { Category } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Create a new category',
    description: 'Create a new category for the user',
  })
  @Post()
  async create(
    @GetUser() user: SessionInterface,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseInterface<null>> {
    const data = await this.categoryService.create(user.id, createCategoryDto);
    return {
      message: 'Category created successfully',
      status: HttpStatus.CREATED,
    };
  }

  @ApiOperation({
    summary: 'Get all categories for user',
    description: 'Get all categories for the user',
  })
  @Get()
  async findAll(
    @GetUser() user: SessionInterface,
  ): Promise<ResponseInterface<Category[]>> {
    const data = await this.categoryService.findAllUserCategories(user.id);
    return {
      message: 'Categories fetched successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  @Get('/:id')
  async findOne(
    @GetUser() user: SessionInterface,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseInterface<Category>> {
    const data = await this.categoryService.findOneCategory(user.id, id);
    return {
      message: 'Categories fetched successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.categoryService.remove(id);
    return {
      message: 'Categories fetched successfully',
      status: HttpStatus.OK,
    };
  }
}
