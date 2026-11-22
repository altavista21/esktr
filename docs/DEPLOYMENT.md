# Konfigurasi deployment E-SKTR

## Vercel environment variables
- DATABASE_URL: PostgreSQL connection string.
- NEXT_PUBLIC_SUPABASE_URL: URL project Supabase.
- NEXT_PUBLIC_SUPABASE_ANON_KEY: publishable/anon key.
- SUPABASE_SERVICE_ROLE_KEY: secret server-only, jangan gunakan prefix NEXT_PUBLIC_.
- NEXT_PUBLIC_SITE_URL: domain aplikasi.

## Supabase
1. Aktifkan Authentication > Email provider.
2. Buat Storage bucket `esktr-documents` dengan status PRIVATE.
3. Jangan membuat policy publik untuk bucket.
4. Upload dan download hanya melalui API server setelah pemeriksaan autentikasi dan hak akses.
5. Simpan service role key hanya di Vercel server environment.

## Database
Migrasi awal tersedia pada `prisma/migrations/20261122110000_init/migration.sql`. Pastikan database target masih kosong atau sudah direkonsiliasi sebelum menjalankan:
```bash
npx prisma migrate deploy
```
Jangan menjalankan `db push` pada produksi. Lakukan backup sebelum migrasi.

## Akun dan role
Saat login pertama kali, profil baru dibuat otomatis dengan role APPLICANT. Setiap akun petugas/pejabat harus diberi role OFFICER, APPROVER, atau ADMIN oleh administrator melalui proses terkontrol. Jangan mengambil role dari input publik atau metadata yang dapat diubah pengguna. Data lembaga dan hubungan akun-lembaga harus dimasukkan/ diverifikasi oleh pengelola.

## Wajib sebelum produksi
Konfirmasi dasar hukum, daftar persyaratan layanan, pejabat berwenang, format dan penomoran surat, tanda tangan elektronik, masa berlaku, pembatalan, retensi dan backup. Tambahkan rate limiting/anti-abuse, monitoring, UAT, security review dan uji pemulihan.
Penerbitan saat ini mencatat nomor surat dan path berkas PDF final yang diunggah pejabat. Sistem tidak membuat surat resmi atau tanda tangan elektronik otomatis.
