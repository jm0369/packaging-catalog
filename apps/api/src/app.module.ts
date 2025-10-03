// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import * as https from 'node:https';
import * as fs from 'node:fs';

import { PrismaService } from './prisma/prisma.service';
import { HealthController } from './health.controller';
import { ArticleGroupsModule } from './routes/article-groups/article-groups.module';
import { SelectLineClient } from './sync/selectline.client';
import { SyncDebugController } from './sync/sync.debug.controller';
import { SyncController } from './sync/sync.controller';
import { SyncService } from './sync/sync.service';
import { ArticlesModule } from './routes/articles/articles.module';
import { MediaModule } from './media/media.module';
import { AdminModule } from './admin/admin.module';
import { ArticleMediaModule } from './media/article-media.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TerminusModule,
    HttpModule.registerAsync({
      useFactory: () => {
        const insecure = process.env.SELECTLINE_TLS_INSECURE === '1';
        const skipHostname = process.env.SELECTLINE_TLS_SKIP_HOSTNAME === '1';
        const caPath = process.env.SELECTLINE_CA_PATH;
        const servername = process.env.SELECTLINE_TLS_SERVERNAME || undefined;

        // Build agent options without checkServerIdentity by default
        const agentOptions: https.AgentOptions = {
          rejectUnauthorized: !insecure,
          keepAlive: true,
          // Only set if provided; undefined is fine but we won't set the key at all
          ...(caPath ? { ca: fs.readFileSync(caPath) } : {}),
          ...(servername ? { servername } : {}),
        };

        // Only set checkServerIdentity when you explicitly want to skip hostname checks
        if (skipHostname) {
          agentOptions.checkServerIdentity = () => undefined;
        }

        const httpsAgent = new https.Agent(agentOptions);

        return {
          timeout: 20000,
          httpsAgent,
          proxy: false,
        };
      },
    }),
    ArticleGroupsModule,
    ArticlesModule,
    MediaModule,
    AdminModule,
    ArticleMediaModule
  ],
  controllers: [HealthController, SyncDebugController, SyncController],
  providers: [PrismaService, SelectLineClient, SyncService],
})
export class AppModule {}
