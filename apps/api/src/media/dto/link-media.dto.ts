import { IsUUID } from 'class-validator';

export class LinkMediaDto {
  @IsUUID()
  mediaId!: string;
}
