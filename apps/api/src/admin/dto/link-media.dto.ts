import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class LinkMediaDto {
  @ApiProperty() @IsUUID() mediaId!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() altText?: string;
}
