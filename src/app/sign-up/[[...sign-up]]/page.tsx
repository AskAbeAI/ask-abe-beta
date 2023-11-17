'use client';

import { SignUp } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes';

export default function Page() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center h-screen dark:bg-zinc-800">
      {theme === 'light' ? (
        <SignUp />
      ) : (
        <SignUp appearance={{ baseTheme: dark }} />
      )}
    </div>
  );
}
