// apps/api/src/scripts/cleanup-media.ts
/* eslint-disable no-console */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const DATABASE_URL = process.env.DATABASE_URL;
const S3_REGION = process.env.S3_REGION!;
const S3_ENDPOINT = process.env.S3_ENDPOINT!;
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID!;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY!;
const S3_BUCKET = process.env.S3_BUCKET!;

if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL');
  process.exit(1);
}

if (!S3_REGION || !S3_ENDPOINT || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_BUCKET) {
  console.error('Missing S3 configuration: S3_REGION, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET');
  process.exit(1);
}

const prisma = new PrismaClient();
const s3 = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

async function deleteAllS3Objects() {
  console.log('🗑️  Deleting all objects from S3 bucket...');
  
  let continuationToken: string | undefined;
  let totalDeleted = 0;

  do {
    // List objects in the bucket
    const listCommand = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      ContinuationToken: continuationToken,
    });

    const listResponse = await s3.send(listCommand);
    
    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.log('No more objects to delete');
      break;
    }

    // Delete objects in batches (max 1000 per request)
    const objectsToDelete = listResponse.Contents.map(obj => ({ Key: obj.Key! }));
    
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: S3_BUCKET,
      Delete: {
        Objects: objectsToDelete,
        Quiet: false,
      },
    });

    const deleteResponse = await s3.send(deleteCommand);
    const deletedCount = deleteResponse.Deleted?.length || 0;
    totalDeleted += deletedCount;
    
    console.log(`  Deleted ${deletedCount} objects (total: ${totalDeleted})`);

    if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
      console.error('  Errors encountered:');
      deleteResponse.Errors.forEach(error => {
        console.error(`    - ${error.Key}: ${error.Message}`);
      });
    }

    continuationToken = listResponse.NextContinuationToken;
  } while (continuationToken);

  console.log(`✅ Deleted ${totalDeleted} objects from S3`);
  return totalDeleted;
}

async function deleteAllMediaFromDatabase() {
  console.log('🗑️  Deleting all media records from database...');

  // Count records before deletion
  const [articleMediaCount, groupMediaCount, mediaAssetCount] = await Promise.all([
    prisma.articleMediaLink.count(),
    prisma.groupMediaLink.count(),
    prisma.mediaAsset.count(),
  ]);

  console.log(`  Found ${articleMediaCount} article media links`);
  console.log(`  Found ${groupMediaCount} group media links`);
  console.log(`  Found ${mediaAssetCount} media assets`);

  // Delete in correct order (links first, then assets)
  // The CASCADE constraints should handle this, but we'll be explicit
  const deletedArticleLinks = await prisma.articleMediaLink.deleteMany();
  console.log(`  ✓ Deleted ${deletedArticleLinks.count} article media links`);

  const deletedGroupLinks = await prisma.groupMediaLink.deleteMany();
  console.log(`  ✓ Deleted ${deletedGroupLinks.count} group media links`);

  const deletedAssets = await prisma.mediaAsset.deleteMany();
  console.log(`  ✓ Deleted ${deletedAssets.count} media assets`);

  console.log('✅ Deleted all media records from database');
}

async function main() {
  console.log('🚀 Starting media cleanup...');
  console.log('');
  
  try {
    // Step 1: Delete from S3
    await deleteAllS3Objects();
    console.log('');

    // Step 2: Delete from database
    await deleteAllMediaFromDatabase();
    console.log('');

    console.log('✨ Media cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
