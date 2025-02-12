import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { EmailQueueProcessor } from "./email-queue.processor";
import { RedisConfig } from "config/redis-config";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [
    BullModule.forRoot({
      redis: RedisConfig,
    }),
    BullModule.registerQueue({
      name: "email-queue",
    }),
    MailModule,
  ],
  providers: [EmailQueueProcessor],
  exports: [BullModule],
})
export class QueueModule {}
