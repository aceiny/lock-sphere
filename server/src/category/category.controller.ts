import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetUser } from 'common/decorators/auth/get-user.decorator';
import { SessionInterface } from 'shared/interfaces/session.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseInterface } from 'shared/interfaces/response.interface';
import { Category } from './entities/category.entity';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Create a new category',
    description: 'Create a new category for the user',
  })
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Create a new category for the user',
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Category already exists',
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
  @ApiResponse({
    status: 200,
    description: 'Categories fetched successfully',
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

  @ApiOperation({
    summary : "find category by id",
  })
  @ApiResponse({
    status: 200,
    description: 'Category fetched successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found'
  })
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

  @ApiOperation({
    summary: 'Delete category by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const data = await this.categoryService.remove(id);
    return {
      message: 'Categories fetched successfully',
      status: HttpStatus.OK,
    };
  }
}
