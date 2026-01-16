'use client';

import { useEffect, useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useSwitchChain,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { toast } from 'sonner';
import { BaseError } from 'viem';


//  CONFIG


// address contract hasil deploy Day 2
const CONTRACT_ADDRESS = '0xAA60FFeE82A62C8175b47975331800C181A04aAf';

// ABI SIMPLE STORAGE
const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: 'getValue',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_value', type: 'uint256' }],
    name: 'setValue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// Avalanche Fuji
const TARGET_CHAIN_ID = 43113;

export default function Page() {
  
  // Hydration guard
 
  const [mounted, setMounted] = useState(false);

  
  // wallet hooks
  
  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== TARGET_CHAIN_ID;

 
  //  lokal stage

  const [inputValue, setInputValue] = useState('');

  
  // read contract
  
  const {
    data: value,
    isFetching: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
    query: {
      enabled: mounted && isConnected && !isWrongNetwork,
    },
  });

  
  //  write contract
  
  const { writeContract, isPending: isWriting } = useWriteContract();

  
  //  EFFECT
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // return sebelum hook
  if (!mounted) return null;

 
  //  helper
 
  const shortenAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  const isTxReverted = (error: unknown) =>
    error instanceof BaseError &&
    error.shortMessage?.toLowerCase().includes('revert');

  
  // handler
  
  const handleSetValue = () => {
    if (!isConnected) {
      toast.warning('Please connect your wallet');
      return;
    }

    if (isWrongNetwork) {
      toast.error('Wrong network. Switch to Avalanche Fuji');
      return;
    }

    if (!inputValue || isNaN(Number(inputValue))) {
      toast.error('Input must be a valid number');
      return;
    }

    const parsedValue = BigInt(Math.floor(Number(inputValue)));
    const toastId = toast.loading('Sending transaction...');

    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'setValue',
        args: [parsedValue],
      },
      {
        onSuccess: () => {
          toast.loading('Waiting confirmation...', { id: toastId });
          refetch();
          toast.success('Transaction success', { id: toastId });
        },
        onError: (error) => {
          const cause: any = (error as any)?.cause;

          // User reject
          if (cause?.code === 4001) {
            toast.error('Transaction rejected by user', { id: toastId });
            return;
          }

          // Revert
          if (isTxReverted(error)) {
            toast.error('Transaction reverted by smart contract', {
              id: toastId,
            });
            return;
          }

          toast.error('Transaction failed', { id: toastId });
        },
      }
    );
  };

  
  //  UI
  
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md border border-gray-700 rounded-lg p-6 space-y-6">
        <h1 className="text-xl font-bold" style={{ textAlign: 'center' }}>
          Day3 Frontend dApp (Avalanche)
        </h1>

        {/* WALLET */}
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className="w-full bg-white text-black py-2 rounded"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Connected Address</p>
            <p className="font-mono text-xs">{shortenAddress(address)}</p>

            {isWrongNetwork && (
              <button
                onClick={() => switchChain({ chainId: TARGET_CHAIN_ID })}
                disabled={isSwitching}
                className="w-full bg-red-600 py-2 rounded"
              >
                {isSwitching ? 'Switching...' : 'Switch to Avalanche Fuji'}
              </button>
            )}

            <button
              onClick={() => disconnect()}
              className="text-red-400 text-sm underline"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* read*/}
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <p className="text-sm text-gray-400">Contract Value</p>
          {isReading ? (
            <p>Loading...</p>
          ) : (
            <p className="text-2xl font-bold">{value?.toString()}</p>
          )}
          <button
            onClick={() => refetch()}
            className="text-sm underline text-gray-300"
          >
            Refresh value
          </button>
        </div>

        {/* write */}
        <div className="border-t border-gray-700 pt-4 space-y-3">
          <p className="text-sm text-gray-400">Update Contract Value</p>
          <input
            type="number"
            placeholder="New value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 rounded bg-black border border-gray-600"
          />
          <button
            onClick={handleSetValue}
            disabled={isWriting || !isConnected || isWrongNetwork}
            className="w-full bg-blue-600 py-2 rounded disabled:opacity-50"
          >
            {isWriting ? 'Updating...' : 'Set Value'}
          </button>
        </div>

        <p className="text-xs text-gray-500 ">
          Smart contract = single source of truth
        </p>  
        <div className=" space-y-1 text-xs text-gray-400">
         <p>Nama : Eldrick Arsy Listyanika</p>
         <p>NIM : 251011401100</p>
</div>
      </div>
    </main>
  );
}
