import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// TODO: Implement helmet to secure the app
// TODO: Implement swagger to document the API
// TODO: Implement rate limiting to protect the API
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
