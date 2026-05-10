import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  Projects: [
    { label: "Ongoing Projects", href: "/projects?category=ongoing" },
    { label: "Upcoming Projects", href: "/projects?category=upcoming" },
    { label: "Completed Projects", href: "/projects?category=completed" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog & News", href: "/blog" },
    { label: "Gallery", href: "/gallery" },
  ],
  Services: [
    { label: "For Buyers", href: "/buyers" },
    { label: "For Landowners", href: "/landowners" },
    { label: "Contact Us", href: "/contact" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-400">
      {/* Top bar */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Brand col */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-sm bg-amber-600 flex items-center justify-center font-black text-lg text-white">
                  R
                </div>
                <div className="leading-tight">
                  <span className="block font-bold text-base tracking-tight text-white">
                    RealEstate<span className="text-amber-500">BD</span>
                  </span>
                  <span className="block text-[10px] tracking-widest uppercase text-stone-500">
                    Premium Developers
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-stone-500 max-w-xs">
                Building trusted homes across Bangladesh since 2004. Quality
                construction, transparent process, and lasting value for every
                family.
              </p>

              {/* Contact */}
              <div className="space-y-2.5 text-sm">
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-2.5 hover:text-amber-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  +880 1700-000000
                </a>
                <a
                  href="mailto:info@realestate-bd.com"
                  className="flex items-center gap-2.5 hover:text-amber-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  info@realestate-bd.com
                </a>
                <span className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  House 12, Road 5, Gulshan 2, Dhaka 1212
                </span>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-3">
                {[
                  // { icon: Facebook, href: '#', label: 'Facebook' },
                  // { icon: Youtube, href: '#', label: 'YouTube' },
                  // { icon: Linkedin, href: '#', label: 'LinkedIn' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 rounded-md bg-stone-800 hover:bg-amber-600 flex items-center justify-center transition-colors"
                  >
                    {/* <Icon className="w-3.5 h-3.5 text-stone-400 hover:text-white" /> */}
                  </a>
                ))}
              </div>
            </div>

            {/* Links cols */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
        <span>© {year} RealEstateBD. All rights reserved. REHAB Member.</span>
        <div className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="hover:text-stone-400 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="hover:text-stone-400 transition-colors"
          >
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}
