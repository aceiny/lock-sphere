import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VaultService } from './vault.service';
import { VaultController } from './vault.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vault } from './entities/vault.entity';
import { SessionMiddleware } from 'common/middlewares/session.middleware';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports : [TypeOrmModule.forFeature([Vault]) , CategoryModule],
  controllers: [VaultController],
  providers: [VaultService],
})
export class VaultModule  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(VaultController);
  }
}