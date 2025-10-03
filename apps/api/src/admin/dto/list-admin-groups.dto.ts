import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min, IsString } from 'class-validator';

export class ListAdminGroupsDto {
  @ApiPropertyOptional({ default: 20, minimum: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit = 20;

  @ApiPropertyOptional({ default: 0, minimum: 0 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  offset = 0;

  @ApiPropertyOptional({ description: 'Search in name/description' })
  @IsOptional()
  @IsString()
  q?: string;
}
