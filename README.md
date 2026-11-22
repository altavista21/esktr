# E-SKTR Kabupaten Temanggung

Portal teknis pelayanan Surat Keterangan Terdaftar dan Rekomendasi untuk Ponpes, MDT, dan TPQ.

## Implementasi
- Supabase Auth email/password dan profil peran.
- Dashboard pemohon/petugas dan antrean.
- Pembuatan draft pengajuan terikat pada membership lembaga.
- Unggah PDF/JPG/PNG maksimal 10 MB ke Supabase Storage privat.
- Alur submit, pemeriksaan, permintaan perbaikan, keputusan dan pencatatan metadata surat terbit.
- Audit log untuk aktivitas penting.
- Signed URL dokumen berumur 60 detik setelah otorisasi backend.

## Setup
1. Siapkan Supabase Auth dan bucket privat `esktr-documents`.
2. Isi environment sesuai `.env.example`.
3. Jalankan `npm install`, review schema Prisma, lalu siapkan migration database.
4. Buat UserProfile untuk akun Auth. Role default APPLICANT; role petugas diberikan melalui proses administrator terkontrol.
5. Jalankan `npm run dev`.

## Batasan dan status
Belum siap produksi sampai database, Supabase, migration, CI, UAT dan security review selesai. Persyaratan resmi, kewenangan pejabat, format/nomor surat, tanda tangan, masa berlaku dan retensi arsip masih perlu disahkan pemilik proses. Tidak ada data contoh atau aturan resmi yang dikarang.
Lihat `docs/OPEN-QUESTIONS.md` dan `docs/DEPLOYMENT.md`.
