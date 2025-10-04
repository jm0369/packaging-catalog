import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import { validateEnv } from './config/env.js';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const env = validateEnv(process.env as any);

  // curl -k behavior for dev
  if (env.SELECTLINE_TLS_INSECURE === '1') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  app.enableCors({
    origin: env.CORS_ORIGIN ?? true,
    credentials: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );

  app.use(compression());

  const cfg = new DocumentBuilder()
    .setTitle('Packaging Catalog API')
    .setDescription('Public read API + admin media endpoints')
    .setVersion('1.0.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-admin-secret', in: 'header' },
      'admin',
    )
    .build();
  const doc = SwaggerModule.createDocument(app, cfg);
  SwaggerModule.setup('/docs', app, doc);

  await app.listen(env.PORT);
  // eslint-disable-next-line no-console
  console.log(`API http://localhost:${env.PORT} • /docs`);
}

bootstrap().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('Fatal bootstrap error:', e instanceof Error ? e.stack ?? e.message : e);
  process.exit(1);
});