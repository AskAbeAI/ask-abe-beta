'use client';

import { SignIn } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes';

export default function Page() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center h-screen dark:bg-zinc-800">
      {theme === 'light' ? (
        <SignIn />
      ) : (
        <SignIn appearance={{ baseTheme: dark }} />
      )}
    </div>
  );
}
