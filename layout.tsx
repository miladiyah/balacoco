import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "BALACOCO — منصة علم المعاني",
  description: "مِنَصَّةٌ تَفَاعُلِيَّةٌ لِتَعَلُّمِ عِلْمِ الْمَعَانِي وَتَحْلِيلِ النُّصُوصِ الْعَرَبِيَّةِ.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><SiteShell>{children}</SiteShell></body></html>;
}
