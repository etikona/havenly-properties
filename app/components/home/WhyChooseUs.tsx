import Link from 'next/link';
import { Shield, Clock, Award, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

const pillars = [
  {
    icon: Shield,
    title: 'RAJUK & BNBC Compliant',
    description:
      'Every project strictly adheres to government regulations, ensuring your investment is legally sound and structurally safe.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description:
      'We have a 95%+ on-time handover record across 35+ projects spanning two decades of construction.',
  },
  {
    icon: Award,
    title: 'Award-Winning Quality',
    description:
      'REHAB-recognized developer with multiple industry awards for construction excellence and customer satisfaction.',
  },
  {
    icon: Users,
    title: 'Post-Handover Support',
    description:
      'Our relationship doesn\'t end at handover. Dedicated maintenance team available for 2 years post-possession.',
  },
];

const highlights = [
  'Transparent pricing — no hidden charges',
  'In-house architecture & engineering team',
  'Bank-approved projects for easy home loans',
  'Digital construction progress tracking',
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: image + badge */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80"
                alt="Construction excellence"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/30 to-transparent" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-2xl p-5 border border-stone-100 max-w-[180px]">
              <div className="text-3xl font-bold text-stone-900 tabular-nums">20+</div>
              <div className="text-xs text-stone-500 font-medium uppercase tracking-wide mt-1">
                Years of Trusted<br />Development
              </div>
              <div className="mt-3 h-1 w-8 bg-amber-500 rounded-full" />
            </div>

            {/* Decorative accent */}
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-xl border-4 border-amber-200 -z-10" />
          </div>

          {/* Right: content */}
          <div>
            <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-3">
              Why Choose Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-5 leading-tight">
              Building Bangladesh's<br />
              <span className="text-amber-600">Most Trusted</span> Homes
            </h2>
            <p className="text-stone-500 leading-relaxed mb-8">
              For over two decades, we've been creating spaces where families thrive —
              combining international design standards with deep understanding of Bangladeshi
              living needs and aspirations.
            </p>

            {/* Highlights */}
            <ul className="space-y-3 mb-10">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-sm text-stone-600">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-amber-700 text-white font-semibold rounded-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Our Full Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group p-6 rounded-xl border border-stone-100 hover:border-amber-200 hover:shadow-md transition-all duration-300 bg-stone-50 hover:bg-white"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-100 group-hover:bg-amber-600 flex items-center justify-center mb-4 transition-colors duration-300">
                <Icon className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm mb-2">{title}</h3>
              <p className="text-stone-500 text-xs leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
