import './globals.css';
import { Providers } from './provider';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Day 3 – Avalanche dApp',
  description: 'Frontend Web3 using wagmi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body>
        <Providers>{children}</Providers>
        <Providers>
          {children}
            <Toaster richColors position="top-left" />
          </Providers>
      </body>
    </html>
  );
}
