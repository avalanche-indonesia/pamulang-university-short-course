import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';
import { GetEventsDto } from './dto/get-events.dto';


@ApiTags('blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('value')
  @ApiOperation({ summary: 'Get latest stored value' })
  async getValue() {
    return this.blockchainService.getLatestValue();
  }

  @Post('events')
  @ApiOperation({
    summary: 'Get ValueUpdated events with cursor-based pagination',
    description: '❗❗Click "Try it out" to input fromBlock and limitBlock❗❗',
  })
  async getEvents(@Body() body: GetEventsDto) {
    return this.blockchainService.getValueUpdatedEventsPaginated(
      body.fromBlock,
      body.limitBlock,
    );
  }
}