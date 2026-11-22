import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "E-SKTR | Kabupaten Temanggung",
  description: "Layanan administrasi Surat Keterangan Terdaftar dan rekomendasi lembaga pendidikan keagamaan Kabupaten Temanggung.",
  applicationName: "E-SKTR",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
