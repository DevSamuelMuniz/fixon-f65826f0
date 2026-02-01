import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { DynamicSEO } from '@/components/DynamicSEO';
import { NicheSwitcher } from '@/components/NicheSwitcher';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function Layout({ children, title, description }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <DynamicSEO title={title} description={description} />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <NicheSwitcher />
    </div>
  );
}
