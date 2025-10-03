import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateArticleActiveDto {
  @ApiProperty({ type: Boolean, example: true })
  @IsBoolean()
  active!: boolean;
}
