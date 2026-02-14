import { ReactNode } from 'react';
import ZenNav from '../nav/ZenNav';

export default function ZenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen zen-gradient-bg">
      <ZenNav />
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
