import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nisshimbo Inventory · Interactive Prototype',
  description: 'A working, role-aware prototype of the Nisshimbo Inventory app, with a separate high-resolution design index.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
