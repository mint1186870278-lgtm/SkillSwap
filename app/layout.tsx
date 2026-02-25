import './globals.css';
import { Inter, Poppins, Nunito, Noto_Sans_SC } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto',
});

export const metadata: Metadata = {
  title: 'SkillSwap - Find Your Skill Soulmate',
  description: 'The place where skills are currency. Connect, teach, and learn for free.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${nunito.variable} ${notoSansSC.variable} font-sans bg-transparent`}>
        {children}
      </body>
    </html>
  );
}