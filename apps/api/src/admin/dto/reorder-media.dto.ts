// apps/api/src/admin/dto/reorder-media.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class ReorderMediaDto {
  @ApiProperty({
    description: 'Array of link IDs in the desired order (top/primary first)',
    type: [String],
    example: [
      '4d6c9f22-a9ca-4671-8951-f78e15a37f89',
      '11111111-2222-3333-4444-555555555555',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  order!: string[];
}
