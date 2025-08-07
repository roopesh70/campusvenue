
'use client';
import { ReactNode } from 'react';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Header } from '@/components/layout/header';
import { useAuth } from '@/components/providers/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';

function FullPageLoader() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/10">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex p-4 items-center gap-4">
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-8 w-8 rounded-lg" />
                 <Skeleton className="h-8 w-8 rounded-lg" />
                 <Skeleton className="h-8 w-8 rounded-lg" />
            </aside>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <div className="relative ml-auto flex-1 md:grow-0" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </header>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                     <Skeleton className="h-8 w-1/4" />
                     <Skeleton className="h-4 w-1/3" />
                     <Skeleton className="w-full h-[70vh]" />
                </main>
            </div>
        </div>
    )
}

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  if (!user) {
    // AuthProvider handles redirect
    return null;
  }
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/10">
      <MainSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
