import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getEnv } from '../config/env';
import crypto from 'node:crypto';

@Injectable()
export class S3Service {
  private readonly env = getEnv();
  private readonly s3 = new S3Client({
    region: this.env.S3_REGION,
    endpoint: this.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: this.env.S3_ACCESS_KEY_ID,
      secretAccessKey: this.env.S3_SECRET_ACCESS_KEY,
    },
  });

  async uploadImage(buffer: Buffer, mime: string): Promise<{ key: string; url: string }> {
    const hash = crypto.randomBytes(4).toString('hex');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
    const key = `uploads/${ts}-${hash}.${ext}`;

    await this.s3.send(new PutObjectCommand({
      Bucket: this.env.S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mime,
      CacheControl: 'public, max-age=31536000, immutable',
    }));

    const url = `${this.env.PUBLIC_CDN_BASE}/${key}`;
    return { key, url };
  }
}