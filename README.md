# E-SKTR Kabupaten Temanggung

Portal teknis pelayanan Surat Keterangan Terdaftar dan Rekomendasi untuk Ponpes, MDT, dan TPQ.

## Fitur yang telah diimplementasikan
- Supabase Auth email/password dan pembuatan profil default pemohon.
- Dashboard pemohon/petugas, antrean dan detail pengajuan.
- Draft pengajuan yang terikat pada membership lembaga.
- Upload PDF/JPG/PNG maksimal 10 MB ke Supabase Storage privat.
- Alur submit, pemeriksaan, permintaan perbaikan, keputusan dan metadata surat terbit.
- Audit log untuk aktivitas penting.
- Signed URL dokumen berumur 60 detik setelah otorisasi backend.
- Migrasi awal PostgreSQL dan GitHub Actions untuk quality checks.

## Setup
1. Siapkan Supabase Auth dan bucket privat `esktr-documents`.
2. Isi environment sesuai `.env.example` di lokal/Vercel.
3. Jalankan `npm install`.
4. Pastikan database target sesuai, lalu jalankan `npx prisma migrate deploy`.
5. Login akun pemohon. Profil default APPLICANT dibuat otomatis.
6. Pengelola harus membuat data lembaga dan membership akun secara terverifikasi. Role petugas diberikan manual melalui prosedur aman.
7. Jalankan `npm run dev`.

## Batasan dan status
CI terakhir yang diperiksa pada branch development berhasil untuk install, Prisma generate, typecheck, lint, validasi schema dan build. Integrasi Supabase/PostgreSQL dan deployment Vercel belum dilakukan karena environment/credential belum tersedia.
Persyaratan resmi, kewenangan pejabat, format/nomor surat, tanda tangan, masa berlaku dan retensi arsip masih perlu disahkan pemilik proses. Tidak ada data contoh atau aturan resmi yang dikarang.
Lihat `docs/OPEN-QUESTIONS.md` dan `docs/DEPLOYMENT.md`.
