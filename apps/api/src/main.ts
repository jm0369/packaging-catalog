// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const cfg = new DocumentBuilder()
    .setTitle('Catalog API')
    .setVersion('1.0')
    .build();
  const doc = SwaggerModule.createDocument(app, cfg);
  SwaggerModule.setup('docs', app, doc);
  await app.listen(process.env.PORT || 3001);
}
void bootstrap();
