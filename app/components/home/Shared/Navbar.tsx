"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown, Diamond } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Projects",
    href: "/projects",
  },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 80);

      if (currentScrollY > lastScrollY && currentScrollY > 400) {
        setVisible(false);
        setOpenDropdown(null);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setVisible(true);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        visible ? "translate-y-0" : "-translate-y-full",
        scrolled || !isHome
          ? "bg-white/90 backdrop-blur-xl border-b border-stone-100/50"
          : "bg-transparent",
        scrolled ? "py-0 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.05)]" : "py-0",
      )}
    >
      <nav className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Refined */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className={cn(
                "relative w-10 h-10 flex items-center justify-center font-serif text-xl transition-all duration-700",
                scrolled || !isHome ? "text-amber-700" : "text-white",
              )}
            >
              <Diamond className="w-10 h-10 absolute" />
              <span className="relative z-10 text-sm font-bold">R</span>
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-serif text-lg tracking-[0.02em] transition-colors duration-700",
                  scrolled || !isHome ? "text-stone-900" : "text-white",
                )}
              >
                RealEstate<span className="text-amber-500">BD</span>
              </span>
              <span
                className={cn(
                  "text-[10px] tracking-[0.2em] uppercase font-light transition-colors duration-700",
                  scrolled || !isHome ? "text-stone-400" : "text-white/70",
                )}
              >
                Premium Developers
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered & Refined */}
          <div className="hidden lg:flex items-center gap-0">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 mx-1 text-[13px] tracking-[0.02em] font-medium transition-all duration-300 relative group",
                      scrolled || !isHome
                        ? "text-stone-600 hover:text-stone-900"
                        : "text-white/80 hover:text-white",
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-300",
                        openDropdown === link.label ? "rotate-180" : "",
                      )}
                    />
                    <span
                      className={cn(
                        "absolute bottom-0 left-4 right-4 h-[1px] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100",
                        scrolled || !isHome ? "bg-stone-300" : "bg-white/50",
                      )}
                    />
                  </button>
                  {openDropdown === link.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-stone-100 overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-white border-l border-t border-stone-100" />
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-3 text-[13px] text-stone-600 hover:text-amber-700 hover:bg-amber-50/50 transition-all duration-200 relative group/child"
                        >
                          <span className="relative z-10">{child.label}</span>
                          <span className="absolute inset-0 bg-amber-50/0 group-hover/child:bg-amber-50/50 transition-colors duration-200" />
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
                    "relative px-4 py-2 mx-1 text-[13px] tracking-[0.02em] font-medium transition-all duration-300 group",
                    pathname === link.href
                      ? scrolled || !isHome
                        ? "text-amber-700"
                        : "text-white"
                      : scrolled || !isHome
                        ? "text-stone-600 hover:text-stone-900"
                        : "text-white/80 hover:text-white",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-4 right-4 h-[1px] transition-transform duration-300 origin-left",
                      pathname === link.href
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                      pathname === link.href
                        ? "bg-amber-600"
                        : scrolled || !isHome
                          ? "bg-stone-300"
                          : "bg-white/50",
                    )}
                  />
                </Link>
              ),
            )}
          </div>

          {/* CTA - Refined */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/contact"
              className="group relative px-6 py-2.5 text-[13px] tracking-[0.02em] font-medium text-white overflow-hidden rounded-full bg-stone-900 hover:bg-stone-800 transition-all duration-300"
            >
              <span className="relative z-10">Book a Visit</span>
              <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className={cn(
              "lg:hidden p-2 rounded-full transition-all duration-300",
              scrolled || !isHome
                ? "text-stone-700 hover:bg-stone-100"
                : "text-white hover:bg-white/10",
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu - Refined */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-stone-100 animate-in slide-in-from-top-2 duration-300">
          <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    className="flex items-center justify-between w-full px-4 py-3 text-[13px] tracking-[0.02em] font-medium text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === link.label ? null : link.label,
                      )
                    }
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        openDropdown === link.label ? "rotate-180" : "",
                      )}
                    />
                  </button>
                  {openDropdown === link.label && (
                    <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-1 duration-200">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-[13px] text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
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
                    "block px-4 py-3 text-[13px] tracking-[0.02em] font-medium rounded-lg transition-all",
                    pathname === link.href
                      ? "text-amber-700 bg-amber-50"
                      : "text-stone-700 hover:bg-stone-50",
                  )}
                >
                  {link.label}
                </Link>
              ),
            )}
            <div className="pt-4 mt-4 border-t border-stone-100">
              <Link
                href="/contact"
                className="block w-full text-center px-6 py-3 text-[13px] tracking-[0.02em] font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-full transition-all"
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
