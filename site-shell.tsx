"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Leaf, ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/brand";

const indonesiaNav = [
  ["Beranda", "/"], ["Materi", "/materi"], ["Analisis", "/analisis"], ["Kumpulan Teks", "/teks"],
  ["Flashcard", "/flashcard"], ["Kuis", "/kuis"], ["Progres", "/progres"], ["Ruang Belajar", "/ruang-belajar"]
];
const arabicNav = [
  ["الرئيسية", "/"], ["المواد التعليمية", "/materi"], ["التحليل البلاغي", "/analisis"], ["النصوص", "/teks"],
  ["البطاقات التعليمية", "/flashcard"], ["الاختبار", "/kuis"], ["التقدم الدراسي", "/progres"], ["مساحة التطبيق", "/ruang-belajar"]
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const navItems = isHome ? indonesiaNav : arabicNav;
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Brand tagline={isHome ? "Belajar Balaghah, Temukan Makna" : "مِنَصَّةٌ لِتَعَلُّمِ عِلْمِ الْمَعَانِي"} />
          <button className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={isHome ? "Buka menu" : "افْتَحِ الْقَائِمَةَ"}>{open ? <X size={22}/> : <Menu size={22}/>}</button>
          <nav className={`main-nav ${open ? "nav-open" : ""}`} dir={isHome ? "ltr" : "rtl"} lang={isHome ? "id" : "ar"}>
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={pathname === href || (href !== "/" && pathname.startsWith(href)) ? "nav-link active" : "nav-link"}>{label}</Link>
            ))}
          </nav>
          <Link href="/materi" className="header-cta" dir={isHome ? "ltr" : "rtl"}>{isHome ? "Mulai belajar" : "ابدأ التعلُّم"} <ArrowUpRight size={15}/></Link>
        </div>
      </header>
      <main dir={isHome ? "ltr" : "rtl"} lang={isHome ? "id" : "ar"}>{children}</main>
      <footer className="site-footer" dir={isHome ? "ltr" : "rtl"} lang={isHome ? "id" : "ar"}>
        <div className="footer-inner">
          <div><Brand compact/><p>{isHome ? "Ruang belajar Ilmu Ma'ani yang teduh, interaktif, dan bermakna." : "مَسَاحَةٌ تَعْلِيمِيَّةٌ لِفَهْمِ عِلْمِ الْمَعَانِي وَتَذَوُّقِ جَمَالِ اللُّغَةِ الْعَرَبِيَّةِ."}</p></div>
          <div className="footer-note"><Leaf size={16}/> {isHome ? "Tumbuh bersama ilmu, memahami keindahan makna." : "بِالْعِلْمِ نَرْتَقِي، وَبِالْفَهْمِ نَتَذَوَّقُ جَمَالَ الْمَعْنَى."}</div>
          <span className="copyright">© {new Date().getFullYear()} BALACOCO</span>
        </div>
      </footer>
    </div>
  );
}
