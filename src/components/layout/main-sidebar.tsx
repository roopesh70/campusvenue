
'use client'

import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { MainSidebarNav } from './main-sidebar-nav';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useAuth } from '../providers/auth-provider';


export function MainSidebar() {
  const { user } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Building2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">CampusVenue</span>
          </Link>
          <MainSidebarNav isCollapsed userRole={user?.role} />
        </nav>
      </TooltipProvider>
    </aside>
  );
}
