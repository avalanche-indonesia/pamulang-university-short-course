# 📘 Day 3 – Frontend dApp dengan Next.js (Avalanche)

---

## Pre-Test (10 menit)

[Link](https://forms.gle/Jjt5ZtVrjT5WNnfA6)

---

> Avalanche Indonesia Short Course – **Day 3**

Hari ketiga difokuskan pada **Frontend Layer**: bagaimana **Next.js** berinteraksi dengan **wallet** dan **smart contract** yang sudah dideploy pada Day 2.

Frontend bertugas sebagai **UI & UX layer**, bukan tempat logic bisnis.

---

## 🎯 Tujuan Pembelajaran

Pada akhir sesi Day 3, peserta mampu:

- Memahami peran frontend dalam arsitektur dApp
- Memahami **mental model frontend Web3**
- Menggunakan **Next.js (App Router)** untuk dApp
- Menghubungkan frontend dengan wallet menggunakan **Reown**
- Memahami alternatif wallet framework (**Thirdweb**)
- Load **ABI & contract address**
- Melakukan **read (call)** ke smart contract
- Melakukan **write (transaction)** via wallet
- Menangani state transaksi (loading, success, error)

---

## 🧩 Studi Kasus

### Avalanche Simple Full Stack dApp – Frontend Layer

Frontend pada Day 3 berfungsi sebagai:

- UI interaksi user
- Penghubung wallet ↔ smart contract
- State management UX transaksi

📌 **Frontend tidak menyimpan logic bisnis**
📌 **Frontend tidak menyimpan state penting**

Smart contract tetap menjadi **single source of truth**.

---

## ⏱️ Struktur Sesi (± 3 Jam)

| Sesi                | Durasi   | Aktivitas                        |
| ------------------- | -------- | -------------------------------- |
| Pre-test            | 10 menit |                                  |
| Theory              | 50 menit | Frontend Web3 & Wallet Framework |
| Demo                | 1 Jam    | Next.js + Reown + Smart Contract |
| Penjelasan Homework | 40 menit | Read & Write Contract Mandiri    |
| Post-test           | 20 menit |                                  |

---

# 1️⃣ Theory (50 menit)

## 1.1 Peran Frontend dalam dApp

Frontend Web3 bertugas:

- Menyediakan UI
- Memanggil **read function** (call)
- Mengirim **transaction** via wallet
- Menampilkan status transaksi

❌ Frontend **bukan backend**
❌ Frontend **bukan tempat logic bisnis**

---

## 1.2 Mental Model Frontend Web3 (WAJIB)

```text
User
  ↓ click
Frontend (Next.js)
  ↓ request
Wallet (Core / WalletConnect)
  ↓ sign
Blockchain (Avalanche C-Chain)
  ↓ result
Frontend (update UI)
```

Perbedaan utama dengan Web2:

- Tidak ada session
- Tidak ada password
- Semua aksi write = transaksi blockchain

---

## 1.3 Frontend Web2 vs Web3

| Web2 Frontend        | Web3 Frontend                  |
| -------------------- | ------------------------------ |
| Fetch ke backend API | Call / Transaction ke contract |
| Instant response     | Tunggu block confirmation      |
| Server bayar cost    | User bayar gas                 |
| Error bisa retry     | Tx gagal → gas tetap terpakai  |

---

## 1.4 Kenapa Next.js?

Next.js dipilih karena:

- React-based & production-ready
- App Router modern
- State management fleksibel
- Banyak digunakan di ekosistem Web3

📌 Day 1: plain HTML
📌 Day 3: framework frontend modern

---

## 1.5 Wallet Framework di Frontend

Mengelola wallet manual (`window.ethereum`) di Next.js:

- Repetitif
- Error-prone
- Sulit handle multi-wallet

Solusi: **Wallet Framework**

---

## 1.6 Reown (Default)

🔗 [https://reown.com/](https://reown.com/)

**Reown** adalah framework modern untuk:

- Wallet connection
- WalletConnect v2
- Multi-wallet support
- Wallet & connection state management

**Kenapa Reown?**

- Standar industri (WalletConnect ecosystem)
- Cocok untuk production
- Tidak vendor-locked
- Native support Core Wallet

➡️ **Reown adalah default wallet framework di course ini**

---

## 1.7 Thirdweb (Alternatif)

🔗 [https://thirdweb.com/](https://thirdweb.com/)

Thirdweb menyediakan:

- Wallet
- Contract SDK
- UI components
- Infra end-to-end

**Kelebihan**

- Cepat untuk prototyping
- Banyak abstraction

**Kekurangan**

- Lebih opinionated
- Lebih vendor-dependent

➡️ Digunakan sebagai **referensi**, bukan default.

---

## 1.8 Read vs Write di Frontend

| Action | Cara        | Wallet Popup |
| ------ | ----------- | ------------ |
| Read   | `call`      | ❌           |
| Write  | transaction | ✅           |

Mental model:

```text
Read:
Frontend → RPC → Blockchain → Frontend

Write:
Frontend → Wallet → User Sign → Tx Pending → Confirmed
```

---

## 1.9 Frontend Web3 – Common Pitfalls

Hal penting yang perlu diingat:

- Wallet bisa:

  - Reject transaction
  - Ganti network kapan saja

- Transaction tidak instant
- Refresh page ≠ reset blockchain state
- Tx revert → gas tetap terpakai
- Jangan blocking UI saat tx pending

---

# 2️⃣ Demo (1 Jam)

## 2.1 Setup Frontend Project

```bash
cd apps/frontend
npx create-next-app@latest ./
npm run dev
```

Akses:

```text
http://localhost:3000
```

---

## 2.2 Setup Reown Provider

Langkah umum:

- Buat WalletConnect Project ID
- Setup Reown provider
- Aktifkan Avalanche Fuji
- Bungkus Next.js app dengan provider

📌 Detail teknis dijelaskan saat demo live.

```bash

npm install wagmi viem @tanstack/react-query
npm install @walletconnect/ethereum-provider
```

create file provider.tsx

```bash
'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [avalancheFuji],
  transports: {
    [avalancheFuji.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

edit layout.tsx

```bash
import './globals.css';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## 2.3 Connect Wallet (Core Wallet)

Demo mencakup:

- Tombol **Connect Wallet**
- Connect via Core Wallet
- Ambil wallet address
- Deteksi network (Fuji)

edit page.tsx on app folder

```bash
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

```

---

## 2.4 Load Smart Contract

Data dari Day 2:

- Contract address
- ABI JSON

Frontend akan:

- Load ABI
- Membuat contract instance
- Siap melakukan read & write

📌 Library EVM: **ethers.js / viem**

---

## 2.5 Read Contract (Call)

Demo:

- Panggil `getValue()`
- Tampilkan value ke UI
- Tidak memicu wallet popup

---

## 2.6 Write Contract (Transaction)

Demo:

- Input value
- Panggil `setValue(uint256)`
- Wallet popup muncul
- Handle:

  - Loading
  - Success
  - Error / revert

---

## 2.7 Transaction UX Feedback

Ditampilkan:

- Transaction hash
- Status pending
- Status confirmed
- Error message jika gagal

---

# 3️⃣ Praktik / Homework (1 Jam)

## 🎯 Objective

Peserta mampu **menghubungkan frontend Next.js ke smart contract secara mandiri**.

---

## 3.1 Task 1 – Wallet Connection

Implementasikan:

- Connect wallet dengan Reown
- Tampilkan wallet address
- Tampilkan network status

---

## 3.2 Task 2 – Read Contract

- Load ABI & address
- Panggil `getValue()`
- Tampilkan hasil ke UI

---

## 3.3 Task 3 – Write Contract

- Input value
- Call `setValue`
- Handle loading & error

---

update final page.tsx

```bash
'use client';

import { useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseEther } from 'ethers';

// ==============================
// 🔹 CONFIG
// ==============================

// 👉 GANTI dengan contract address hasil deploy kamu day 2
const CONTRACT_ADDRESS = 'address kmu';

// 👉 ABI SIMPLE STORAGE
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

export default function Page() {
  // ==============================
  // 🔹 WALLET STATE
  // ==============================
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // ==============================
  // 🔹 LOCAL STATE
  // ==============================
  const [inputValue, setInputValue] = useState('');

  // ==============================
  // 🔹 READ CONTRACT
  // ==============================
  const {
    data: value,
    isLoading: isReading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getValue',
  });

  // ==============================
  // 🔹 WRITE CONTRACT
  // ==============================
  const {
    writeContract,
    isPending: isWriting,
  } = useWriteContract();

  const handleSetValue = async () => {
    if (!inputValue) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: SIMPLE_STORAGE_ABI,
      functionName: 'setValue',
      args: [BigInt(inputValue)],
    });
  };

  // ==============================
  // 🔹 UI
  // ==============================
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md border border-gray-700 rounded-lg p-6 space-y-6">

        <h1 className="text-xl font-bold">
          Day 3 – Frontend dApp (Avalanche)
        </h1>

        {/* ==========================
            WALLET CONNECT
        ========================== */}
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
            <p className="font-mono text-xs break-all">{address}</p>

            <button
              onClick={() => disconnect()}
              className="text-red-400 text-sm underline"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* ==========================
            READ CONTRACT
        ========================== */}
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <p className="text-sm text-gray-400">Contract Value (read)</p>

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

        {/* ==========================
            WRITE CONTRACT
        ========================== */}
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
            disabled={isWriting}
            className="w-full bg-blue-600 py-2 rounded"
          >
            {isWriting ? 'Updating...' : 'Set Value'}
          </button>
        </div>

        {/* ==========================
            FOOTNOTE
        ========================== */}
        <p className="text-xs text-gray-500 pt-2">
          Smart contract = single source of truth
        </p>

      </div>
    </main>
  );
}

```

## 3.4 Task 4 – UX Improvement (Opsional)

- Disable button saat tx pending
- Shorten wallet address
- Toast / alert status transaksi
- Refresh value setelah tx success

---

## 3.5 Task 5 – Failure Handling (Opsional)

Handle kasus:

- User reject transaction
- Wrong network
- Transaction revert

---

## 🧪 Checklist

- [ ] Next.js app berjalan
- [ ] Wallet bisa connect
- [ ] Network Fuji terdeteksi
- [ ] Read contract berhasil
- [ ] Write contract berhasil
- [ ] Tx muncul di explorer

[Submission Link](https://forms.gle/ma5m2n8eG3eDnCjX6) aktif selama 48 jam, deadline tanggal 16 Januari 2026, pukul 23.59 WIB

---

## ✅ Output Day 3

Pada akhir Day 3:

- Frontend Next.js terhubung ke wallet
- Smart contract bisa di-read & write
- Peserta memahami:

  - Frontend Web3 ≠ Web2
  - Wallet & transaction flow
  - UX transaksi blockchain
  - Contract sebagai source of truth

---

## 🚀 Preview Day 4

Di Day 4, kita akan menjawab pertanyaan:

> **“Bagaimana membuat dApp terasa cepat & Web2-like padahal pakai blockchain?”**

Fokus Day 4:

- Event listening
- Indexing & data query
- UX & state management lanjutan
- Best practice production dApp

---

## 📚 Referensi

- Reown: [https://reown.com/](https://reown.com/)
- Thirdweb: [https://thirdweb.com/](https://thirdweb.com/)
- Next.js Docs: [https://nextjs.org/docs](https://nextjs.org/docs)
- Avalanche Academy: [https://build.avax.network/academy](https://build.avax.network/academy)

---

## Post-Test

[Link](https://forms.gle/dL7JuvX4HL5cwqtMA)

---

## Feedback

[Link](https://forms.gle/mDWVh1NtDQkkwRpXA)

---

🔥 **Frontend connected.**
Saatnya naik level ke **UX & production-ready dApp** 🚀
