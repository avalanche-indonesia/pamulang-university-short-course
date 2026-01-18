'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-6 border rounded space-y-4">
        <h1 className="text-xl font-bold">Step 1: Connect Wallet</h1>

        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isPending}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {isPending ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm">Connected address:</p>
            <p className="font-mono text-xs break-all">{address}</p>

            <button
              onClick={() => disconnect()}
              className="text-sm underline text-red-600"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
