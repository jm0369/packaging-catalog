import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer'; // <-- add this
import { AdminGuard } from '../admin/admin.guard';
import { MediaService } from './media.service';
import {
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiSecurity,
} from '@nestjs/swagger';

@ApiTags('admin-media')
@ApiSecurity('admin')
@Controller()
@UseGuards(AdminGuard)
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Post('/admin/media/upload')
  @ApiOperation({ summary: 'Upload media (multipart/form-data)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(), // <-- use memory storage here
      limits: { fileSize: 5 * 1024 * 1024 }, // optional 5MB cap
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    const asset = await this.media.uploadToS3AndCreateAsset(file, 'groups');
    return asset;
  }
}
