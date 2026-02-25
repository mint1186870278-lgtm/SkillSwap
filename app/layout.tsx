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
  title: 'SkillSwap - 找到你的技能共鸣',
  description: '在这里，技能就是货币。免费连接、教学和学习。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={`${poppins.variable} ${nunito.variable} bg-transparent`}>
        {children}
      </body>
    </html>
  );
}