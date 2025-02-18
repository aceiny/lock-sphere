import { CreateServer } from 'cmd/create-server';

async function bootstrap() {
  const app = await CreateServer();
  app.set('trust proxy', true);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
