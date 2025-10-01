import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv } from './config/env';

async function bootstrap() {
  const env = getEnv(); // validate early, exit on error

  // Honor insecure TLS for dev (like curl -k)
  if (env.SELECTLINE_TLS_INSECURE === '1') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  await app.listen(env.PORT);
  console.log(`API listening on http://localhost:${env.PORT}`);
}
bootstrap();
