import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to sphere lock api ,  please use the correct endpoints! , check the docs on /api/docs';
  }
}
