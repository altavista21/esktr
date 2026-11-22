import { ArrowRight, FileCheck2, Landmark, ShieldCheck } from "lucide-react";
const services = [
  { icon: FileCheck2, title: "Pengajuan layanan", description: "Ajukan permohonan layanan administrasi lembaga secara daring." },
  { icon: ShieldCheck, title: "Verifikasi berkas", description: "Pantau proses pemeriksaan dokumen melalui akun pemohon." },
  { icon: Landmark, title: "Informasi layanan", description: "Dapatkan informasi proses dan status permohonan dalam satu tempat." },
];
export default function HomePage() {
  return <main className="min-h-screen">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8"><div><p className="text-lg font-bold tracking-tight text-slate-900">E-SKTR</p><p className="text-xs text-slate-500">Kabupaten Temanggung</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">Persiapan layanan</span></div></header>
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-24">
      <div><p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Pelayanan administrasi digital</p><h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">Layanan Surat Keterangan Terdaftar dan Rekomendasi</h1><p className="mt-6 max-w-xl text-base leading-7 text-slate-600">Portal layanan untuk Pondok Pesantren, Madrasah Diniyah Takmiliyah, dan Taman Pendidikan Al-Qur’an di lingkungan Kementerian Agama Kabupaten Temanggung.</p><div className="mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-600">Layanan belum dibuka <ArrowRight size={16} aria-hidden="true" /></div><p className="mt-3 text-xs text-slate-500">Informasi persyaratan dan pembukaan layanan menunggu konfirmasi pengelola.</p></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="text-sm font-semibold text-slate-900">Jenis lembaga</p><ul className="mt-5 space-y-4">{["Pondok Pesantren", "Madrasah Diniyah Takmiliyah", "Taman Pendidikan Al-Qur’an"].map((item) => <li key={item} className="flex items-start gap-3 text-sm text-slate-700"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />{item}</li>)}</ul><div className="mt-7 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500">Kementerian Agama Republik Indonesia<br />Kabupaten Temanggung</div></div>
    </section>
    <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8"><div className="grid gap-4 md:grid-cols-3">{services.map(({ icon: Icon, title, description }) => <article key={title} className="rounded-xl border border-slate-200 bg-white p-6"><Icon className="text-emerald-700" size={22} aria-hidden="true" /><h2 className="mt-4 font-semibold text-slate-900">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></article>)}</div></section>
    <footer className="border-t border-slate-200 bg-white"><div className="mx-auto max-w-6xl px-5 py-6 text-xs text-slate-500 sm:px-8">E-SKTR Kabupaten Temanggung. Informasi layanan resmi menunggu validasi pengelola.</div></footer>
  </main>;
}
