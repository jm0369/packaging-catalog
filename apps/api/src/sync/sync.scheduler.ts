import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SyncService } from './sync.service';

@Injectable()
export class SyncScheduler {
  private readonly logger = new Logger(SyncScheduler.name);

  constructor(private readonly syncService: SyncService) {}

  // Run every day at 2 AM
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailySync() {
    this.logger.log('Starting scheduled sync...');
    try {
      await this.syncService.syncAll();
      this.logger.log('Scheduled sync completed successfully');
    } catch (error) {
      this.logger.error('Scheduled sync failed', error);
    }
  }

  // Or run every hour
  // @Cron(CronExpression.EVERY_HOUR)
  // async handleHourlySync() { ... }
}