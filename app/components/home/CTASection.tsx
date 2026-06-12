import Link from "next/link";
import { Home, Landmark, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-stone-950 relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Get Started Today
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Journey Begins Here
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto text-base">
            Whether you are looking to buy your dream home or develop your land
            — we have the expertise and resources to make it happen.
          </p>
        </div>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Buyers */}
          <div className="group relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80"
                alt="Buyers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/20" />
            </div>
            <div className="relative z-10 p-8 min-h-[280px] flex flex-col justify-end">
              <div className="w-10 h-10 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mb-4">
                <Home className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                For Home Buyers
              </h3>
              <p className="text-stone-300 text-sm mb-5 leading-relaxed">
                Explore payment plans, bank loan options, and required
                documents. Our team guides you through every step of the
                purchase process.
              </p>
              <Link
                href="/buyers"
                className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm hover:text-amber-300 transition-colors group-hover:gap-3"
              >
                Buyers Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Landowners */}
          <div className="group relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
                alt="Landowners"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/20" />
            </div>
            <div className="relative z-10 p-8 min-h-[280px] flex flex-col justify-end">
              <div className="w-10 h-10 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mb-4">
                <Landmark className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                For Landowners
              </h3>
              <p className="text-stone-300 text-sm mb-5 leading-relaxed">
                Partner with us through our Joint Venture program. Get up to 40%
                of developed units with zero upfront investment.
              </p>
              <Link
                href="/landowners"
                className="inline-flex items-center gap-2 text-amber-400 font-semibold text-sm hover:text-amber-300 transition-colors group-hover:gap-3"
              >
                JV Proposal Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
