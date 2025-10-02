import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv } from './config/env';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';

async function bootstrap() {
  const env = getEnv(); // validate early, exit on error

  // Honor insecure TLS for dev (curl -k behavior)
  if (env.SELECTLINE_TLS_INSECURE === '1') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  app.enableCors({
    origin: [
      process.env.CORS_ORIGIN ?? 'http://localhost:3000', // public
      process.env.CORS_ORIGIN_ADMIN ?? 'http://localhost:3002', // admin
    ],
  });

  // Global DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );

  // Lightweight response compression (helps p95)
  app.use(compression());

  // Swagger (/docs)
  const cfg = new DocumentBuilder()
    .setTitle('Packaging Catalog API')
    .setDescription('Public read endpoints for article groups & articles')
    .setVersion('1.0.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-admin-secret', // header name
        in: 'header',
        description: 'Admin shared secret (from ADMIN_SHARED_SECRET env)',
      },
      'admin', // security name used by @ApiSecurity()
    )
    .build();
  const doc = SwaggerModule.createDocument(app, cfg);
  SwaggerModule.setup('/docs', app, doc);

  await app.listen(env.PORT);

  console.log(`API listening on http://localhost:${env.PORT} — docs at /docs`);
}
bootstrap().catch((e: unknown) => {
  if (e instanceof Error) {
    console.error(e.message, e.stack);
  } else {
    console.error(String(e));
  }
  process.exit(1);
});
