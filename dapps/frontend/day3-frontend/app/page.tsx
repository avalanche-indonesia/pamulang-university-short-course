"use client";

import { useState, useEffect, useRef } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { avalancheFuji } from "wagmi/chains";
import { formatUnits } from "viem";

const CONTRACT_ADDRESS = "0xa22ed62bedbfb22ee46d90bfe5b3859f460b1949";
const SIMPLE_STORAGE_ABI = [
  {
    inputs: [],
    name: "getValue",
    outputs: [{ type: "uint256" }],
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
] as const;

export default function Page() {
  // Fix Hydration Error
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Snowfall effect
  const snowRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!mounted) return;
    const canvas = snowRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let snowflakes: { x: number; y: number; r: number; d: number }[] = [];
    const snowCount = Math.floor(width / 8);
    for (let i = 0; i < snowCount; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        d: Math.random() * 1 + 0.5,
      });
    }

    function drawSnow() {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "#fff";
      for (let i = 0; i < snowCount; i++) {
        let f = snowflakes[i];
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
        ctx.fill();
      }
      ctx.restore();
      updateSnow();
    }

    function updateSnow() {
      for (let i = 0; i < snowCount; i++) {
        let f = snowflakes[i];
        f.y += f.d;
        if (f.y > height) {
          f.x = Math.random() * width;
          f.y = -5;
        }
      }
    }

    let animationId: number;
    function animate() {
      drawSnow();
      animationId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [mounted]);

  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // Lifecycle
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: balance } = useBalance({ address });
  const {
    data: value,
    refetch,
    isLoading: isReading,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: "getValue",
  });

  const {
    data: hash,
    writeContract,
    isPending: isConfirming,
    error: writeError,
  } = useWriteContract();
  const { isLoading: isPendingBlock, isSuccess: isTxSuccess } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isTxSuccess) {
      refetch();
      setInputValue("");
    }
  }, [isTxSuccess, refetch]);

  // Helpers
  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const displayBalance = () => {
    if (!balance) return "0.000";
    return formatUnits(balance.value, balance.decimals).slice(0, 6);
  };

  // Prevent rendering dynamic wallet content until mounted to fix Hydration Issue
  if (!mounted) return null;

  return (
    <main className="relative h-screen w-full bg-[#050505] text-white flex items-center justify-center p-4 overflow-hidden">
      {/* --- SNOWFALL BACKGROUND --- */}
      <canvas
        ref={snowRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{ display: "block" }}
      />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-[480px] bg-white/[0.02] backdrop-blur-[30px] border border-white/10 p-8 rounded-[30px] shadow-2xl">
        {/* Header Section */}
        <header className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(232,65,66,0.2)]">
            <span className="text-2xl animate-[spin_12s_linear_infinite]">
              ❄️
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-black tracking-tight leading-none italic uppercase">
              MINCHI PORTAL
            </h1>
            <p className="text-[9px] text-zinc-500 font-bold tracking-[0.2em] mt-1.5 uppercase">
              
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-[9px] font-black border transition-colors ${
              isConnected
                ? "bg-green-500/10 border-green-500/20 text-green-500"
                : "bg-zinc-500/10 border-zinc-500/20 text-zinc-500"
            }`}
          >
            {isConnected ? "● CONNECTED" : "○ DISCONNECTED"}
          </div>
        </header>

        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className="w-full py-4 bg-[#e84142] hover:bg-[#ff4d4d] rounded-xl font-black text-sm tracking-widest transition-all hover:scale-[1.01] active:scale-95"
          >
            {isConnecting ? "NOT CONNECTED..." : "CONNECT WALLET"}
          </button>
        ) : (
          <div className="space-y-4">
            {/* Info Grid (3 Columns) */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">
                  Wallet
                </p>
                <p className="text-[11px] font-mono font-bold">
                  {shortenAddress(address!)}
                </p>
              </div>
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">
                  Network
                </p>
                <p
                  className={`text-[10px] font-bold ${
                    chainId === avalancheFuji.id
                      ? "text-red-400"
                      : "text-zinc-400"
                  }`}
                >
                  {chainId === avalancheFuji.id ? "FUJI TEST" : "WRONG NET"}
                </p>
              </div>
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">
                  Balance
                </p>
                <p className="text-[11px] font-bold">
                  {displayBalance()}{" "}
                  <span className="text-red-500 text-[9px]">AVAX</span>
                </p>
              </div>
            </div>

            {/* Contract Interaction Area */}
            <div className="bg-gradient-to-br from-white/[0.04] to-transparent p-5 rounded-2xl border border-white/10 shadow-inner">
              <div className="flex justify-between items-end mb-4 px-1">
                <div>
                  <label className="text-[9px] text-zinc-500 font-black uppercase tracking-widest block mb-1">
                    Stored Value
                  </label>
                  <p className="text-4xl font-black text-white tracking-tighter leading-none">
                    {isReading ? "..." : value?.toString() || "0"}
                  </p>
                </div>
                <button
                  onClick={() => refetch()}
                  className="text-[9px] font-bold text-zinc-500 hover:text-white transition-colors"
                >
                  REFRESH ↻
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="New value..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-[1.5] bg-black/60 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-red-500 text-sm font-bold transition-all"
                />
                <button
                  onClick={() =>
                    writeContract({
                      address: CONTRACT_ADDRESS,
                      abi: SIMPLE_STORAGE_ABI,
                      functionName: "setValue",
                      args: [BigInt(inputValue)],
                    })
                  }
                  disabled={isConfirming || isPendingBlock || !inputValue}
                  className="flex-1 bg-white text-black hover:bg-zinc-200 rounded-xl font-black text-[10px] transition-all disabled:opacity-20 uppercase"
                >
                  {isPendingBlock ? "..." : "Update"}
                </button>
              </div>
            </div>

            {/* System Controls */}
            <div className="flex justify-between items-center px-1">
              <button
                onClick={() => disconnect()}
                className="text-[9px] font-black text-zinc-600 hover:text-red-500 transition-colors uppercase tracking-widest"
              >
                [ Terminate Session ]
              </button>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[9px] font-bold text-green-500/60 uppercase">
                  System Ready
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Notifications (Overlaid-style) */}
        {(writeError || isTxSuccess) && (
          <div
            className={`mt-4 p-3 rounded-xl text-[10px] font-bold border flex items-center justify-between animate-in fade-in zoom-in duration-300 ${
              writeError
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-green-500/10 border-green-500/20 text-green-400"
            }`}
          >
            <span>
              {writeError
                ? "TRANSACTION FAILED / REJECTED"
                : "BLOCK CONFIRMED ON FUJI"}
            </span>
            <button
              onClick={() => window.location.reload()}
              className="opacity-50 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Branding Footer */}
        <footer className="mt-8 pt-5 border-t border-white/5 flex flex-col items-center justify-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-tight text-center">
            Mikael Immanuel Christianto
          </p>
          <p className="text-[8px] font-mono mt-0.5 text-center">
            221011450517
          </p>
        </footer>
      </div>
    </main>
  );
}
