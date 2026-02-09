import './globals.css';
import type { Metadata } from 'next';
import { Poppins, Nunito } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'SkillSwap - Find Your Skill Vibe',
  description: 'The place where skills are currency. Connect, teach, and learn for free.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${nunito.variable} bg-transparent`}>
        {children}
      </body>
    </html>
  );
}