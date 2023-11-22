import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env['PORT'] || '3030';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(Number(3030));
}
bootstrap().then(() =>
  console.log(`Server started at http://localhost:${PORT}`),
);
