import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SelectLineClient } from './selectline.client';
import https from 'https';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Allow self-signed certificates
      }),
    }),
  ],
  providers: [SelectLineClient],
  exports: [SelectLineClient],
})
export class SelectLineModule {}