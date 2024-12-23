import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-white hover:opacity-80 transition-opacity">
        UnderlayX
        </Link>
      </div>
    </nav>
  );
}
