import { Injectable } from '@nestjs/common';
import { AuthLogService } from 'src/auth_log/auth_log.service';
import { CategoryService } from 'src/category/category.service';
import { UserService } from 'src/user/user.service';
import { VaultService } from 'src/vault/vault.service';

@Injectable()
export class BackupService {
  constructor(
    private readonly userService : UserService,
    private readonly vaultService : VaultService, 
    private readonly categoryService : CategoryService,
    private readonly authLogService : AuthLogService
  ){}
  async getCopyOfBackup(userId : string){
    const user = await this.userService.findOneById(userId);
    const vaults = await this.vaultService.findAllByUserId(userId);
    const categories = await this.categoryService.findAllUserCategories(userId);
    const authLogs = await this.authLogService.findAllByUserId(userId);
    return {
      user,
      vaults,
      categories,
      authLogs
  }
}
}
