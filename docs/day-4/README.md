# 📘 Day 4 – Backend API dengan NestJS (Avalanche)

---

## Pre-Test (10 menit)

[Link](https://forms.gle/VCpseqP1Zx2V2T9U6)

---

> Avalanche Indonesia Short Course – **Day 4**

Hari keempat difokuskan pada **Backend Layer** dalam arsitektur dApp.
Peserta akan mempelajari bagaimana **NestJS** digunakan untuk **meningkatkan UX**, melakukan **off-chain processing**, serta **membaca data blockchain secara efisien** menggunakan **viem**.

📌 Backend **tidak menggantikan smart contract**
📌 Backend **bukan source of truth**
📌 Smart contract **tetap pusat kebenaran**

---

## 🎯 Tujuan Pembelajaran

Pada akhir sesi Day 4, peserta mampu:

- Memahami **peran backend dalam arsitektur dApp**
- Memahami **mental model backend Web3**
- Menggunakan **NestJS** sebagai backend framework
- Menggunakan **viem di backend** (read-only)
- Menghubungkan backend dengan smart contract
- Mendesain **API Web2-like** di atas data blockchain
- Mengelola **event, caching, dan indexing sederhana**
- Membedakan **on-chain vs off-chain responsibility**

---

## 🧩 Studi Kasus

### Avalanche Simple Full Stack dApp – Backend Layer

Backend pada Day 4 berfungsi sebagai:

- Aggregator data blockchain
- API untuk frontend
- Layer performa & UX

📌 **Smart contract tetap source of truth**
📌 Backend hanya membaca & mengolah data

---

## ⏱️ Struktur Sesi (± 3 Jam)

| Sesi                | Durasi   | Aktivitas                      |
| ------------------- | -------- | ------------------------------ |
| Pre-test            | 10 menit |                                |
| Theory              | 50 menit | Backend Web3 & Architecture    |
| Demo                | 1 Jam    | NestJS + viem + Smart Contract |
| Penjelasan Homework | 40 menit | API Blockchain Mandiri         |
| Post-test           | 20 menit |                                |

---

# 1️⃣ Theory (50 menit)

## 1.1 Kenapa dApp Butuh Backend?

Walaupun dApp bersifat terdesentralisasi, backend tetap dibutuhkan untuk:

- UX lebih cepat
- Query data kompleks
- Aggregation & formatting
- Caching data blockchain
- Integrasi dengan sistem Web2

📌 **Backend = UX enabler, bukan authority**

---

## 1.2 Mental Model Backend Web3 (WAJIB)

```text
Blockchain (Source of Truth)
   ↑ read
Backend (NestJS + viem)
   ↑ API
Frontend (Next.js)
   ↑ UI
User
```

❌ Backend **tidak mengirim transaksi user**
❌ Backend **tidak menyimpan private key user**

---

### 🔑 Golden Rule Backend Web3

Jika backend mati:

- Smart contract **harus tetap bisa digunakan**
- User **masih bisa berinteraksi via block explorer**

---

## 1.3 Backend Web2 vs Web3

| Backend Web2        | Backend Web3              |
| ------------------- | ------------------------- |
| Owns data           | Reads blockchain data     |
| Mutable database    | Immutable blockchain      |
| Server signs action | User signs transaction    |
| Auth via session    | Auth via wallet signature |

---

## 1.4 On-chain vs Off-chain Responsibility

| On-chain (Smart Contract) | Off-chain (Backend)    |
| ------------------------- | ---------------------- |
| Logic bisnis inti         | Query & aggregation    |
| State kritikal            | Caching                |
| Validasi keamanan         | Formatting data        |
| Trustless                 | Trusted infrastructure |

📌 **Jangan memindahkan logic penting ke backend.**

---

## 1.5 Backend Web3 Anti-Pattern

❌ Menyimpan private key user
❌ Menjalankan transaksi atas nama user
❌ Mengubah data blockchain
❌ Menjadi single source of truth

📌 Catatan:
Backend _boleh_ mengirim transaksi **hanya untuk automation system**
(cron / keeper / bot) dan **tidak menggantikan user intent**
_(tidak dibahas di short course ini)_

---

## 1.6 Kenapa NestJS?

NestJS dipilih karena:

- Struktur modular & scalable
- TypeScript-first
- Cocok untuk backend production
- Familiar untuk developer Web2

---

## 1.7 Web3 Library di Backend: viem

🔗 [https://viem.sh/](https://viem.sh/)

**viem** digunakan di backend untuk:

- Membuat **public client**
- Read smart contract (call)
- Fetch event & block data
- Query blockchain secara efisien

📌 Di backend **hanya gunakan read operation**

---

# 2️⃣ Demo (1 Jam)

## 2.1 Setup Backend Project

```bash
cd dapps/backend
```

```bash
npm i -g @nestjs/cli
```

```bash
nest new backend
```

```bash
npm run start:dev
```

Akses API:

```text
http://localhost:3000
```

---

## 2.2 Struktur Backend

```text
dapps/backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   └── blockchain/
│       ├── blockchain.module.ts
│       ├── blockchain.service.ts
│       ├── blockchain.controller.ts
│       └── simple-storage.abi.ts
```

---

## 2.3 Setup viem Public Client

```bash
npm install viem
```

Backend akan:

- Terhubung ke Avalanche Fuji RPC
- Membuat `publicClient`
- Digunakan oleh service

📌 Tidak memerlukan wallet atau private key.

---

## 2.4 Load Smart Contract

Menggunakan data dari Day 2:

- Contract address
- ABI JSON

Backend akan:

- Load ABI
- Konfigurasi contract
- Siap melakukan read-only call

---

## 2.5 API: Read Contract State

Contoh endpoint:

```http
GET /blockchain/value
```

Contoh response:

```json
{
  "value": 42,
  "blockNumber": 123456,
  "updatedAt": "2026-01-10T08:00:00Z"
}
```

📌 Frontend tidak perlu call blockchain langsung.

---

## 2.6 API: Fetch Event History

Demo:

- Fetch event `ValueUpdated`
- Gunakan block range
- Return list event untuk activity log UI

📌 Best practice:

- Jangan fetch dari block 0 setiap request
- Gunakan pagination / block range

---

Buat `src/blockchain/blockchain.service.ts`

```ts
import { Injectable } from "@nestjs/common";
import { createPublicClient, http } from "viem";
import { avalancheFuji } from "viem/chains";
import { SIMPLE_STORAGE_ABI } from "./simple-storage.abi";

@Injectable()
export class BlockchainService {
  private client;
  private contractAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http("https://api.avax-test.network/ext/bc/C/rpc"),
    });

    // GANTI dengan address hasil deploy Day 2
    this.contractAddress = "0xYOUR_CONTRACT_ADDRESS";
  }

  // 🔹 Read latest value
  async getLatestValue() {
    const value = await this.client.readContract({
      address: this.contractAddress,
      abi: SIMPLE_STORAGE_ABI,
      functionName: "getValue",
    });

    return {
      value: value.toString(),
    };
  }

  // 🔹 Read ValueUpdated events
  async getValueUpdatedEvents() {
    const events = await this.client.getLogs({
      address: this.contractAddress,
      event: {
        type: "event",
        name: "ValueUpdated",
        inputs: [
          {
            name: "newValue",
            type: "uint256",
            indexed: false,
          },
        ],
      },
      fromBlock: 0n, // speaker demo (jelaskan ini anti-pattern)
      toBlock: "latest",
    });

    return events.map((event) => ({
      blockNumber: event.blockNumber?.toString(),
      value: event.args.newValue.toString(),
      txHash: event.transactionHash,
    }));
  }
}
```

Buat `src/blockchain/blockchain.controller.ts`

```ts
import { Controller, Get } from "@nestjs/common";
import { BlockchainService } from "./blockchain.service";

@Controller("blockchain")
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  // GET /blockchain/value
  @Get("value")
  async getValue() {
    return this.blockchainService.getLatestValue();
  }

  // GET /blockchain/events
  @Get("events")
  async getEvents() {
    return this.blockchainService.getValueUpdatedEvents();
  }
}
```

---

## 2.7 Error Handling & RPC Failure

Dibahas:

- RPC timeout
- Network error
- Graceful fallback & error response

---

Code with RPC error handling

```ts
import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { createPublicClient, http } from "viem";
import { avalancheFuji } from "viem/chains";
import { SIMPLE_STORAGE_ABI } from "./simple-storage.abi";

@Injectable()
export class BlockchainService {
  private client;
  private contractAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http("https://api.avax-test.network/ext/bc/C/rpc", {
        timeout: 10_000, // 10 detik timeout
      }),
    });

    this.contractAddress = "0xYOUR_CONTRACT_ADDRESS";
  }

  // 🔹 Read latest value
  async getLatestValue() {
    try {
      const value = await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: "getValue",
      });

      return {
        value: value.toString(),
      };
    } catch (error: any) {
      this.handleRpcError(error);
    }
  }

  // 🔹 Read events
  async getValueUpdatedEvents() {
    try {
      const events = await this.client.getLogs({
        address: this.contractAddress,
        event: {
          type: "event",
          name: "ValueUpdated",
          inputs: [{ name: "newValue", type: "uint256", indexed: false }],
        },
        fromBlock: 0n,
        toBlock: "latest",
      });

      return events.map((event) => ({
        blockNumber: event.blockNumber?.toString(),
        value: event.args.newValue.toString(),
        txHash: event.transactionHash,
      }));
    } catch (error: any) {
      this.handleRpcError(error);
    }
  }

  // 🔹 Centralized RPC Error Handler
  private handleRpcError(error: any): never {
    const message = error?.message?.toLowerCase() || "";

    if (message.includes("timeout")) {
      throw new ServiceUnavailableException(
        "RPC timeout. Silakan coba beberapa saat lagi."
      );
    }

    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("failed")
    ) {
      throw new ServiceUnavailableException(
        "Tidak dapat terhubung ke blockchain RPC."
      );
    }

    throw new InternalServerErrorException(
      "Terjadi kesalahan saat membaca data blockchain."
    );
  }
}
```

Contoh Response Error ke Frontend
RPC Timeout

```text
{
  "statusCode": 503,
  "message": "RPC timeout. Silakan coba beberapa saat lagi.",
  "error": "Service Unavailable"
}
```

Network Error

```text
{
  "statusCode": 503,
  "message": "Tidak dapat terhubung ke blockchain RPC.",
  "error": "Service Unavailable"
}
```

Unknown Error

```text
{
  "statusCode": 500,
  "message": "Terjadi kesalahan saat membaca data blockchain.",
  "error": "Internal Server Error"
}
```

---

# 3️⃣ Penjelasan Homework (40 menit)

## 🎯 Objective

Membangun **backend API sederhana yang membaca data blockchain**.

---

### 🟢 Task 1 – Setup Blockchain Module (Wajib)

- Buat module `blockchain`
- Setup viem public client
- Konfigurasi Avalanche Fuji RPC

---

### 🟢 Task 2 – Read Smart Contract (Wajib)

- Buat endpoint `getValue()`
- Return JSON response

---

### 🟢 Task 3 – Event Query (Wajib)

- Endpoint event `ValueUpdated`
- Return blockNumber & value

---

### 🟡 Task 4 – API Design (Opsional)

- Pagination sederhana
- Response format konsisten
- Error handling rapi

---

### 🔵 Task 5 – Integration Test (Opsional)

- Test API via browser / Postman
- Pastikan response sesuai

---

## 🧪 Checklist

- [ ] Backend NestJS berjalan
- [ ] viem terhubung ke Fuji RPC
- [ ] API bisa read contract
- [ ] Event bisa di-fetch
- [ ] Frontend bisa consume API

[Submission Link](https://forms.gle/svzhUB5rCbV5kEAJ8) aktif selama 48 jam, deadline tanggal 17 Januari 2026, pukul 23.59 WIB

---

## ✅ Output Day 4

Pada akhir Day 4, peserta:

- Memiliki backend API aktif
- Bisa membaca data blockchain via REST API
- Memahami:

  - Backend Web3 ≠ Backend Web2
  - On-chain vs off-chain responsibility
  - Peran backend dalam UX dApp
  - viem sebagai bridge ke blockchain

---

## 🚀 Preview Day 5

Di Day 5, kita akan:

- Integrasi frontend + backend + smart contract
- Deployment (Frontend, Backend, Contract)
- Environment & config production
- Best practice full stack dApp
- Final demo: **Full Stack Web3 dApp Live**

---

## 📚 Referensi

- viem: [https://viem.sh/](https://viem.sh/)
- NestJS Docs: [https://docs.nestjs.com/](https://docs.nestjs.com/)
- Avalanche Academy: [https://build.avax.network/academy](https://build.avax.network/academy)

---

## Post-Test

[Link](https://forms.gle/QzdxSdgY8wo577yT8)

---

## Feedback

[Link](https://forms.gle/DquHzmWuVEmA5K5t7)

---

🔥 **Backend siap.**
Besok kita satukan semuanya menjadi **Full Stack Web3 dApp** 🚀
