import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getEnv } from '../config/env';

@Injectable()
export class S3Service {
  private client: S3Client;
  private bucket: string;

  constructor() {
    const env = getEnv();
    this.bucket = env.S3_BUCKET;
    this.client = new S3Client({
      region: env.S3_REGION,
      endpoint: env.S3_ENDPOINT || undefined,
      forcePathStyle: !!env.S3_ENDPOINT, // needed for many S3-compatible providers
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async putObject(key: string, body: Buffer, contentType?: string) {
    const uploader = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ACL: 'public-read', // if your bucket policy isn’t public, remove this
      },
    });
    await uploader.done();
    return { key };
  }
}
