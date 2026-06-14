'use client';

import { Home, Info, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  // Main navigation items (Home, About, Contact)
  const mainNavItems = [
    { label: 'Jobs', href: '/jobs', icon: <Home className="h-4 w-4" /> },
    { label: 'Reporters', href: '/reporters', icon: <Info className="h-4 w-4" /> },
    { label: 'Editors', href: '/editors', icon: <Mail className="h-4 w-4" /> },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="border-border bg-background supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <span className="text-foreground text-md leading-tight font-semibold">Court Reporting System</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Main Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
