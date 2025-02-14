import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { VaultService } from './vault.service';
import { CreateVaultDto } from './dto/create-vault.dto';
import { UpdateVaultDto } from './dto/update-vault.dto';
import { GetUser } from 'common/decorators/auth/get-user.decorator';
import { SessionInterface } from 'shared/interfaces/session.interface';
import { default_offset, default_page } from 'shared/constants/pagination';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResponse } from 'shared/interfaces/paginated.response.interface';
import { ResponseInterface } from 'shared/interfaces/response.interface';
import { Vault } from './entities/vault.entity';
import {
  AddCategoryToVaultDto,
  RemoveCategoryFromVaultDto,
} from './dto/update-category-vault.dto';

@ApiTags('Vault')
@Controller('vault')
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}

  @ApiOperation({
    summary: 'Create a new vault',
    description: 'Create a new vault for the user',
  })
  @ApiResponse({
    status: 201,
    description: 'Vault created successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'One or more categories not found'
  })
  @Post()
  async create(
    @GetUser() user: SessionInterface,
    @Body() createVaultDto: CreateVaultDto,
  ): Promise<ResponseInterface<null>> {
    const data = await this.vaultService.create(user.id, createVaultDto);
    return {
      message: 'Vault created successfully',
      status: 201,
    };
  }

  @ApiOperation({
    summary: 'Add category to vault',
  })
  @ApiResponse({
    status: 201,
    description: 'Category added to vault successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiResponse({
    status: 404,
    description: 'Vault not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Category already exists in vault',
  })
  @Post('/category/:vaultId')
  async addCategoryToVault(
    @GetUser() user: SessionInterface,
    @Body() addCategoryToVaultDto: AddCategoryToVaultDto,
    @Param('vaultId', new ParseUUIDPipe()) vaultId: string,
  ): Promise<ResponseInterface<null>> {
    const data = await this.vaultService.addCategoryToVault(
      user.id,
      vaultId,
      addCategoryToVaultDto.category,
    );
    return {
      message: 'Category added to vault successfully',
      status: HttpStatus.CREATED,
    };
  }

  @ApiOperation({
    summary: 'Remove category from vault',
  })
  @ApiResponse({
    status: 200,
    description: 'Category removed from vault successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found in vault',
  })
  @ApiResponse({
    status: 404,
    description: 'Vault not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Category does not exist in vault',
  })
  @Delete('/category/:vaultId')
  async removeCategoryFromVault(
    @GetUser() user: SessionInterface,
    @Body() removeCategoryFromVaultDto: RemoveCategoryFromVaultDto,
    @Param('vaultId', new ParseUUIDPipe()) vaultId: string,
  ): Promise<ResponseInterface<null>> {
    const data = await this.vaultService.removeCategoryFromVault(
      user.id,
      vaultId,
      removeCategoryFromVaultDto.category,
    );
    return {
      message: 'Category removed from vault successfully',
      status: HttpStatus.OK,
    };
  }

  @ApiOperation({
    summary: 'Get all vaults paginated',
    description: 'Get all vaults for user paginated',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @Get()
  async findAllVaultsByUserPaginated(
    @GetUser() user: SessionInterface,
    @Query('page', new DefaultValuePipe(default_page), ParseIntPipe)
    page: number,
    @Query('offset', new DefaultValuePipe(default_offset), ParseIntPipe)
    offset: number,
  ): Promise<ResponseInterface<PaginatedResponse<Vault>>> {
    const data = await this.vaultService.findAllVaultsByUserPaginated(
      user.id,
      page,
      offset,
    );
    return {
      message: 'Vaults fetched successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({
    summary: 'Get a single vault',
    description: 'Get a single vault by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Vault fetched successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Vault not found',
  })
  @Get(':id')
  async findOneVault(
    @GetUser() user: SessionInterface,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseInterface<Vault>> {
    const data = await this.vaultService.findOneVault(user.id, id);
    return {
      message: 'Vault fetched successfully',
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiOperation({
    summary: 'Update a vault',
    description: 'Update a vault by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Vault updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Vault not found',
  })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateVaultDto: UpdateVaultDto,
  ) {
    return this.vaultService.update(id, updateVaultDto);
  }

  @ApiOperation({
    summary: 'Delete a vault',
    description: 'Delete a vault by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Vault deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Vault not found',
  })
  @Delete(':id')
  async remove(
    @GetUser() user: SessionInterface,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ResponseInterface<null>> {
    const data = await this.vaultService.remove(user.id, id);
    return {
      message: 'Vault deleted successfully',
      status: HttpStatus.OK,
    };
  }
}
