import { ApiProperty } from '@nestjs/swagger';

export class GetEventsDto {
  @ApiProperty({
    description: 'The starting block number to fetch events from',
    example: 1000000,
  })
  fromBlock: number;

  @ApiProperty({
    description: 'The ending block number to fetch events to',
    example: 1000100,
  })
  toBlock: number;
}
