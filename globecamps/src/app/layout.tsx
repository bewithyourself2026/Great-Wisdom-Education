import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GlobeCamps',
  description: 'Global educational camps led by professors and industry leaders',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">GlobeCamps</Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/camps">Camps</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-gray-500">© {new Date().getFullYear()} GlobeCamps</div>
        </footer>
      </body>
    </html>
  );
}