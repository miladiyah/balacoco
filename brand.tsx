import Link from "next/link";

export function CoconutMark({ size = 42 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="BALACOCO" role="img">
      <path d="M29 18C20 9 10 12 8 21c8-1 15 1 21 7" fill="#78977C" />
      <path d="M31 19C29 8 36 3 45 5c-4 7-6 13-6 20" fill="#9DB99D" />
      <path d="M34 22C40 12 51 13 56 21c-8 0-14 3-19 9" fill="#5F8468" />
      <path d="M14 31c0-11 8-18 19-18 12 0 20 8 20 19 0 13-9 22-20 22S14 45 14 31Z" fill="#8B6548" />
      <path d="M21 31c0-8 5-13 12-13 8 0 13 6 13 14 0 9-6 16-13 16s-12-7-12-17Z" fill="#F4E9D5" />
      <path d="M27 28c3-3 8-3 11 0" stroke="#D7C5A7" strokeWidth="2" strokeLinecap="round" />
      <circle cx="29" cy="36" r="1.7" fill="#8B6548" />
      <circle cx="37" cy="36" r="1.7" fill="#8B6548" />
      <path d="M30 41c2 2 4 2 6 0" stroke="#8B6548" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function Brand({ compact = false, tagline = "Belajar Balaghah, Temukan Makna" }: { compact?: boolean; tagline?: string }) {
  return (
    <Link href="/" className={`brand ${compact ? "brand-compact" : ""}`} aria-label="BALACOCO">
      <CoconutMark size={compact ? 34 : 42} />
      <span className="brand-wordmark">
        <strong>BALACOCO</strong>
        {!compact && <small>{tagline}</small>}
      </span>
    </Link>
  );
}
