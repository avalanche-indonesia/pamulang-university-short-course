## INI DEPLOY DAY 5

## Backend Deployment Status
Karena railway harus menggunakan kartu/berbayar saya mencoba menggunakan Github Pages jadi belom bisa menjalankan backend Nestjs secara server/menggunakan hosting railway karena GitHub Pages hanya static hosting.

Sudah bisa di akses secara online tetapi,
karna menggunakan Github Pages jadi saat menjalankan webnya dan kita meng-input pasti akan muncul error

## Access disini
    
ini Link Backend Github Pages    : [Linka-Hub.github.io-myswagger](https://linka-hub.github.io/pamulang-university-short-course/)

Backend API (Local) :  [http://localhost:3000/myswagger](http://localhost:3000/myswagger)

## Frontend Deployment
Frontend dApp dideploy menggunakan Vercel dengan framework Next.js.
Dan karena Backendnya gak saya deploy di railway jadi ENVnya tidak seperti yang ada di demo tetapi mengikuti Backend yang saya Deploy di Github Pages 

## Access disini
Link Frontend Vercel    : [Frontend-Vecel-byEL](https://pamulang-university-short-course-da.vercel.app/)



## ✅ Final Checklist – Full Stack dApp (Day 5)

Berikut adalah status implementasi Full Stack dApp pada tahap Day 5:

| No | Checklist                      | Status      | Keterangan                                                                                                                                                                                           |
| -- | ------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | Smart contract terdeploy       | ✅ Sudah     | Smart contract berhasil dideploy dan digunakan sebagai source of truth di blockchain.                                                                                                                |
| 2  | Backend API live               | ⚠️ Sebagian | Backend API diimplementasikan dan diuji secara lokal. Dokumentasi API (Swagger) dipublikasikan secara online melalui GitHub Pages, namun backend server tidak dijalankan sebagai layanan production. |
| 3  | Frontend dapat diakses         | ✅ Sudah     | Frontend berhasil dideploy menggunakan Vercel dan dapat diakses secara publik.                                                                                                                       |
| 4  | Wallet connect berhasil        | ✅ Sudah     | Wallet berhasil terkoneksi ke frontend, user tetap menjadi signer transaksi, dan private key tidak disimpan di backend.                                                                              |
| 5  | Read & write blockchain sukses | ✅ Sudah     | User dapat melakukan write ke smart contract melalui wallet dan membaca data blockchain dengan benar.                                                                                                |
| 6  | Full flow berjalan end-to-end  | ⚠️ Sebagian | Alur frontend → wallet → blockchain berjalan dengan baik. Alur frontend → backend (server production) belum sepenuhnya berjalan karena backend tidak dideploy sebagai server aktif.                  |

### Catatan Deployment Backend

Backend API tidak dideploy menggunakan platform seperti Railway karena keterbatasan akses pada layanan berbayar. Sebagai alternatif, backend dijalankan dan diuji secara lokal, kemudian dokumentasi API dihasilkan menggunakan Swagger dan dipublikasikan melalui GitHub Pages agar tetap dapat diakses secara publik.

Pendekatan ini tetap memenuhi tujuan pembelajaran Day 5, khususnya dalam memahami arsitektur Full Stack dApp, integrasi antar layer, serta konsep deployment dan environment configuration.

### Arsitektur Akhir

```
User
 ↓
Frontend (Vercel)
 ↓
Backend API (NestJS – Local / Swagger Documentation)
 ↓
Blockchain (Avalanche Testnet)
```

**Status Akhir:**
✔ Frontend live
✔ Smart contract terdeploy
✔ Wallet integration berhasil
✔ Read & write blockchain berjalan
✔ Dokumentasi backend publik
✔ Implementasi Full Stack dApp tercapai sesuai tujuan pembelajaran Day 5

