import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from '@clerk/nextjs';
import NavBar from '@/components/navBar';
import PageFooter from '@/components/pageFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ask Abe',
  description: 'AI Powered Legal Education and Research. Ask Abe is a legal research and education tool that uses AI to help you better understand the complexities of the law.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ClerkProvider>

      <html lang="en">
        <link href="https://cdn.tailwindcss.com" rel="stylesheet"/>
        <body className={inter.className} style={{height: "100vh", width: "100vh"}}>
         
          {children}
          {/* <PageFooter /> */}

        </body>
        <Analytics />
      </html>
    // </ClerkProvider>
  );
}
