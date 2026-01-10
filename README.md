# 🚀 Avalanche Full Stack dApp – Short Course at Pamulang University

Short course ini dirancang untuk membantu peserta **membangun Full Stack dApp sederhana di jaringan Avalanche** dari nol hingga deployment, menggunakan **1 template project yang sama selama 5 hari**.

Course ini cocok untuk:

- Web developer yang ingin masuk ke Web3
- Blockchain beginner–intermediate
- Developer yang ingin membangun portfolio dApp nyata

---

## 🎯 Learning Objectives

Setelah menyelesaikan course ini, peserta mampu:

- Memahami fundamental blockchain & Avalanche
- Menulis dan deploy smart contract menggunakan Solidity & Hardhat
- Membangun frontend dApp dengan Next.js & Tailwind CSS
- Membangun backend API dengan NestJS
- Mengintegrasikan smart contract, frontend, dan backend
- Melakukan deployment full stack dApp

---

## 🧩 Studi Kasus

### Avalanche Simple Full Stack dApp

Fitur utama:

- Connect wallet (Core Wallet)
- Interaksi smart contract (read & write)
- Penyimpanan data transaksi off-chain
- Integrasi frontend, backend, dan blockchain

---

## 🧱 Tech Stack

### 🔗 Blockchain

- Avalanche C-Chain
- Solidity
- Hardhat
- Viem
- Wagmi

### 🎨 Frontend

- Next.js (App Router)
- Tailwind CSS
- TypeScript

### ⚙️ Backend

- NestJS
- PostgreSQL (data transaksi)
- MongoDB (event/log)

### ☁️ Deployment

- Avalanche Fuji Testnet
- Vercel (Frontend)
- VPS / Cloud (Backend)

---

## 📁 Repository Structure

```bash
avalanche-fullstack-dapp/
├── apps/
│   ├── frontend/     # Next.js dApp
│   ├── backend/      # NestJS API
│   └── contracts/    # Solidity & Hardhat
│
├── docs/             # Modul pembelajaran Day 1–Day 5
├── docker/           # Optional docker setup
├── .env.example
└── README.md
```

---

## 🗓️ Course Structure (5 Hari)

| Hari  | Fokus                      | Output                                    |
| ----- | -------------------------- | ----------------------------------------- |
| Day 1 | Blockchain & Avalanche     | Wallet connect ke dApp                    |
| Day 2 | Smart Contract             | Contract deploy ke Avalanche Fuji Testnet |
| Day 3 | Frontend dApp with Next.js | Interaksi smart contract                  |
| Day 4 | Backend API with NestJS    | Simpan data off-chain                     |
| Day 5 | Integration & Deploy       | Full stack dApp live                      |

📘 Modul lengkap tersedia di folder [`/docs`](./docs)

---

## 🕒 Jadwal Pelaksanaan

Short course ini dilaksanakan selama **5 hari** dengan jadwal sebagai berikut:

- **Hari / Tanggal:**
  **Senin, 12 Januari 2026 – Jumat, 16 Januari 2026**
- **Waktu:**
  **13.00 – 16.00 WIB**
- **Tempat:**
  Pamulang University (Remote)

---

## 🧪 Format Kegiatan Harian

Setiap hari, sesi pembelajaran dibagi ke dalam beberapa bagian berikut:

- **Pretest**
  Untuk mengukur pemahaman awal peserta
- **Materi (1 jam)**
  Penjelasan konsep utama sesuai modul harian
- **Demo (1 jam)**
  Live coding & demonstrasi implementasi
- **Penjelasan Tugas (1 jam)**
  Breakdown tugas harian & expected output
- **Postest**
  Untuk mengukur pemahaman setelah sesi

---

## 🎓 Kriteria Kelulusan & Sertifikat

Peserta **berhak mendapatkan sertifikat kelulusan** apabila memenuhi seluruh kriteria berikut:

- **Kehadiran pretest & postest minimal 70%**
- **Nilai postest minimal 70%**
- **Mengerjakan seluruh tugas harian (100%)**

Sertifikat diberikan sebagai bukti penyelesaian
**Avalanche Full Stack dApp Short Course**.

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/avalanche-indonesia/pamulang-university-short-course.git
cd avalanche-fullstack-dapp
```

---

### 2️⃣ Prerequisites

Pastikan sudah terinstall:

- Node.js ≥ 22
- npm / yarn / pnpm
- Core Wallet
- Git

---

### 3️⃣ Setup Environment Variables

Copy file `.env.example` dan sesuaikan:

```bash
cp .env.example .env
```

Setiap aplikasi (`frontend`, `backend`, `contracts`) memiliki `.env.example` masing-masing.

---

## 🧪 Menjalankan Project (Development)

### 🔹 Frontend

```bash
cd apps/frontend
npm install
npm run dev
```

Akses: `http://localhost:3000`

---

### 🔹 Smart Contract

```bash
cd apps/contracts
npm install
npx hardhat compile
npx hardhat test
```

Deploy ke Avalanche Fuji:

```bash
npx hardhat run scripts/deploy.ts --network fuji
```

---

### 🔹 Backend

```bash
cd apps/backend
npm install
npm run start:dev
```

API berjalan di: `http://localhost:3001`

---

## 🔐 Environment & Security Notes

- Jangan commit file `.env`
- Jangan share private key / mnemonic
- Gunakan wallet khusus testnet untuk belajar

---

## 📦 Deployment Overview

- **Smart Contract:** Avalanche Fuji Testnet
- **Frontend:** Vercel
- **Backend:** VPS / Cloud (Docker optional)

Detail deployment dijelaskan pada **Day 5 module**.

---

## 📘 Learning Modules

| Module | Link                                             |
| ------ | ------------------------------------------------ |
| Day 1  | [`docs/day-1/README.md`](./docs/day-1/README.md) |
| Day 2  | [`docs/day-2/README.md`](./docs/day-2/README.md) |
| Day 3  | [`docs/day-3/README.md`](./docs/day-3/README.md) |
| Day 4  | [`docs/day-4/README.md`](./docs/day-4/README.md) |
| Day 5  | [`docs/day-5/README.md`](./docs/day-5/README.md) |

---

## 🏁 Final Output

Pada akhir course, peserta memiliki:

- 1 Full Stack dApp aktif
- Smart contract di Avalanche Testnet
- Frontend & Backend production-ready
- Repository GitHub untuk portfolio

---

## 🤝 Contributing

Project ini dibuat untuk kebutuhan edukasi.
Pull request & improvement sangat dipersilakan.

---

## 📄 License

MIT License

---

Happy building on Avalanche 🚀
