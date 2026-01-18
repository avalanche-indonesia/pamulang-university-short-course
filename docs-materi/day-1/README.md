# 📘 Day 1 – Blockchain Fundamentals & Avalanche Fundamentals

---

## Pre-Test

[Link](https://forms.gle/eQzbrmRQG7whqBRh8)

---

> Avalanche Indonesia Short Course – **Day 1**

Hari pertama difokuskan pada **Fundamental Layer**: bagaimana cara kerja blockahain Avalanche dan struktur dasar dari dApp.

## 🎯 Tujuan Pembelajaran

Pada akhir sesi Day 1, peserta mampu:

- Memahami konsep dasar blockchain dan dApp
- Memahami arsitektur Avalanche
- Menjelaskan perbedaan Avalanche dan Ethereum
- Memahami _mental model_ alur kerja dApp
- Menggunakan Core wallet untuk Avalanche Testnet
- Menjalankan template frontend dApp
- Menghubungkan wallet ke dApp (connect wallet)
- Menampilkan wallet address & network di UI

---

## 🧩 Studi Kasus Day 1

### Avalanche Simple Full Stack dApp - Fundamental Layer

Hari pertama difokuskan pada **fondasi dApp**, yaitu:

- Wallet connection
- Network detection
- Frontend ↔ Wallet interaction
- Setup template project

> 📌 Semua fitur ini akan digunakan kembali dan dikembangkan sampai Day 5.

---

## ⏱️ Struktur Sesi (3 Jam)

| Sesi    | Durasi | Aktivitas                     |
| ------- | ------ | ----------------------------- |
| Theory  | 1 Jam  | Konsep blockchain & Avalanche |
| Demo    | 1 Jam  | Setup wallet & frontend       |
| Praktik | 1 Jam  | Implementasi connect wallet   |

---

## 1️⃣ Theory (1 Jam)

### 1.1 Apa itu Blockchain?

Blockchain adalah **distributed ledger** yang:

- Terdesentralisasi
- Immutable (data tidak bisa diubah)
- Transparan
- Trustless (tidak perlu pihak ketiga)

**Komponen utama blockchain:**

- Block → kumpulan transaksi
- Transaction → perubahan state
- Node → mesin yang menjalankan blockchain
- Consensus → cara node sepakat

---

### 1.2 Apa itu dApp?

dApp (Decentralized Application) terdiri dari:

- **Frontend** → UI (Web / Mobile)
- **Smart Contract** → Logic di blockchain
- **Wallet** → Identitas & signer user

#### Mental Model dApp (Penting)

```bash
User
  ↓
Frontend (HTML / JS)
  ↓
Wallet (Core)
  ↓
Blockchain (Avalanche C-Chain)
```

📌 **Catatan penting:**

- Frontend **tidak langsung** mengirim transaksi ke blockchain
- Wallet bertugas:
  - Menyimpan private key
  - Menandatangani transaksi
  - Menjadi bridge ke blockchain

---

### 1.3 dApp vs Web App

| Web App                | dApp                          |
| ---------------------- | ----------------------------- |
| Login pakai email      | Login pakai wallet            |
| Server terpusat        | Blockchain terdesentralisasi  |
| Data bisa diubah admin | Data immutable                |
| Session & cookie       | Signature & wallet connection |

> 🔑 **Wallet bukan akun**, tapi **key manager & transaction signer**.

---

### 1.4 Avalanche Fundamentals

Avalanche adalah **high-performance blockchain** dengan:

- Finalisasi transaksi cepat (<2 detik)
- Biaya transaksi rendah
- Ethereum-compatible (EVM)

#### Arsitektur Avalanche

- **X-Chain** → Asset creation & transfer
- **P-Chain** → Validator & subnet
- **C-Chain** → Smart contract (EVM)

📌 Dalam course ini, kita **hanya menggunakan Avalanche C-Chain**.

---

### 1.5 Avalanche Testnet vs Mainnet

| Testnet               | Mainnet      |
| --------------------- | ------------ |
| Gratis (token faucet) | Token asli   |
| Untuk belajar         | Production   |
| Aman untuk eksperimen | Risiko nyata |

➡️ Kita gunakan **Avalanche Fuji Testnet**.

---

### 1.6 Wallet & Security Dasar

- Wallet = Identitas di blockchain
- Private key = Akses penuh ke aset
- Seed phrase = Backup wallet

❌ Jangan pernah share:

- Private key
- Seed phrase

✅ Best practice:

- Gunakan wallet khusus testnet
- Jangan pakai wallet utama

---

## 2️⃣ Demo (1 Jam)

### 2.1 Install Core Wallet

1. Buka [https://core.app/](https://core.app/)
2. Install Core Wallet Extension
3. Buat wallet baru
4. Simpan seed phrase dengan aman

---

### 2.2 Aktifkan Avalanche Fuji Testnet

- Buka Core Wallet → Settings
- Aktifkan **Fuji Testnet**

Alternatif:

- [Chainlist](https://chainlist.org/)
- Manual configuration:

```bash
Network Name: Avalanche Fuji C-Chain
Chain ID: 43113 (0xA869)
Currency: AVAX
RPC URL: https://api.avax-test.network/ext/bc/C/rpc
Explorer: https://subnets-test.avax.network/c-chain
```

---

### 2.3 Mendapatkan AVAX Testnet

1. Sign in ke [Avalanche Builder Hub](https://build.avax.network/login)
2. Buka menu [Testnet Faucet](https://build.avax.network/console/primary-network/faucet)
3. Ikuti instruksi
4. Claim AVAX testnet

---

### 2.4 Clone & Jalankan Template Frontend

```bash
git clone https://github.com/avalanche-indonesia/pamulang-university-short-course.git
cd pamulang-university-short-course/apps/frontend
npx serve .
```

Akses:

```bash
http://localhost:3000
```

---

### 2.5 Demo Connect Wallet

Yang didemokan:

- Button **Connect Wallet**
- Request wallet access
- Ambil wallet address
- Deteksi `chainId`
- Validasi Avalanche Fuji network

📌 **Catatan teknis ringan:**

- `window.ethereum` → provider dari wallet
- Hari ini kita **belum pakai RPC langsung**

---

### 2.6 Common Errors (Demo Cepat)

- Wallet belum unlock
- User reject request
- Wrong network
- Wallet belum terinstall

---

## 3️⃣ Praktik / Homework (1 Jam)

### 🎯 Objective Praktik

Peserta mampu **menghubungkan wallet ke frontend secara mandiri**.

---

### 3.1 Task 1 – Wallet Connection

Implementasikan:

- Button `Connect Wallet`
- Request wallet permission
- Ambil wallet address
- Simpan ke state JS

---

### 3.2 Task 2 – Network Validation

- Deteksi `chainId`
- Tampilkan status:

  - ✅ Avalanche Fuji
  - ❌ Wrong Network

---

### 3.3 Task 3 – UI Display

Tampilkan di UI:

- Wallet address
- Balances
- Network name
- Connection status
- Tambahkan nama lengkap dan NIM kalian sebagai peserta setelah wallet address (WAJIB)

---

### 3.4 Task 4 – Improvement (Opsional)

- Disable button setelah connect
- Shorten address (`0x1234...abcd`)
- Listen event:

  - `accountsChanged`
  - `chainChanged`

- Tambahkan UI error handling

---

## 🧪 Checklist Praktik

- [ ] Memiliki akun di builder hub Avalanche https://build.avax.network/login
- [ ] Core wallet terinstall
- [ ] Avalanche Fuji Testnet aktif
- [ ] Frontend berjalan
- [ ] Wallet bisa connect
- [ ] Network terdeteksi dengan benar

[Submission Link](https://forms.gle/bs6UtUejoe3Yupv9A) aktif selama 48 jam, deadline Tanggal 14 Jan 2026 pukul 23.59 WIB

---

## ✅ Output Day 1

Pada akhir Day 1:

- Frontend bisa connect ke Core Wallet
- Wallet address dan balances tampil di UI
- Network Avalanche Fuji Testnet terdeteksi
- Peserta memahami alur dasar dApp
- Template siap lanjut Day 2

---

## 🚀 Preview Day 2

Di Day 2, kita akan:

- Menulis smart contract pertama
- Menggunakan Solidity & Hardhat
- Deploy ke Avalanche Fuji Testnet
- Verifikasi contract di Snowtrace

---

## 📚 Referensi Tambahan

- Avalanche Academy:
  [https://build.avax.network/academy](https://build.avax.network/academy)

---

## Post-Test

[Link](https://forms.gle/x2bzfVa7wjNj2j4s6)

---

## Feedback

[Link](https://forms.gle/T9JtUm2L1EK5XZLK7)

---

🔥 **Happy building!**
Besok kita mulai masuk ke **smart contract & Solidity** 🚀
