import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Header } from '@/components/layout/header';
import type { User } from '@/lib/types'

export default async function MainLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user as User;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/10">
      <MainSidebar user={user} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header user={user} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
