import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Param,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer'; // <-- add this
import { AdminGuard } from '../admin/admin.guard';
import { MediaService } from './media.service';
import {
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiSecurity,
} from '@nestjs/swagger';
import { LinkMediaDto } from './dto/link-media.dto';

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

  @Post('/admin/article-groups/:externalId/media')
  @ApiOperation({
    summary: 'Link a media asset as group primary (sortOrder=0)',
  })
  @ApiParam({ name: 'externalId', type: String })
  async linkGroup(
    @Param('externalId') externalId: string,
    @Body() dto: LinkMediaDto,
  ) {
    const link = await this.media.linkGroupPrimary(externalId, dto.mediaId);
    return link;
  }
}
