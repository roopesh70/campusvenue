import { getSession, User } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Header } from '@/components/layout/header';

export default async function MainLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/10">
      <MainSidebar user={session} />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header user={session} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
