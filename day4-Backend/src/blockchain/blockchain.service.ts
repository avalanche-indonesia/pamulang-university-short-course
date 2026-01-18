import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { createPublicClient, http, PublicClient } from 'viem';
import { avalancheFuji } from 'viem/chains';
import SIMPLE_STORAGE from './SimpleStorage.json';

@Injectable()
export class BlockchainService {
  private client: PublicClient;
  private contractAddress: `0x${string}`;

  private static readonly MAX_BLOCK_RANGE = 2000n;
  private static readonly DEFAULT_LIMIT = 1000n;
  private static readonly ANCHOR_BLOCK = 50_507_570n;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
    });

    this.contractAddress =
      '0xFdfEf3f3291648fc3D89Cf3f1556AA1e537f103e' as `0x${string}`;
  }
  
  // Read latest value
  async getLatestValue() {
    try {
      const value = (await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE.abi,
        functionName: 'getValue',
      })) as bigint;

      return {
        value: value.toString(),
      };
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // Cursor-based event pagination
  
  async getValueUpdatedEventsPaginated(
    fromBlock?: string,
    limitBlock?: number,
  ) {
    try {
      const limit = BigInt(limitBlock ?? BlockchainService.DEFAULT_LIMIT);

      if (limit > BlockchainService.MAX_BLOCK_RANGE) {
        throw new BadRequestException(
          `limitBlock maksimal ${BlockchainService.MAX_BLOCK_RANGE.toString()}`,
        );
      }

      const toBlock = fromBlock
        ? BigInt(fromBlock)
        : BlockchainService.ANCHOR_BLOCK;

      const startBlock = toBlock - limit + 1n;

      if (startBlock < 0n) {
        throw new BadRequestException('fromBlock tidak valid');
      }

      const events = await this.client.getLogs({
        address: this.contractAddress,
        event: {
          type: 'event',
          name: 'ValueUpdated',
          inputs: [
            {
              name: 'newValue',
              type: 'uint256',
              indexed: false,
            },
          ],
        },
        fromBlock: startBlock,
        toBlock,
      });

      return {
        items: events.map((event) => ({
          blockNumber: event.blockNumber?.toString(),
          value: event.args?.newValue?.toString(),
          txHash: event.transactionHash,
        })),
        meta: {
          fromBlock: startBlock.toString(),
          toBlock: toBlock.toString(),
          totalFetched: events.length,
          nextFromBlock: startBlock > 0n ? (startBlock - 1n).toString() : null,
        },
      };
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // Centralized RPC Error Handler
    
  private handleRpcError(error: unknown): never {
    const message = error instanceof Error ? error.message : String(error);

    console.error('[Blockchain RPC Error]', message);

    if (message.includes('timeout')) {
      throw new ServiceUnavailableException(
        'RPC timeout. Mohon coba beberapa saat lagi.',
      );
    }

    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('failed')
    ) {
      throw new ServiceUnavailableException(
        '❌ Tidak dapat terhubung ke blockchain RPC.',
      );
    }

    throw new InternalServerErrorException(
      '⚠️ Limit terlalu besar ganti dengan <= 2000',
    );
  }
}