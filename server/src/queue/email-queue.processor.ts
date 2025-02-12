import { Process, Processor } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bull";
import { MailService } from "src/mail/mail.service";

@Injectable()
@Processor("email-queue")
export class EmailQueueProcessor {
  private readonly logger = new Logger(EmailQueueProcessor.name);

  constructor(private readonly mailService: MailService) {}

  @Process("new-login")
  async handleNewLogin(job: Job) {
    try {
      this.logger.debug(`Processing new login email job ${job.id}`);
      const { mailDto } = job.data;
      await this.mailService.sendNewLoginMail(mailDto);
      this.logger.debug(`Successfully processed new login email job ${job.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to process new login email job ${job.id}:`,
        error,
      );
      throw error;
    }
  }

 
}
