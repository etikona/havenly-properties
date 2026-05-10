'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Projects',
    href: '/projects',
    children: [
      { label: 'Ongoing', href: '/projects?category=ongoing' },
      { label: 'Upcoming', href: '/projects?category=upcoming' },
      { label: 'Completed', href: '/projects?category=completed' },
    ],
  },
  { label: 'About Us', href: '/about' },
  {
    label: 'For You',
    href: '#',
    children: [
      { label: 'Buyers', href: '/buyers' },
      { label: 'Landowners', href: '/landowners' },
    ],
  },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const isHome = pathname === '/';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || !isHome
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={cn(
              'w-9 h-9 rounded-sm flex items-center justify-center font-black text-lg transition-colors',
              scrolled || !isHome ? 'bg-amber-600 text-white' : 'bg-white text-amber-700'
            )}>
              R
            </div>
            <div className="leading-tight">
              <span className={cn(
                'block font-bold text-base tracking-tight transition-colors',
                scrolled || !isHome ? 'text-stone-900' : 'text-white'
              )}>
                RealEstate<span className="text-amber-500">BD</span>
              </span>
              <span className={cn(
                'block text-[10px] tracking-widest uppercase transition-colors',
                scrolled || !isHome ? 'text-stone-400' : 'text-white/60'
              )}>
                Premium Developers
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className={cn(
                    'flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    scrolled || !isHome
                      ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}>
                    {link.label}
                    <ChevronDown className={cn(
                      'w-3.5 h-3.5 transition-transform',
                      openDropdown === link.label ? 'rotate-180' : ''
                    )} />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-stone-100 overflow-hidden py-1 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === link.href
                      ? scrolled || !isHome ? 'text-amber-700 bg-amber-50' : 'text-white bg-white/20'
                      : scrolled || !isHome
                        ? 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="px-4 py-2 rounded-md text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-sm"
            >
              Book a Visit
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className={cn(
              'lg:hidden p-2 rounded-md transition-colors',
              scrolled || !isHome ? 'text-stone-700 hover:bg-stone-100' : 'text-white hover:bg-white/10'
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-md"
                    onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                  >
                    {link.label}
                    <ChevronDown className={cn('w-4 h-4 transition-transform', openDropdown === link.label ? 'rotate-180' : '')} />
                  </button>
                  {openDropdown === link.label && (
                    <div className="ml-4 mt-1 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-md"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-3 py-2.5 text-sm font-medium rounded-md',
                    pathname === link.href
                      ? 'text-amber-700 bg-amber-50'
                      : 'text-stone-700 hover:bg-stone-50'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 border-t border-stone-100">
              <Link
                href="/contact"
                className="block w-full text-center px-4 py-2.5 rounded-md text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
              >
                Book a Visit
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
