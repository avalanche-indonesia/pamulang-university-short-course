# 📘 Day 2 – Smart Contract Fundamentals & Solidity (Avalanche)

---

## Pre-Test (10 menit)

[Link](https://forms.gle/5Tou5pDtRyUbdfz76)

---

> Avalanche Indonesia Short Course – **Day 2**

Hari kedua difokuskan pada **Smart Contract Layer**: bagaimana logic dan state dApp hidup di blockchain, bukan di backend server.

---

## 🎯 Tujuan Pembelajaran

Pada akhir sesi Day 2, peserta mampu:

- Memahami peran smart contract dalam arsitektur dApp
- Memahami **mental model smart contract** (Web2 → Web3)
- Menulis smart contract sederhana dengan Solidity
- Menggunakan **Hardhat** sebagai development environment
- Compile & deploy smart contract
- Deploy smart contract ke **Avalanche Fuji Testnet**
- Memverifikasi contract melalui block explorer
- Memahami hubungan **Frontend ↔ Wallet ↔ Smart Contract**

---

## 🧩 Studi Kasus

### Avalanche Simple Full Stack dApp – Smart Contract Layer

Smart contract pada Day 2 berfungsi sebagai:

- Penyimpan data di blockchain
- **Single source of truth**
- Logic inti aplikasi

📌 Contract ini akan digunakan kembali pada:

- **Day 3 – Frontend Integration**
- **Day 5 – Full Integration**

---

## ⏱️ Struktur Sesi (± 3 Jam)

| Sesi                | Durasi   | Aktivitas                        |
| ------------------- | -------- | -------------------------------- |
| Pre-test            | 10 menit |                                  |
| Theory              | 50 menit | Konsep smart contract & Solidity |
| Demo                | 1 Jam    | Setup Hardhat & deploy contract  |
| Penjelasan Homework | 40 menit | Modifikasi & deploy mandiri      |
| Post-test           | 20 menit |                                  |

---

# 1️⃣ Theory (50 menit)

## 1.1 Apa itu Smart Contract?

Smart contract adalah **program yang berjalan di blockchain** dan memiliki karakteristik:

- Menyimpan state
- Mengeksekusi logic
- **Immutable** (tidak bisa diubah setelah deploy)

📌 Smart contract **bukan backend server**.

---

## 1.2 Mental Model Smart Contract (Wajib Dipahami)

```text
User (wallet + gas)
  ↓ sign
Frontend (UI only)
  ↓ request
Wallet (Core)
  ↓ transaction
Smart Contract (logic & state)
  ↓
Blockchain (Avalanche C-Chain)
```

🔑 Catatan penting:

- Frontend **tidak menyimpan state penting**
- Frontend **tidak menjalankan logic bisnis**
- Wallet bertugas:

  - Menandatangani transaksi
  - Mengirim transaksi ke blockchain

---

## 1.2.a Smart Contract ≠ Backend API

Smart contract **bukan REST API**.

| Backend Web2         | Smart Contract Web3           |
| -------------------- | ----------------------------- |
| Bisa dipanggil bebas | Write perlu wallet signature  |
| Response instan      | Tergantung block confirmation |
| Retry otomatis       | Tx gagal → gas tetap terpakai |
| Server bayar cost    | User bayar gas                |

📌 UX Web3 **berbeda secara fundamental** dengan Web2.

---

## 1.3 Smart Contract vs Backend Tradisional

| Backend Tradisional | Smart Contract      |
| ------------------- | ------------------- |
| Mutable             | Immutable           |
| Terpusat            | Terdesentralisasi   |
| Trust ke operator   | Trust ke code       |
| Bisa rollback       | Tidak bisa rollback |

---

## 1.4 Solidity Basics

Konsep dasar Solidity:

- `contract` → blueprint program
- `state variable` → data di blockchain
- `function` → logic
- `view / pure` → read-only
- `event` → log transaksi

Contoh:

```solidity
contract Storage {
    uint256 value;
}
```

📌 `value` disimpan di **blockchain**, bukan di browser.

---

## 1.4.a `msg.sender` & Ownership

```solidity
address public owner;

constructor() {
    owner = msg.sender;
}
```

📌 Penjelasan:

- `msg.sender` = wallet yang menandatangani transaksi
- Saat deploy, deployer otomatis menjadi `owner`
- Wallet = **identity** (tanpa login/password)

---

## 1.5 Read vs Write

| Read (Call)           | Write (Transaction) |
| --------------------- | ------------------- |
| Tidak pakai gas       | Pakai gas           |
| Tidak ubah state      | Mengubah state      |
| Tidak perlu signature | Perlu wallet        |

---

## 1.5.a Gas & Failure Model

Transaksi blockchain:

| Status  | State         | Gas               |
| ------- | ------------- | ----------------- |
| Success | Berubah       | Terpakai          |
| Revert  | Tidak berubah | ❌ Tetap terpakai |

Contoh:

```solidity
require(_value > 0, "Value must be > 0");
```

📌 Validasi penting untuk UX.

---

## 1.6 Hardhat Overview

Hardhat adalah:

- Development environment Solidity
- Compiler
- Tool deployment & testing

Kenapa Hardhat?

- Populer di industri
- Cocok untuk Avalanche (EVM)

Alternatif selain hardhat:

- Remix
- Foundry

---

## 2️⃣ Demo (1 Jam)

## 2.1 Setup Project

```bash
npm init -y
```

```bash
yarn add -D hardhat
```

Jika yarn belum terinstall bisa menggunakan:

```bash
corepack enable
```

```bash
corepack prepare yarn@stable --activate
```

Selanjutnya membuat yarn berry seperti yarn classic dengan node_modules

```bash
touch .yarnrc.yml
```

```text
nmHoistingLimits: workspaces
nodeLinker: node-modules
```

```bash
touch .gitignore
```

```text
# Dependencies
node_modules

# Env files
.env

# Yarn
.yarn/*
!.yarn/releases
!.yarn/patches
!.yarn/plugins
!.yarn/sdks
!.yarn/versions
!.yarn/cache
.pnp.*

# Misc
.DS_Store

# IDE
.vscode
.idea
```

```bash
yarn install
```

```bash
yarn dlx hardhat --init
```

```bash
touch .mocharc.json
```

```json
{
  "require": "hardhat/register",
  "timeout": 40000,
  "_": ["test*/**/*.ts"]
}
```

```bash
touch .env
```

```env
MNEMONIC="here is where your extracted twelve words mnemonic phrase should be put"
PRIVATE_KEY="<your wallet private key should go here>"
POKT_API_KEY="********************************"
INFURA_API_KEY="********************************"
INFURA_API_SECRET="********************************"
ALCHEMY_API_KEY="********************************"
ETHERSCAN_API_KEY="********************************"
```

```bash
yarn hardhat compile
```

```bash
yarn hardhat test
```

Update `hardhat.config.ts`

```ts
import { task, type HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

import { ETHERSCAN_API, RPC_URL, USER_PRIVATE_KEY } from "./helpers/constants";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      evmVersion: "shanghai",
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    avalancheFuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: [USER_PRIVATE_KEY],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API,
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true,
  },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.viem.getWalletClients();
  for (const account of accounts) {
    console.log(account.account.address);
  }
});

export default config;
```

Create hardhat task

```js
import { task, type HardhatUserConfig } from "hardhat/config";

...

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.viem.getWalletClients();
  for (const account of accounts) {
    console.log(account.account.address);
  }
});
```

```bash
yarn hardhat accounts
```

Struktur:

```text
apps/contracts/
├── contracts/
├── scripts/
├── test/
├── hardhat.config.ts
```

VS Code extensions

- [Mocha Test Explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter)

- [Hardhat](https://hardhat.org/hardhat-vscode/docs/overview)

---

## 2.2 Smart Contract

**`contracts/SimpleStorage.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedValue;

    event ValueUpdated(uint256 newValue);

    function setValue(uint256 _value) public {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }
}
```

📌 Contract ini:

- Menyimpan 1 nilai integer
- Bisa di-update oleh siapa saja (sementara)

---

## 2.3 Compile Contract

```bash
npx hardhat compile
```

Output:

- ABI
- Bytecode

📌 **ABI adalah jembatan antara frontend dan smart contract.**

---

## 2.4 Konfigurasi Avalanche Fuji

```ts
fuji: {
  url: "https://api.avax-test.network/ext/bc/C/rpc",
  accounts: [process.env.PRIVATE_KEY]
}
```

📌 Gunakan **private key Core Wallet (testnet)**.

---

## 2.5 Deploy Contract

```bash
npx hardhat run scripts/deploy.ts --network fuji
```

Catat:

- Contract address
- Transaction hash

---

## 2.6 Verifikasi di Explorer

- Buka Snowtrace / Avalanche Explorer
- Cari contract address
- Cek:

  - Transaction
  - Contract creation
  - Event log

> 📌 Sekarang smart contract **hidup di blockchain**.

---

## 3️⃣ Praktik / Homework (1 Jam)

### 🎯 Objective Praktik

Peserta mampu **memodifikasi dan deploy smart contract secara mandiri**.

---

## 3.1 Task 1 – Ownership

Pastikan contract memiliki:

- `owner`
- Event `OwnerSet`

---

## 3.2 Task 2 – Event Validation

Pastikan:

- `OwnerSet` muncul saat deploy
- `ValueUpdated` muncul saat set value

---

## 3.3 Task 3 – Deploy Ulang

- Compile ulang
- Deploy ulang ke Fuji
- Simpan:

  - Contract address
  - ABI JSON

📌 Data ini WAJIB untuk Day 3.

---

## 🌟 Task 4 – (Optional / Advanced) Access Control

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}
```

Gunakan pada `setValue`.

Tambahkan 1 state lainnya seperti `message` atau `todo list` yang bisa diupdate seperti kita menyimpan value

---

## 🧪 Checklist

- [ ] Contract berhasil compile
- [ ] Contract berhasil deploy
- [ ] Address tersimpan di blockchain Avalanche Fuji Testnet
- [ ] ABI tersedia
- [ ] Event terlihat di explorer

[Submission Link](https://forms.gle/bDjmXjqaK3X7yapc8) aktif selama 48 jam, deadline Tanggal 15 Jan 2026 pukul 23.59 WIB

---

## ✅ Output Day 2

- Smart contract aktif di Fuji Testnet
- Peserta memahami:

  - Smart contract ≠ backend
  - Wallet = identity
  - Gas & failure model

- Contract siap diintegrasikan ke frontend

---

## 🚀 Preview Day 3

Day 3 fokus pada **Frontend Integration**:

- Next.js sebagai frontend
- Load ABI & contract address
- Read data (`call`)
- Write data (`transaction` via Core Wallet)
- Handle tx success & failure

---

## 📚 Referensi

- Solidity Docs: [https://docs.soliditylang.org](https://docs.soliditylang.org)
- Hardhat Docs: [https://hardhat.org](https://hardhat.org)
- Avalanche Academy: [https://build.avax.network/academy](https://build.avax.network/academy)

---

## Post-Test

[Link](https://forms.gle/JiDSq7gsFKm43AXr6)

---

## Feedback

[Link](https://forms.gle/FskqGK5AZjwMMhTx9)

---

🔥 **Smart contract deployed!**
Besok kita mulai menghubungkan **frontend ↔ wallet ↔ blockchain** 🚀
