
'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, PlusCircle } from 'lucide-react';
import { MainSidebarNav } from '@/components/layout/main-sidebar-nav';
import { UserNav } from '@/components/layout/user-nav';
import type { User } from '@/lib/types';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { useAuth } from '../providers/auth-provider';


export function Header() {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Building2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">CampusVenue</span>
            </Link>
            <MainSidebarNav userRole={user?.role}/>
          </nav>
        </SheetContent>
      </Sheet>
       <div className="relative ml-auto flex-1 md:grow-0">
        <Button asChild>
            <Link href="/venues">
                <PlusCircle className="mr-2 h-4 w-4" />
                Book a Venue
            </Link>
        </Button>
      </div>
      {user && <UserNav user={user} />}
    </header>
  );
}
