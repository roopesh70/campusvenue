'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  DoorOpen,
  CalendarCheck,
  ShieldCheck,
  Calendar as CalendarIcon,
} from 'lucide-react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { href: '/venues', label: 'Venues', icon: DoorOpen, adminOnly: false },
  { href: '/calendar', label: 'Calendar', icon: CalendarIcon, adminOnly: false },
  { href: '/bookings', label: 'My Bookings', icon: CalendarCheck, adminOnly: false },
  { href: '/admin', label: 'Admin', icon: ShieldCheck, adminOnly: true },
];

interface NavProps {
    isCollapsed?: boolean;
    userRole?: string;
}

export function MainSidebarNav({ isCollapsed = false, userRole }: NavProps) {
  const pathname = usePathname();

  const filteredNavLinks = navLinks.filter(link => {
    if (link.adminOnly) {
      return userRole === 'Admin';
    }
    return true;
  });

  return (
    <>
      {filteredNavLinks.map((link) => {
        const isActive = pathname === link.href;

        if (isCollapsed) {
          return (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary md:h-8 md:w-8',
                    isActive && 'bg-accent text-accent-foreground'
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.label}</TooltipContent>
            </Tooltip>
          );
        } else {
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  isActive && 'bg-accent text-primary'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
        }
    })}
    </>
  );
}
