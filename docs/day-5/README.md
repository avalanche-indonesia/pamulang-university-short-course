# 📘 Day 5 – Integrasi & Deployment Full Stack dApp (Avalanche)

---

## Quiz Day 5

[Link](https://forms.gle/AGrJTdxQCLCxjuUn7)

---

> Avalanche Indonesia Short Course – **Day 5**

Hari kelima merupakan **puncak dari short course ini**.
Peserta akan **mengintegrasikan seluruh layer** yang telah dibangun dari Day 1 hingga Day 4, lalu melakukan **deployment** sehingga dApp dapat diakses secara publik dan berjalan **end-to-end**.

### 🧠 Prinsip Arsitektur

- **Smart Contract** → Source of Truth (on-chain state & logic)
- **Backend** → UX layer, API, aggregation (read-only)
- **Frontend** → User interaction & wallet connection

---

## 🎯 Tujuan Pembelajaran

Pada akhir sesi Day 5, peserta mampu:

- Memahami **arsitektur full stack dApp secara end-to-end**
- Mengintegrasikan:

  - Smart Contract (Day 2)
  - Frontend dApp (Day 3)
  - Backend API (Day 4)

- Mengelola **environment & konfigurasi production**
- Melakukan **deployment smart contract, backend, dan frontend**
- Memahami **best practice deployment Web3**
- Melakukan **final demo full stack dApp**

---

## 🧩 Studi Kasus

### Avalanche Simple Full Stack dApp – Final Integration

Arsitektur final:

```text
User
 ↓
Frontend (Next.js / HTML)
 ↓ REST API
Backend (NestJS + viem)
 ↓ read
Blockchain (Avalanche Fuji / Mainnet)
```

📌 User **tetap menandatangani transaksi via wallet**
📌 Backend **tidak menyimpan private key** dan **tidak mengirim transaksi**
📌 Smart contract tetap menjadi **pusat kebenaran**

---

## ⏱️ Struktur Sesi (± 3 Jam)

| Sesi    | Durasi | Aktivitas                                 |
| ------- | ------ | ----------------------------------------- |
| Theory  | 1 Jam  | Arsitektur & Deployment Strategy          |
| Demo    | 1 Jam  | Integrasi Layer + Deployment Step-by-Step |
| Praktik | 1 Jam  | Deploy & Finalisasi Full Stack dApp       |

---

# 1️⃣ Theory (± 1 Jam)

## 1.1 Review Arsitektur Full Stack dApp

| Layer          | Teknologi                | Tanggung Jawab                   |
| -------------- | ------------------------ | -------------------------------- |
| Smart Contract | Solidity, Hardhat        | Logic & state on-chain           |
| Frontend       | Next.js / HTML + JS      | UI & wallet interaction          |
| Backend        | NestJS, viem             | API, aggregation, UX improvement |
| Blockchain     | Avalanche Fuji / Mainnet | Source of truth                  |

📌 Setiap layer **terpisah**, tetapi **saling terhubung**.

---

## 1.2 Flow Interaksi User

### Read Flow

```text
Frontend → Backend API → Blockchain
```

- Frontend **tidak langsung ke RPC**
- Backend membaca data blockchain secara efisien

---

### Write Flow (Transaction)

```text
Frontend → Wallet (Core) → Blockchain
```

- User tetap signer
- Backend **tidak berada di jalur transaksi**

---

## 1.3 Environment & Configuration

### Kenapa Environment Penting?

- Local, testnet, dan mainnet memiliki:

  - RPC berbeda
  - Contract address berbeda
  - API endpoint berbeda

📌 **Konfigurasi tidak boleh di-hardcode**

---

### Contoh Environment Variable

#### Frontend (`.env`)

```env
NEXT_PUBLIC_BACKEND_URL=https://api.example.com
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

#### Backend (`.env`)

```env
RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CONTRACT_ADDRESS=0x...
```

---

## 1.4 Deployment Strategy (Overview)

| Layer          | Contoh Platform (Opsional) |
| -------------- | -------------------------- |
| Smart Contract | Avalanche Fuji / Mainnet   |
| Backend API    | VPS / Railway / Fly.io     |
| Frontend       | Vercel / Netlify           |

📌 Fokus utama: **konsep deployment**, bukan platform.

---

## 1.5 Production Best Practice

### Smart Contract

- Contract address bersifat **immutable**
- Jangan redeploy tanpa alasan
- Simpan ABI & address dengan rapi

---

### Backend

- Read-only blockchain access
- Handle RPC error & timeout
- Rate limit & caching (konseptual)

---

### Frontend

- Handle loading & error state
- Jangan expose private key
- Validasi network (Fuji vs Mainnet)

---

# 2️⃣ Demo (± 1 Jam)

## 2.1 Integrasi Frontend ↔ Backend

Frontend **tidak berinteraksi langsung dengan blockchain**, melainkan melalui **Backend API**.

### 🔹 Endpoint Backend yang Digunakan

```text
GET /blockchain/value
GET /blockchain/events
```

📌 Frontend **tidak perlu mengetahui RPC endpoint**
📌 Semua logic blockchain berada di backend (NestJS)

---

### 1️⃣ Setup Environment Variable

Buat file **`.env.local`** di root project frontend:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

> ⚠️ Gunakan `NEXT_PUBLIC_` agar bisa diakses di browser

---

### 2️⃣ Buat Service Fetch ke Backend

Karena menggunakan **Next.js App Router**, buat folder:

```text
src/
 └── services/
     └── blockchain.service.ts
```

#### `blockchain.service.ts`

```ts
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

/**
 * Get latest blockchain value
 */
export async function getBlockchainValue() {
  const res = await fetch(`${BACKEND_URL}/blockchain/value`, {
    method: "GET",
    cache: "no-store", // selalu ambil data terbaru
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blockchain value");
  }

  return res.json();
}

/**
 * Get blockchain events
 */
export async function getBlockchainEvents() {
  const res = await fetch(`${BACKEND_URL}/blockchain/events`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blockchain events");
  }

  return res.json();
}
```

---

### 3️⃣ Gunakan Service di Page (Server Component)

Contoh penggunaan di **App Router page**:

```text
src/app/page.tsx
```

#### `page.tsx`

```tsx
import {
  getBlockchainValue,
  getBlockchainEvents,
} from "@/services/blockchain.service";

export default async function HomePage() {
  const value = await getBlockchainValue();
  const events = await getBlockchainEvents();

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Blockchain Data</h1>

      <section>
        <h2 className="font-semibold">Latest Value</h2>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </section>

      <section>
        <h2 className="font-semibold">Events</h2>
        <pre>{JSON.stringify(events, null, 2)}</pre>
      </section>
    </main>
  );
}
```

📌 Karena ini **Server Component**, `fetch()` aman dan optimal
📌 Tidak expose RPC / private logic ke client

---

### 4️⃣ (Opsional) Gunakan di Client Component

Jika ingin dipakai di Client Component:

```tsx
"use client";

import { useEffect, useState } from "react";
import { getBlockchainValue } from "@/services/blockchain.service";

export default function BlockchainValue() {
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    getBlockchainValue().then(setValue).catch(console.error);
  }, []);

  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}
```

---

### 5️⃣ Arsitektur Akhir

```text
[ Next.js Frontend ]
        |
        |  HTTP REST API
        v
[ NestJS Backend ]
        |
        |  viem
        v
[ Blockchain RPC ]
```

✔ Frontend clean
✔ RPC & contract detail aman
✔ Mudah ganti chain / provider

---

## 2.2 Integrasi Frontend ↔ Smart Contract

Frontend tetap bertanggung jawab untuk:

- Connect wallet (Core Wallet)
- Mengirim transaksi ke smart contract
- Menunggu confirmation dari blockchain

📌 Backend **tidak terlibat dalam write**

Ini masih sama dengan day 3

---

## 2.3 Deploy Smart Contract

Boleh menggunakan smart contract yang sudah terdeploy di day 2 atau dapat deploy ulang seperti langkah di Day 2 menggunakan hardhat

```bash
npx hardhat run scripts/deploy.ts --network fuji
```

Output:

- Contract address
- Update konfigurasi frontend & backend

---

## 2.4 Deploy Backend (NestJS)

### 0️⃣ Prasyarat

Pastikan kamu sudah punya:

- ✅ Akun **GitHub**
- ✅ Akun **Railway** → [https://railway.app](https://railway.app)
- ✅ Project **sudah ada di GitHub repo**
- ✅ Project **bisa dijalankan secara lokal**

---

### 1️⃣ Persiapkan Project di Lokal

#### 1. Pastikan ada `package.json`

Railway mendeteksi aplikasi dari sini.

Contoh script **WAJIB**:

```json
{
  "scripts": {
    "start": "node dist/main.js",
    "build": "npm run build"
  }
}
```

Untuk **NestJS**, biasanya:

```json
{
  "scripts": {
    "build": "nest build",
    "start": "node dist/main.js",
    "start:prod": "node dist/main.js"
  }
}
```

> Railway otomatis pakai `npm install` → `npm run build` → `npm start`

---

#### 2. Gunakan `process.env.PORT`

🚨 **WAJIB** — Railway menentukan port sendiri.

Contoh:

```ts
const port = process.env.PORT || 3000;
app.listen(port);
```

❌ Jangan hardcode:

```ts
app.listen(3000);
```

---

#### 3. Push ke GitHub

```bash
git add .
git commit -m "ready for railway deploy"
git push origin main
```

---

### 2️⃣ Login Railway & Connect GitHub

1. Buka 👉 [https://railway.app](https://railway.app)
2. Klik **Login**
3. Pilih **Continue with GitHub**
4. Authorize Railway ke GitHub (sekali saja)

---

### 3️⃣ Create Project dari GitHub Repo

1. Klik **New Project**
2. Pilih **Deploy from GitHub repo**
3. Pilih:

   - **Repository**
   - **Branch** (biasanya `main`)

4. Klik **Deploy**

⏳ Railway akan otomatis:

- Clone repo
- Install dependencies
- Build project
- Jalankan app

---

### 4️⃣ Setting Environment Variables (ENV)

Jika aplikasi butuh `.env`:

1. Masuk ke **Project**
2. Klik **Variables**
3. Tambahkan satu per satu:

Contoh:

```
DATABASE_URL=postgres://...
JWT_SECRET=supersecret
RPC_URL=https://...
```

📌 **Jangan upload file `.env` ke GitHub**

---

### 5️⃣ (Opsional Jika Diperlukan Saja) Tambah Database

Railway punya database built-in.

#### Tambah PostgreSQL

1. Klik **New**
2. Pilih **Database → PostgreSQL**
3. Railway otomatis generate:

   - `DATABASE_URL`
   - `PGHOST`, `PGUSER`, dll

Gunakan di backend:

```ts
process.env.DATABASE_URL;
```

---

### 6️⃣ Redeploy (Jika Perlu)

Setiap:

- `git push`
- atau perubahan ENV

Railway akan **auto redeploy** 🎉

Manual redeploy:

- Klik **Deployments**
- Klik **Redeploy**

---

### 7️⃣ Akses URL Production

1. Masuk ke **Settings**
2. Buka **Domains**
3. Gunakan:

   ```
   https://<project-name>.up.railway.app
   ```

Atau custom domain jika mau.

---

### 8️⃣ Cek Logs (PENTING)

Kalau error:

1. Buka **Deployments**
2. Klik deployment terbaru
3. Lihat **Logs**

Biasanya error:

- `PORT not defined`
- `Cannot find module dist/main.js`
- ENV belum diset

---

### 9️⃣ Struktur Ideal Project (Backend)

```
project/
├─ src/
├─ dist/
├─ package.json
├─ tsconfig.json
├─ .gitignore
```

Pastikan:

- `dist/` dihasilkan oleh build
- `start` pakai file di `dist`

---

### 1️⃣0️⃣ Checklist Cepat (Anti Gagal)

✅ `process.env.PORT`
✅ `npm start` jalan
✅ `npm run build` jalan
✅ ENV di Railway sudah diisi
✅ Repo public / authorized

---

### 🔐 Catatan Penting

- API dapat diakses publik (railway akan generate link backend cek di step 7 dan masukan ini ke form submission)
- RPC & contract address benar

---

## 2.5 Deploy Frontend

### 🧩 Prasyarat

Sebelum mulai, pastikan kamu sudah punya:

- ✅ Akun **GitHub**
- ✅ Project **Next.js** sudah jalan di lokal
- ✅ Source code **sudah di-push ke GitHub**
- ✅ Backend sudah live (contoh: **Railway**)
- ✅ URL backend, misalnya:

  ```
  https://your-backend-production.up.railway.app
  ```

---

### 1️⃣ Push Project Next.js ke GitHub

Jika belum:

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/username/nama-repo.git
git push -u origin main
```

Pastikan repo **public** atau **private (boleh)**.

---

### 2️⃣ Daftar / Login ke Vercel

1. Buka 👉 [https://vercel.com](https://vercel.com)
2. Klik **Sign Up** atau **Log In**
3. Pilih **Continue with GitHub**
4. Authorize Vercel untuk mengakses GitHub kamu

✅ Setelah ini kamu masuk ke **Vercel Dashboard**

---

### 3️⃣ Import Project dari GitHub

1. Di Dashboard Vercel, klik **Add New → Project**
2. Pilih repository Next.js kamu
3. Klik **Import**

Vercel akan otomatis mendeteksi:

- Framework: **Next.js**
- Build command & output → **auto**

---

### 4️⃣ Setup Environment Variable (Backend URL)

Ini langkah **PENTING** 🔥

#### 📌 Penamaan ENV (Best Practice)

Karena Next.js frontend butuh akses dari browser:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-production.up.railway.app
```

> ⚠️ **WAJIB `NEXT_PUBLIC_`** agar bisa diakses di client-side

---

#### Cara Menambahkan ENV di Vercel

1. Di halaman **Configure Project**
2. Scroll ke **Environment Variables**
3. Isi:

   - **Key**: `NEXT_PUBLIC_BACKEND_URL`
   - **Value**: `https://your-backend-production.up.railway.app`
   - **Environment**: `Production` (boleh centang Preview juga)

4. Klik **Add**

---

### 5️⃣ Pastikan Kode Frontend Pakai ENV

Contoh pemakaian di Next.js:

```ts
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const res = await fetch(`${BACKEND_URL}/api/health`);
```

📌 Jangan hardcode URL backend di source code!

---

### 6️⃣ Deploy ke Vercel 🚀

1. Klik **Deploy**
2. Tunggu proses:

   - Install dependencies
   - Build Next.js
   - Upload ke edge/CDN

⏱️ Biasanya 1–2 menit

---

### 7️⃣ Akses URL Production

Setelah sukses, kamu dapat:

```
https://nama-project.vercel.app
```

Coba:

- Buka website
- Test request ke backend
- Cek console browser (tidak ada error CORS / ENV)

---

### 8️⃣ Auto Deploy (Bonus 🎉)

Setelah setup:

- ✅ Setiap `git push` ke `main`
- ✅ Vercel otomatis **rebuild & redeploy**
- ❌ Tidak perlu deploy manual lagi

---

### 9️⃣ Update ENV Setelah Deploy (Jika Perlu)

Kalau backend URL berubah:

1. Project → **Settings**
2. **Environment Variables**
3. Edit value
4. Klik **Save**
5. **Redeploy** (important!)

---

### 🔐 Catatan Penting

- ❌ Jangan taruh API key rahasia di `NEXT_PUBLIC_*`
- ✅ Gunakan `NEXT_PUBLIC_` hanya untuk data yang aman di frontend
- 🔁 Backend private key tetap di **Railway / backend server**
- Aplikasi dapat diakses publik (vercel akan generate link backend cek di step 7 dan masukan ini ke form submission)

---

## 2.6 Final Demo (Live)

Final demo mencakup:

- User membuka frontend
- Connect wallet
- Read data (via backend)
- Update data (via transaction)
- Backend menampilkan data terbaru

🔥 **Full stack dApp berjalan end-to-end**

---

# 3️⃣ Praktik / Homework (± 1 Jam)

## 🎯 Objective

Menyelesaikan **integrasi & deployment full stack dApp**.

---

### 🟢 Task 1 – Integrasi Frontend & Backend (Wajib)

- Frontend consume API backend
- Data blockchain tampil di UI

---

### 🟢 Task 2 – Integrasi Transaction (Wajib)

- User update state via wallet
- State berubah di blockchain
- Data terbaru terbaca kembali

---

### 🟢 Task 3 – Environment Config (Wajib)

- Pisahkan config local & production
- Gunakan `.env`

---

### 🟡 Task 4 – Deployment (Opsional)

- Deploy backend
- Deploy frontend
- Gunakan Fuji Testnet

---

### 🔵 Task 5 – Final Polish (Opsional)

- Loading state
- Error handling
- UI improvement sederhana

---

## 🧪 Checklist Akhir

- [ ] Smart contract terdeploy
- [ ] Backend API live
- [ ] Frontend dapat diakses
- [ ] Wallet connect berhasil
- [ ] Read & write blockchain sukses
- [ ] Full flow berjalan end-to-end

[Submission Link](https://forms.gle/1MxgvJkQkzB5qmsAA) aktif selama 72 jam, deadline Senin, 19 Januari 2026, pukul 23.59 WIB

---

## ✅ Output Akhir Short Course

Setelah menyelesaikan Day 5, peserta:

- Memiliki **Full Stack Web3 dApp**
- Memahami:

  - Arsitektur dApp secara utuh
  - On-chain vs off-chain responsibility
  - Integrasi frontend, backend, dan blockchain
  - Deployment Web3 secara praktis

- Siap melanjutkan ke topik lanjutan:

  - Scaling
  - Indexing
  - Production-grade Web3 app

---

## 🎓 Penutup

🎉 **Selamat!**

Kamu telah menyelesaikan:

- Blockchain Fundamentals
- Smart Contract Development
- Frontend Web3
- Backend Web3
- Full Stack Integration & Deployment

🚀 **You are officially Full Stack Web3 Ready (Fundamental Level)**

---

## 📚 Referensi

- Avalanche Docs – [https://docs.avax.network](https://docs.avax.network)
- Hardhat – [https://hardhat.org](https://hardhat.org)
- viem – [https://viem.sh](https://viem.sh)
- NestJS – [https://docs.nestjs.com](https://docs.nestjs.com)
- Core Wallet – [https://core.app](https://core.app)

---

## Feedback

[Link](https://forms.gle/gLEivpAMX1z9tsPq8)

---

🔥 **Course selesai.**
Sekarang saatnya kamu **build, ship, dan iterate dApp Web3-mu sendiri** 🚀
