# Ruang Rimba

Website profil dan pemasaran berbahasa Indonesia untuk organisasi petualangan alam, outdoor learning, dan konservasi. Nama, cerita, program, dan visual yang belum diisi admin ditandai sebagai demo atau placeholder.

## Fitur

- Homepage responsif, Tentang Kami, Program dan detail program, Konservasi, Galeri, Artikel dan detail artikel, FAQ, serta Kontak.
- Desain earthy dengan sistem warna CSS, navigasi mobile, galeri terfilter, dan lightbox yang dapat digunakan dengan keyboard.
- CMS admin untuk program, artikel, foto galeri, anggota tim, proyek konservasi, dan pengaturan situs.
- Kotak masuk permintaan program dengan status dan pencatatan perubahan administrator.
- Formulir kontak tersimpan di SQLite, divalidasi di server, dilindungi honeypot, dan dibatasi pengirimannya per email.
- Tombol WhatsApp tampil dari konfigurasi organisasi dan otomatis tersembunyi saat nomor belum diisi.
- File SQLite lokal di disk proyek melalui Prisma ORM 7 dan adapter libSQL; konten mempunyai status draft, terbit, dan arsip.
- Login admin Auth.js Credentials dengan password bcrypt dan pemeriksaan peran di server.
- Draft tidak ditampilkan ke halaman publik atau sitemap. Konten demo statis tetap menjadi fallback sampai tersedia konten CMS yang terbit.
- Metadata per halaman mencakup canonical, Open Graph, dan kartu X; sitemap hanya mencantumkan program dan artikel CMS yang terbit. Halaman admin dan API dikecualikan dari crawling.
- Validasi input Zod, UUID, indeks slug/status/tanggal, dan audit log perubahan admin.

## Teknologi

Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, SQLite lokal, Prisma ORM 7, Auth.js, Zod, dan bcryptjs.

Gunakan Node.js 20.9 atau lebih baru. Prisma 7 memerlukan Node.js 20.19+.

## Menjalankan lokal

1. Pasang dependensi dan salin konfigurasi:

   ```bash
   npm install
   cp .env.example .env.local
   ```

2. Isi `ADMIN_EMAIL`, `ADMIN_PASSWORD` (minimal 12 karakter), dan buat `AUTH_SECRET` acak, misalnya dengan `openssl rand -base64 32`. `DATABASE_URL` di `.env.example` menyimpan database pada `prisma/ruang-rimba.db` di disk proyek.

3. Buat client, terapkan migrasi SQLite, lalu buat akun admin:

   ```bash
   npm run db:generate
   npm run db:deploy
   npm run db:seed
   ```

5. Jalankan situs:

   ```bash
   npm run dev
   ```

Buka http://localhost:3000. CMS berada di `/admin`; gunakan kredensial `ADMIN_EMAIL` dan `ADMIN_PASSWORD` yang dipakai saat seed.

Untuk konten contoh tambahan yang semuanya berstatus draft, atur `SEED_DEMO_CONTENT=true` sebelum menjalankan `npm run db:seed`. Akun admin tetap dibuat dari variabel lingkungan. Jangan gunakan kredensial demo di produksi.

## Environment variables

| Variabel | Fungsi |
| --- | --- |
| `DATABASE_URL` | File SQLite, misalnya `file:./prisma/ruang-rimba.db` (path relatif ke root proyek) |
| `POSTGRES_SOURCE_URL` | URL sumber PostgreSQL untuk pemindahan satu kali; kosongkan setelah pemindahan |
| `AUTH_SECRET` | Kunci sesi Auth.js; harus acak dan rahasia |
| `AUTH_URL` | URL endpoint Auth.js; gunakan `http://localhost:3000/api/auth` lokal dan domain HTTPS situs saat deployment |
| `ADMIN_EMAIL` | Email bootstrap administrator |
| `ADMIN_PASSWORD` | Kata sandi bootstrap, minimal 12 karakter; disimpan sebagai hash bcrypt |
| `SEED_DEMO_CONTENT` | Isi `true` hanya untuk menambahkan contoh konten draft |
| `NEXT_PUBLIC_SITE_URL` | URL canonical dan sitemap |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Fallback WhatsApp resmi, format angka internasional tanpa `+` |
| `NEXT_PUBLIC_ORGANIZATION_EMAIL` | Fallback email organisasi |
| `NEXT_PUBLIC_ORGANIZATION_ADDRESS` | Fallback alamat organisasi |
| `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_YOUTUBE_URL` | Fallback tautan sosial |

Kontak yang diisi melalui CMS mengambil prioritas dari fallback lingkungan. `.env.local` diabaikan Git; jangan simpan kredensial di source code.

## Database dan CMS

- `prisma/schema.prisma` adalah sumber model dan relasi SQLite. Aplikasi menyelesaikan path file relatif dari root proyek, sehingga `prisma/ruang-rimba.db` tetap berada di disk E: proyek ini.
- Migrasi SQLite aktif berada di `prisma/migrations-sqlite/`. Riwayat migrasi PostgreSQL lama tetap disimpan di `prisma/migrations/` dan tidak dijalankan pada database SQLite.
- `npm run db:migrate` dipakai saat pengembangan skema dan membuat migrasi baru.
- `npm run db:deploy` menerapkan migrasi yang sudah tersimpan, termasuk saat deployment.
- `npm run db:seed` membuat atau memperbarui administrator dari variabel lingkungan.
- Database lokal tersimpan di `prisma/ruang-rimba.db`; file dan journal SQLite diabaikan Git.
- Untuk menyalin isi PostgreSQL lama, atur `POSTGRES_SOURCE_URL`, pastikan database SQLite baru sudah dimigrasikan dan masih kosong, lalu jalankan `npm run db:migrate-postgres`. Perintah ini menyalin akun, konten, pengaturan, permintaan, dan audit log tanpa mengubah database sumber. Jalankan satu kali saja.
- Admin dapat membuat, mengedit, menerbitkan, dan mengarsipkan program, artikel, galeri, tim, dan proyek konservasi. Gambar CMS saat ini memakai path lokal di bawah `public/`; tambahkan file berizin di sana, lalu isi path seperti `/images/nama-file.jpg`.
- Permintaan pengunjung tersimpan di `ContactSubmission` dan dapat ditinjau pada `/admin/permintaan`. Administrator dapat memperbarui status Baru, Sudah dihubungi, Dalam proses, Selesai, atau Diarsipkan; perubahan status masuk ke `AuditLog`.
- Form kontak memvalidasi semua masukan di server, memakai pemeriksaan Origin bawaan Server Action Next.js, honeypot, serta batas tiga permintaan per email per jam. Data kontak hanya tampil di area admin.
- Perubahan CMS dicatat di `AuditLog`. Tidak ada pendaftaran admin publik.

## Pengujian dan build

```bash
npm run lint
npm run typecheck
npm test
npm run test:integration # requires an applied SQLite migration
npm run build
```

Build produksi:

```bash
npm run start
```

## Menjalankan pada server sendiri

1. Sediakan disk persisten untuk file SQLite dan jalankan satu instance aplikasi. File pada disk E: komputer lokal tidak ikut tersedia di server.
2. Atur `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan `NEXT_PUBLIC_SITE_URL` di environment server. `AUTH_URL` harus menunjuk ke endpoint `/api/auth` melalui HTTPS.
3. Jalankan `npm ci`, `npm run db:generate`, dan `npm run db:deploy` di server.
4. Jalankan seed admin dengan environment server yang aman, lalu build dan start Next.js.
5. Cadangkan file database secara berkala dan isi profil serta konten terverifikasi sebelum menerbitkan halaman.

Atur `NEXT_PUBLIC_SITE_URL` ke origin HTTPS produksi sebelum build agar canonical, sitemap, dan robots menunjuk ke domain produksi. Konten demo diberi `noindex`; tinjau dan ganti konten demo sebelum publikasi.

## Batasan konten

Ruang Rimba, narasi organisasi, spesifikasi kegiatan, penulis demo, dan ilustrasi placeholder belum merupakan fakta organisasi nyata. Statistik, dampak konservasi, mitra, sertifikasi, penghargaan, testimoni, maupun kontak tidak dibuat-buat. Halaman publik tidak menampilkan angka dampak tanpa data terverifikasi.
