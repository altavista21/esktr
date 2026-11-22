# Status implementasi E-SKTR

## Sudah masuk ke branch development
- [x] Fondasi Next.js App Router, TypeScript, Tailwind, Prisma dan Supabase.
- [x] Model peran APPLICANT, OFFICER, APPROVER, ADMIN.
- [x] Model lembaga, keanggotaan, pengajuan, dokumen, pemeriksaan, keputusan, surat terbit, dan audit.
- [x] API login/logout dan pembuatan profil pemohon default saat login.
- [x] Dashboard pemohon/petugas, detail pengajuan dan antrean.
- [x] Pembuatan draft, unggah dokumen privat PDF/JPG/PNG maksimal 10 MB, submit.
- [x] Tindakan pemeriksaan, permintaan perbaikan, persetujuan/penolakan dan penerbitan metadata surat.
- [x] Signed URL 60 detik untuk unduh dokumen dan surat terbit setelah otorisasi server.
- [x] Audit log untuk perubahan alur penting.
- [x] Migrasi awal PostgreSQL pada prisma/migrations.
- [x] CI: install, Prisma generate, typecheck, lint, validasi schema dan build.

## Belum siap produksi
- [ ] Environment Supabase/PostgreSQL dan Vercel belum dihubungkan.
- [ ] Migrasi belum dijalankan pada database target.
- [ ] Data lembaga dan membership pemohon belum dimasukkan.
- [ ] Role petugas/pejabat harus diberikan melalui prosedur admin yang aman.
- [ ] Persyaratan resmi, pejabat berwenang, format/nomor surat, tanda tangan, masa berlaku, pembatalan dan retensi perlu disahkan pemilik proses.
- [ ] UAT, security review, rate limiting, monitoring, backup dan uji pemulihan.

CI terakhir yang diperiksa pada commit 27fdffc berhasil. Status ini tidak berarti integrasi layanan eksternal atau deployment produksi telah dilakukan.
