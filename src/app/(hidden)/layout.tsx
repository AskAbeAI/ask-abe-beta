import '../globals.css';
import { Inter } from 'next/font/google';
import type { Metadata, ResolvingMetadata } from 'next'

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
      <html lang="en">
        <link rel="stylesheet" href="/styles.css"></link>
        <body className={inter.className} style={{ width: '100%', minHeight: '100vh' }}>
         
          {children}
         

        </body>
      </html>
    
  );
}
