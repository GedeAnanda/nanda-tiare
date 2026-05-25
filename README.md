# 🎀 Nanda 💗 Tiare — Happy 2 Years Anniversary Website

Website anniversary yang dibuat Nanda khusus buat Tiare. Selamat anniversary ke-2, sayang! 💕

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📝 Cara Edit Konten

Semua konten ada di **satu file**: `src/lib/content.ts`

### Ganti Teks & Cerita
Buka `src/lib/content.ts` dan edit:
- **`config`** — tanggal jadian, tanggal anniversary
- **`milestones`** — cerita di timeline (10 milestone)
- **`letters`** — surat cinta (15 surat, ganti `body` dengan surat asli)
- **`songs`** — playlist (6 lagu, ganti title & artist)
- **`quizQuestions`** — quiz (10 pertanyaan, ganti soal & jawaban)
- **`wishlistItems`** — bucket list (12 item)
- **`voiceNotes`** — voice notes (6 items, tambah `audioSrc`)
- **`galleryPhotos`** — foto gallery (12 foto, tambah `src`)
- **`secretMessage`** — pesan rahasia di halaman secret

### Tambah Foto
1. Taruh file foto di `/public/images/` (format: `photo-1.jpg`, `photo-2.jpg`, dll)
2. Buka `src/lib/content.ts`, di bagian `galleryPhotos`, isi `src`:
```ts
{ id: 1, caption: "...", date: "...", gradient: "...", src: "/images/photo-1.jpg" },
```

### Tambah Audio / Voice Notes
1. Taruh file audio di `/public/audio/` (format: `vn-1.mp3`, `vn-2.mp3`, dll)
2. Buka `src/lib/content.ts`, di bagian `voiceNotes`, isi `audioSrc`:
```ts
{ id: 1, title: "...", audioSrc: "/audio/vn-1.mp3", ... },
```

### Tambah Foto untuk Timeline
1. Untuk menambah foto di milestone timeline, edit `src/app/timeline/page.tsx`
2. Ganti placeholder div gradient dengan `<Image>` yang mengarah ke foto

## 🏠 PWA (Add to Home Screen)
Website ini sudah PWA-ready. Tiare bisa "Add to Home Screen" dari browser untuk buka langsung dari homescreen HP.

Untuk custom icon:
1. Buat icon 192x192 dan 512x512 pixel
2. Taruh di `/public/icons/icon-192.png` dan `/public/icons/icon-512.png`
3. (Opsional) Tambah apple-touch-icon di `/public/icons/apple-touch-icon.png`

## 🌐 Deploy ke Vercel

### Cara 1: Via GitHub
1. Push project ke GitHub repository
2. Buka [vercel.com](https://vercel.com)
3. Import repository
4. Click "Deploy" — selesai!

### Cara 2: Via CLI
```bash
npm i -g vercel
vercel
```

## 🗂️ Struktur Project

```
src/
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx           # Landing / Hero + Countdown
│   ├── timeline/          # Cerita 2 tahun
│   ├── gallery/           # Galeri foto (Polaroid + Filmstrip)
│   ├── letters/           # 15 surat cinta + envelope animation
│   ├── playlist/          # Playlist lagu-lagu kita
│   ├── games/             # Mini games (Catch Hearts + Quiz)
│   ├── wishlist/          # Bucket list bareng
│   ├── voice/             # Voice notes collection
│   └── secret/            # Hidden page (easter egg!)
├── components/
│   ├── layout/            # TopBar, BottomNav, Loader, ClientLayout
│   └── ui/                # FloatingElements, ConfettiBurst
├── lib/
│   ├── content.ts         # 🎯 SEMUA KONTEN EDIT DI SINI
│   ├── hooks.ts           # Custom React hooks
│   └── utils.ts           # Utility functions
└── public/
    ├── images/            # Foto-foto (tambah di sini)
    ├── audio/             # Voice notes & audio (tambah di sini)
    ├── icons/             # PWA icons
    └── manifest.json      # PWA config
```

## 🥚 Easter Eggs
- **Triple-tap** judul "Happy 2 Years, Sayang" → buka halaman rahasia
- **Ketik "tiare"** di keyboard (desktop) → buka halaman rahasia  
- **Hati tersembunyi** di halaman Gallery → buka halaman rahasia
- **Vault** di halaman Secret → terbuka otomatis tanggal 29 Mei 2026

## 💡 Fitur
- ⏰ Live countdown ke 29 Mei 2026 (auto switch ke count-up setelah anniv)
- 💌 15 surat cinta dengan envelope animation & typewriter effect
- 📸 Gallery dual-mode (Polaroid + Filmstrip) dengan 3D flip
- 🎮 2 mini games: Catch Hearts & Quiz "Seberapa Kenal?"
- 📝 Interactive bucket list dengan progress tracking
- 🎵 Playlist cards dengan music note animations
- 🎤 Voice notes dengan waveform animation
- 🤫 Halaman rahasia dengan vault yang unlock di hari anniv
- ✨ Confetti, sparkles, floating emojis, haptic feedback
- 📱 Mobile-first design, PWA-ready
- 💾 LocalStorage untuk save progress (game scores, opened letters, wishlist)

---

Dibuat dengan 💗 oleh Nanda untuk Tiare
