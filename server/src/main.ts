import { CreateServer } from 'config/app.config';

async function bootstrap() {
  const app = await CreateServer()
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
