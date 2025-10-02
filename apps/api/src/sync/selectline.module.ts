import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SelectLineClient } from './selectline.client';

@Module({
  imports: [
    ConfigModule, // if your client reads env in constructor
    HttpModule, // gives HttpService
  ],
  providers: [SelectLineClient],
  exports: [SelectLineClient], // <-- make it available to other modules
})
export class SelectLineModule {}
