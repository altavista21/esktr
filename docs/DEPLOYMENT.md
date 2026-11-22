# Konfigurasi deployment E-SKTR

## Vercel environment variables
- DATABASE_URL: PostgreSQL connection string.
- NEXT_PUBLIC_SUPABASE_URL: URL project Supabase.
- NEXT_PUBLIC_SUPABASE_ANON_KEY: publishable/anon key.
- SUPABASE_SERVICE_ROLE_KEY: secret server-only, jangan gunakan prefix NEXT_PUBLIC_.
- NEXT_PUBLIC_SITE_URL: domain aplikasi, misalnya domain Vercel.

## Supabase
1. Aktifkan Authentication > Email provider.
2. Buat Storage bucket `esktr-documents` dengan status PRIVATE.
3. Jangan membuat policy publik untuk bucket.
4. Unggah dan unduh melalui API server setelah pemeriksaan autentikasi dan hak akses.
5. Simpan service role key hanya di Vercel server environment.

## Database dan role
Schema Prisma telah diperluas. Review dan buat migration sebelum deployment. Jangan menjalankan `db push` pada produksi. Setelah migration tersedia, gunakan `npx prisma migrate deploy`.
Setiap Supabase Auth user perlu memiliki UserProfile dengan authUserId yang sama. Role default APPLICANT. Role OFFICER, APPROVER, ADMIN diberikan secara manual melalui prosedur admin yang terkontrol. Jangan mengambil role dari input publik atau metadata yang dapat diubah pengguna.

## Wajib sebelum produksi
Konfirmasi dasar hukum, daftar persyaratan layanan, pejabat berwenang, format dan penomoran surat, tanda tangan elektronik, masa berlaku, pembatalan, retensi dan backup. Tambahkan rate limiting/anti-abuse, monitoring, UAT, security review dan uji pemulihan.
Penerbitan saat ini hanya menyimpan metadata nomor surat dan storage path berkas final yang diunggah pejabat. Sistem tidak membuat surat resmi atau tanda tangan elektronik otomatis.
