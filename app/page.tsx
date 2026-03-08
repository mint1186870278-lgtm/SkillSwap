import ClientApp from '../components/ClientApp';

// 强制动态渲染，避免静态生成/缓存导致外部浏览器 500
export const dynamic = 'force-dynamic';

export default function Home() {
  return <ClientApp />;
}