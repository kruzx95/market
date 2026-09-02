# 🛍️ Market - Modern D2C Online Store Platform

Platform toko online mandiri (*Direct-to-Consumer*) yang modern, cepat, dan ringan berbasis **Astro**, **React**, dan **Tailwind CSS**. Dirancang khusus untuk pelaku usaha / UMKM yang ingin memiliki website e-commerce profesional tanpa potongan komisi admin marketplace yang tinggi.

---

## 📋 Daftar Isi

- [Prasyarat](#-prasyarat)
- [Cara Clone & Menjalankan Proyek](#-cara-clone--menjalankan-proyek)
- [Perintah yang Tersedia](#-perintah-yang-tersedia-scripts)
- [Struktur Direktori](#-struktur-direktori)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Dokumentasi Tambahan](#-dokumentasi-tambahan)

---

## ⚙️ Prasyarat

Sebelum memulai, pastikan perangkat Anda telah terinstall perangkat lunak berikut:

- **Git** ([Download Git](https://git-scm.com/))
- **Node.js** (Versi 18.x atau lebih baru, direkomendasikan versi LTS 20+) ([Download Node.js](https://nodejs.org/))
- **npm** (Bawaan Node.js) atau package manager pilihan Anda (`pnpm` / `yarn`)

---

## 🚀 Cara Clone & Menjalankan Proyek

Ikuti langkah-langkah berikut untuk meng-clone dan menjalankan proyek ini di komputer lokal Anda:

### 1. Clone Repositori

Buka terminal atau Git Bash, lalu jalankan perintah berikut:

**Menggunakan HTTPS:**
```bash
git clone https://github.com/kruzx95/market.git
```

**Atau menggunakan SSH:**
```bash
git clone git@github.com:kruzx95/market.git
```

### 2. Masuk ke Direktori Proyek

```bash
cd market
```

### 3. Install Dependensi

Install semua dependensi yang dibutuhkan:

```bash
npm install
```

*(Jika menggunakan pnpm atau yarn, jalankan `pnpm install` atau `yarn`)*

### 4. Jalankan Development Server

Jalankan server lokal untuk tahap pengembangan:

```bash
npm run dev
```

### 5. Buka di Browser

Setelah server berjalan, buka browser dan akses alamat berikut:

```text
http://localhost:4321
```

> 💡 Server dev berjalan dengan flag `--host`, sehingga dapat juga diakses melalui IP jaringan lokal (misal untuk testing di smartphone pada jaringan Wi-Fi yang sama).

---

## 🛠️ Perintah yang Tersedia (Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan local development server dengan hot-reload (`astro dev --host`) |
| `npm run build` | Melakukan build aplikasi untuk lingkungan produksi ke folder `dist/` |
| `npm run preview` | Menjalankan preview lokal dari hasil build produksi (`astro preview --host`) |

---

## 📁 Struktur Direktori

```text
market/
├── public/                 # File statis (favicon, gambar umum)
├── src/
│   ├── components/         # Komponen UI (React & Astro)
│   ├── data/               # Data katalog produk, kategori, dan konfigurasi toko
│   ├── layouts/            # Template layout dasar (BaseLayout.astro)
│   ├── pages/              # Halaman rute aplikasi (Beranda, Detail Produk, Checkout, Admin)
│   ├── styles/             # Pengaturan styling dan CSS global
│   ├── types/              # Definisi tipe TypeScript
│   └── utils/              # Fungsi pembantu (helpers / formatters)
├── astro.config.mjs        # Konfigurasi Astro
├── tailwind.config.mjs     # Konfigurasi Tailwind CSS
├── package.json            # Daftar dependensi dan script npm
├── SALES_TOOLKIT.md        # Panduan penawaran bisnis ke klien UMKM
└── README.md               # Dokumentasi proyek
```

---

## 🧰 Teknologi yang Digunakan

- **Framework**: [Astro](https://astro.build/) (v7)
- **UI Components**: [React](https://react.dev/) (v19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **State Management**: [Nano Stores](https://github.com/nanostores/nanostores)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Interactivity & Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 📚 Dokumentasi Tambahan

Untuk panduan strategi penetapan harga (*pricing*), skema keuntungan, dan template pesan penawaran website ke pemilik UMKM / brand lokal, silakan lihat [SALES_TOOLKIT.md](SALES_TOOLKIT.md).
