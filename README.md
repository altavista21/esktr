# E-SKTR Kabupaten Temanggung

Fondasi aplikasi web untuk layanan Surat Keterangan Terdaftar dan Rekomendasi bagi Pondok Pesantren, Madrasah Diniyah Takmiliyah, dan Taman Pendidikan Al-Qur’an di lingkungan Kementerian Agama Kabupaten Temanggung.

## Status

**Fondasi teknis awal (0.1.0).** Repository ini belum merupakan sistem pelayanan siap pakai. Persyaratan layanan, dasar hukum, kewenangan petugas/pejabat, alur pemeriksaan, format surat, penomoran, dan ketentuan penerbitan masih memerlukan validasi pemilik proses.

## Teknologi

- Next.js App Router dan TypeScript strict
- Tailwind CSS
- Struktur komponen UI kompatibel shadcn/ui
- Lucide React
- PostgreSQL dan Prisma ORM
- Supabase Auth dan private Storage (kerangka integrasi)
- Vercel sebagai target deployment

## Menjalankan secara lokal

1. Gunakan Node.js 20 atau versi LTS yang kompatibel.
2. Salin `.env.example` menjadi `.env`.
3. Isi `DATABASE_URL` dan variabel Supabase dari project pengelola.
4. Jalankan `npm install`.
5. Validasi schema dengan `npm run db:validate`.
6. Jalankan `npm run dev` dan buka `http://localhost:3000`.

## Database

Schema awal ada di `prisma/schema.prisma`. Belum ada migrasi produksi. Setelah model data disetujui, tinjau schema lalu buat migrasi:

```bash
npx prisma migrate dev --name init
```

Jangan menjalankan migrasi produksi tanpa backup, review SQL migrasi, dan persetujuan.

## Supabase

- Gunakan Supabase Auth untuk autentikasi.
- Buat bucket Storage bernama `esktr-documents` dengan status **private**.
- Jangan menaruh service-role key pada variabel `NEXT_PUBLIC_*` atau kode browser.
- Terapkan kebijakan akses Storage dan pemeriksaan otorisasi backend sebelum fitur unggah/unduh diaktifkan.
- Helper Supabase saat ini hanya fondasi koneksi, belum implementasi lengkap login/logout, refresh sesi, atau RBAC.

## Batasan saat ini

- Halaman awal hanya informasi dan belum menerima pengajuan.
- Belum ada akun petugas/pejabat, RBAC, proses verifikasi, keputusan, atau penerbitan surat.
- Enum status dan model data adalah rancangan teknis awal, bukan penetapan prosedur resmi.
- Dokumen belum dapat diunggah atau diunduh.
- Jangan memasukkan data pribadi atau dokumen lembaga sungguhan sebelum kontrol akses dan retensi disetujui.

## Pemeriksaan

```bash
npm run lint
npm run typecheck
npm run db:validate
npm run build
```

Lihat `docs/OPEN-QUESTIONS.md` untuk keputusan pemilik proses yang masih diperlukan.
