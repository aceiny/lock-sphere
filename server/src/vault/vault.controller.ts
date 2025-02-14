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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
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
    summary: 'Get all vaults',
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

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateVaultDto: UpdateVaultDto,
  ) {
    return this.vaultService.update(id, updateVaultDto);
  }

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
