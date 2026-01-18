import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class GetEventsDto {
  @ApiPropertyOptional({
    description: 'Cursor block to start scanning from',
    example:
      'ambil block yang ada pada event snowtrace contohnya harus pakai kutip dua 50641811 ',
  })
  @IsOptional()
  @IsString()
  fromBlock?: string;

  @ApiPropertyOptional({
    description: 'Maximum block range per request',
    example: 'pilih nilai antara 1 --> 2000 jangan pakai kutip dua',
  })
  @IsOptional()
  @IsNumber()
  limitBlock?: number;
}