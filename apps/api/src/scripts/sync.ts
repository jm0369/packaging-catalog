import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SyncService } from '../sync/sync.service';
import { Logger } from '@nestjs/common';

const logger = new Logger('SyncCLI');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  logger.log('Creating application context...');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const syncService = app.get(SyncService);

  try {
    switch (command) {
      case 'all':
      case undefined:
        logger.log('Starting full synchronization...');
        await syncService.syncAll();
        logger.log('✓ Full synchronization completed successfully');
        break;

      case 'help':
        printHelp();
        break;

      default:
        logger.error(`Unknown command: ${command}`);
        printHelp();
        process.exit(1);
    }
  } catch (error) {
    logger.error('Synchronization failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

function printHelp() {
  console.log(`
SelectLine Sync CLI

Usage:
  pnpm sync [command]

Commands:
  all          Sync everything (articles, groups, media) - default
  articles     Sync articles only
  groups       Sync article groups only
  media        Sync media files only
  help         Show this help message

Examples:
  pnpm sync              # Sync everything
  pnpm sync articles     # Sync only articles
  pnpm sync groups       # Sync only article groups
  pnpm sync media        # Sync only media files
  `);
}

main();