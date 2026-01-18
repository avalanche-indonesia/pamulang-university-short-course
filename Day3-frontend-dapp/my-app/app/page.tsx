"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { Toaster, toast } from "sonner";
import { BaseError } from "viem";
import { useState } from "react";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useConfig } from "wagmi";
import { useEffect } from "react";
import {
  getBlockchainValue,
  getBlockchainEvents,
} from "../src/contracts/services/blockchain.services";

// ==============================
//  CONFIG
// =============================;

const CONTRACT_ADDRESS = "0xd77A8283e01864b57Cda7E19ad6bc4c658858425";

const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: "getValue",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "message",
    outputs: [{ type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_value", type: "uint256" }],
    name: "setValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_message", type: "string" }],
    name: "setMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function Page() {
  // ==============================
  //  HELPER
  // ==============================
  const config = useConfig();
  const isTxReverted = (error: unknown) => {
    if (error instanceof BaseError) {
      return error.shortMessage?.toLowerCase().includes("reverted");
    }
    return false;
  };

  // ==============================
  //  WALLET
  // ==============================
  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // ==============================
  //  NETWORK CHECK
  // ==============================
  const TARGET_CHAIN_ID = 43113; // Avalanche Fuji
  const isWrongNetwork = isConnected && chainId !== TARGET_CHAIN_ID;
  const getNetworkName = (chainId?: number) => {
    switch (chainId) {
      case 43113:
        return "Avalanche Fuji";
      case 43114:
        return "Avalanche C-Chain";
      case 1:
        return "Ethereum Mainnet";
      case 5:
        return "Goerli";
      default:
        return "Unknown Network";
    }
  };

  // ==============================
  //  STATE
  // ==============================
  const [inputValue, setInputValue] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [pendingType, setPendingType] = useState<"value" | "message" | null>(
    null
  );
  // ==============================
  // BACKEND READ STATE
  // ==============================
  type BlockchainEvent = {
    blockNumber: string;
    value: string;
    txHash: string;
  };

  const [backendValue, setBackendValue] = useState<string | null>(null);
  const [backendEvents, setBackendEvents] = useState<BlockchainEvent[]>([]);
  const [fromBlock, setFromBlock] = useState<string>("");
  const [limitBlock, setLimitBlock] = useState<number>(10);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const fetchBackendValue = async () => {
    const res = await getBlockchainValue();
    setBackendValue(res.value);
  };
  const fetchBackendEvents = async () => {
    try {
      setLoadingEvents(true);
      console.log("FETCH EVENTS PARAMS", {
  fromBlock,
  limitBlock,
});

      const res = await getBlockchainEvents({
        fromBlock: fromBlock || undefined,
        limitBlock,
      });
      setBackendEvents(res.items);
    } catch (e) {
      console.error("Failed to fetch events", e);
    } finally {
      setLoadingEvents(false);
    }
  };
  useEffect(() => {
    // const fetchBackendValue = async () => {
    //   try {
    //     const valueRes = await getBlockchainValue();
    //     setBackendValue(valueRes.value);

    //     const eventsRes = await getBlockchainEvents();
    //     setBackendEvents(eventsRes.items);
    //   } catch (e) {
    //     console.error("Backend fetch failed", e);
    //   }
    // };
    fetchBackendValue();

    // auto refresh tiap 5 detik
    const interval = setInterval(() => {
      fetchBackendValue();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ==============================
  //  READ
  // ==============================
  const {
    // data: value,
    refetch: refetchValue,
    // isFetching: isFetchingValue,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: "getValue",
  });

  const {
    data: message,
    refetch: refetchMessage,
    isFetching: isFetchingMessage,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: "message",
  });

  // ==============================
  //  WRITE
  // ==============================
  const { writeContract, isPending: isWriting } = useWriteContract();

  const handleSetValue = () => {
    if (!isConnected) {
      toast.warning("Please connect your wallet first");
      return;
    }

    if (isWrongNetwork) {
      toast.error("Wrong network. Please switch to Avalanche Fuji");
      return;
    }

    if (!inputValue) return;

    setPendingType("value");

    const toastId = toast.loading("Sending transaction (set value)...");

    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: SIMPLE_STORAGE_ABI,
        functionName: "setValue",
        args: [BigInt(inputValue)],
      },
      {
        onSuccess: async (hash) => {
          toast.loading("Waiting for confirmation...", { id: toastId });

          await waitForTransactionReceipt(config, {
            hash,
          });

          toast.success("Value updated successfully", { id: toastId });
          refetchValue();
        },

        onError(error) {
          if (error instanceof BaseError) {
            const cause = error.cause;

            //  User reject
            if (
              typeof cause === "object" &&
              cause !== null &&
              "code" in cause &&
              cause.code === 4001
            ) {
              toast.error("Transaction rejected by user", { id: toastId });
              return;
            }

            // Revert
            if (isTxReverted(error)) {
              toast.error("Transaction reverted by smart contract", {
                id: toastId,
              });
              return;
            }
          }

          // Fallback
          toast.error("Transaction failed", { id: toastId });
        },

        onSettled() {
          setPendingType(null);
        },
      }
    );
  };

  const handleSetMessage = () => {
    if (!isConnected) {
      toast.warning("Please connect your wallet first");
      return;
    }

    if (isWrongNetwork) {
      toast.error("Wrong network. Please switch to Avalanche Fuji");
      return;
    }

    if (!inputMessage) return;

    setPendingType("message");

    const toastId = toast.loading("Sending transaction (set message)...");

    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: SIMPLE_STORAGE_ABI,
        functionName: "setMessage",
        args: [inputMessage],
      },
      {
        onSuccess: async (hash) => {
          toast.loading("Waiting for confirmation...", { id: toastId });

          await waitForTransactionReceipt(config, {
            hash,
          });

          toast.success("Message updated successfully", { id: toastId });
          refetchMessage();
        },

        onError(error) {
          if (error instanceof BaseError) {
            const cause = error.cause;

            //  User reject
            if (
              typeof cause === "object" &&
              cause !== null &&
              "code" in cause &&
              cause.code === 4001
            ) {
              toast.error("Transaction rejected by user", { id: toastId });
              return;
            }

            //  Revert
            if (isTxReverted(error)) {
              toast.error("Transaction reverted by smart contract", {
                id: toastId,
              });
              return;
            }
          }

          // Fallback
          toast.error("Transaction failed", { id: toastId });
        },

        onSettled() {
          setPendingType(null);
        },
      }
    );
  };

  // ==============================
  //  UI
  // ==============================
  const shortenAddress = (addr?: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-8">
      <Toaster position="top-left" richColors closeButton />

      <div className="w-full max-w-6xl glass glow p-8 grid grid-cols-2 gap-10">
        {/* ================= LEFT ================= */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-wide">Avalanche dApp</h1>

          {/* Wallet */}
          {!isConnected ? (
            <button
              onClick={() => connect({ connector: injected() })}
              disabled={isConnecting}
              className="w-full py-2 rounded-lg
      bg-gradient-to-r from-indigo-500 to-cyan-500
      hover:opacity-90 transition"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-300">Connected</p>

              <div
                className="flex flex-col items-start px-4 py-3 rounded-lg
      bg-black/40 border border-white/20
      backdrop-blur-md"
              >
                {/* Top row: status dot + address */}
                <div className="flex items-center gap-2 w-full justify-between">
                  <div className="flex items-center gap-2">
                    {/* Status dot */}
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isWrongNetwork
                          ? "bg-red-400"
                          : "bg-green-400 animate-pulse"
                      }`}
                    />

                    {/* Short address */}
                    <span className="font-mono text-sm">
                      {shortenAddress(address)}
                    </span>
                  </div>

                  {/* Disconnect button */}
                  <button
                    onClick={() => disconnect()}
                    className="text-red-400 text-xs hover:underline"
                  >
                    Disconnect
                  </button>
                </div>

                {/* Network name */}
                <span
                  className={`text-xs ${
                    isWrongNetwork ? "text-red-400" : "text-gray-400"
                  } mt-1`}
                >
                  {getNetworkName(chainId)}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-black/40 border border-white/20 p-4">
            <p className="text-sm text-gray-400">Latest Value (Backend)</p>
            <p className="text-2xl font-bold">{backendValue ?? "Loading..."}</p>
          </div>

          <div className="pt-4 border-t border-white/20 space-y-3">
            <p className="text-sm text-gray-300">Message</p>

            {/* Message Container */}
            <div className="relative px-4 py-3 rounded-lg bg-black/40 border border-white/20 overflow-hidden">
              {isFetchingMessage ? (
                <div className="h-6 w-3/4 rounded bg-white/10 animate-pulse" />
              ) : (
                <p className="text-lg break-words">{message as string}</p>
              )}

              {/* Loading overlay */}
              {isFetchingMessage && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
              )}
            </div>

            <button
              onClick={() => refetchMessage()}
              disabled={isFetchingMessage}
              className={`text-sm underline transition
      ${
        isFetchingMessage ? "text-gray-500 cursor-not-allowed" : "text-gray-300"
      }`}
            >
              {isFetchingMessage ? "Refreshing..." : "Refresh message"}
            </button>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Actions</h2>

          {/* Set Value */}
          <div className="space-y-3">
            <p className="text-sm text-gray-300">Update Value</p>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="New value"
              className="w-full p-2 rounded bg-black/40 border border-white/20"
            />
            <button
              onClick={handleSetValue}
              disabled={isWriting && pendingType === "value"}
              className={`w-full py-2 rounded-lg transition bg-gradient-to-r from-blue-600 to-purple-600
    ${
      isWriting && pendingType === "value"
        ? "opacity-60 cursor-not-allowed"
        : "hover:scale-[1.02]"
    }`}
            >
              {isWriting && pendingType === "value"
                ? "Pending..."
                : "Set Value"}
            </button>
          </div>

          {/* Set Message */}
          <div className="space-y-3 pt-4 border-t border-white/20">
            <p className="text-sm text-gray-300">Update Message</p>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="New message"
              className="w-full p-2 rounded bg-black/40 border border-white/20"
            />
            <button
              onClick={handleSetMessage}
              disabled={isWriting && pendingType === "message"}
              className={`w-full py-2 rounded-lg transition
    bg-gradient-to-r from-emerald-500 to-cyan-500
    ${
      isWriting && pendingType === "message"
        ? "opacity-60 cursor-not-allowed"
        : "hover:scale-[1.02]"
    }`}
            >
              {isWriting && pendingType === "message"
                ? "Pending..."
                : "Set Message"}
            </button>
          </div>
          {/* Backend EVENT */}
          <div className="flex gap-2 items-end mb-4">
            <div>
              <label className="text-xs text-gray-400">From Block</label>
              <input
                type="number"
                placeholder="e.g. 50507570"
                value={fromBlock}
                onChange={(e) => setFromBlock(e.target.value)}
                className="w-40 rounded bg-black/40 border border-white/20 px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">Limit</label>
              <input
                type="number"
                value={limitBlock}
                onChange={(e) => setLimitBlock(Number(e.target.value))}
                className="w-20 rounded bg-black/40 border border-white/20 px-2 py-1 text-sm"
              />
            </div>

            <button
              onClick={fetchBackendEvents}
              disabled={loadingEvents}
              className="h-8 px-4 rounded bg-blue-600 text-sm hover:bg-blue-500 disabled:opacity-50"
            >
              {loadingEvents ? "Loading..." : "Load Events"}
            </button>
          </div>
          <div className="space-y-2">
            {backendEvents.length === 0 && (
              <p className="text-sm text-gray-400">No events</p>
            )}

            {backendEvents.map((event, idx) => (
              <div
                key={idx}
                className="rounded bg-black/40 border border-white/20 p-3 text-sm"
              >
                <p>Block: {event.blockNumber}</p>
                <p>Value: {event.value}</p>
                <p className="truncate text-gray-400">Tx: {event.txHash}</p>
              </div>
            ))}
          </div>

          <div className="col-span-2 pt-6 border-t border-white/10 text-center">
            <p className="text-[11px] text-white/40">
              -------------
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}