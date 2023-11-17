'use client';
import { ThemeProviders } from '@/app/providers';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ThemeProviders>{children}</ThemeProviders>;
}
