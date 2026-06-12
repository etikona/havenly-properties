// app/about/AboutClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Users,
  Home,
  Clock,
  CheckCircle,
  TrendingUp,
  Shield,
  Heart,
  Building,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";

export default function AboutClient() {
  const stats = [
    { value: "20+", label: "Years of Excellence", icon: Award },
    { value: "5000+", label: "Happy Families", icon: Users },
    { value: "50+", label: "Completed Projects", icon: Home },
    { value: "200+", label: "Team Members", icon: Users },
  ];

  const values = [
    {
      title: "Quality Construction",
      description:
        "We use premium materials and international standards in all our projects.",
      icon: Shield,
    },
    {
      title: "Transparent Process",
      description:
        "Clear communication and honest dealings with all our clients.",
      icon: CheckCircle,
    },
    {
      title: "Customer First",
      description: "Your satisfaction and trust are our top priorities.",
      icon: Heart,
    },
    {
      title: "Innovation",
      description:
        "Embracing modern technology and sustainable building practices.",
      icon: TrendingUp,
    },
  ];

  const milestones = [
    {
      year: "2004",
      title: "Company Founded",
      description:
        "Started operations in Dhaka with first residential project.",
    },
    {
      year: "2008",
      title: "First Major Project",
      description: "Completed Green Valley, our flagship residential complex.",
    },
    {
      year: "2012",
      title: "Expansion",
      description: "Expanded operations to Chattogram and Sylhet.",
    },
    {
      year: "2016",
      title: "500 Homes Delivered",
      description: "Reached milestone of 500 successful deliveries.",
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Launched online property management system.",
    },
    {
      year: "2024",
      title: "1000+ Happy Families",
      description: "Celebrated 20 years of building dreams.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-900 to-amber-800 text-white py-20">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About RealEstateBD
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Building trusted homes across Bangladesh since 2004. Quality
            construction, transparent process, and lasting value for every
            family.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-amber-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2004, RealEstateBD began with a simple mission: to
                provide quality housing solutions that Bangladeshi families can
                trust. What started as a small real estate consultancy has grown
                into one of the countrys most respected property developers.
              </p>
              <p>
                Over the past two decades, we have completed over 50 residential
                and commercial projects across Dhaka, Chattogram, Sylhet, and
                other major cities. Our commitment to quality construction,
                timely delivery, and customer satisfaction has earned us the
                trust of thousands of families.
              </p>
              <p>
                Today, RealEstateBD stands as a symbol of reliability in
                Bangladeshs real estate sector. We are proud to be a REHAB
                member and continue to set new standards in property
                development.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700"
              >
                View Our Projects <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700"
              >
                Contact Us <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="RealEstateBD Story"
              className="object-cover"
              fill
            />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from project planning to
              customer service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center"
                >
                  <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Milestones */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Key milestones that have shaped our companys growth and success.
          </p>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-amber-200 h-full hidden lg:block" />

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row ${index % 2 === 0 ? "lg:justify-start" : "lg:justify-end"} relative`}
              >
                <div className="lg:w-1/2 p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {milestone.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
                {/* Timeline dot */}
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-600 rounded-full mt-6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose RealEstateBD?
            </h2>
            <p className="text-amber-100 max-w-2xl mx-auto">
              Discover what makes us Bangladeshs preferred real estate partner.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Building className="w-12 h-12 mx-auto mb-4 text-amber-300" />
              <h3 className="text-xl font-bold mb-2">Quality Assurance</h3>
              <p className="text-amber-100">
                International standard construction with premium materials and
                expert supervision.
              </p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-amber-300" />
              <h3 className="text-xl font-bold mb-2">Timely Delivery</h3>
              <p className="text-amber-100">
                95% of our projects delivered on or before schedule with zero
                compromise on quality.
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-amber-300" />
              <h3 className="text-xl font-bold mb-2">Value Appreciation</h3>
              <p className="text-amber-100">
                Properties in prime locations with proven ROI and excellent
                appreciation potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Leadership Team
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the experts driving RealEstateBDs vision and success.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Md. Rahman",
              role: "CEO & Founder",
              experience: "25+ years in real estate",
            },
            {
              name: "Farhana Ahmed",
              role: "Head of Operations",
              experience: "15 years in project management",
            },
            {
              name: "Kazi Hasan",
              role: "Chief Architect",
              experience: "20 years in architectural design",
            },
          ].map((leader, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl font-bold text-amber-600">
                  {leader.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {leader.name}
              </h3>
              <p className="text-amber-600 font-semibold mb-2">{leader.role}</p>
              <p className="text-gray-500 text-sm">{leader.experience}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications & Memberships */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Certifications & Memberships
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence is recognized by industry bodies.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white rounded-lg px-6 py-3 shadow-sm">
              <span className="font-semibold text-gray-800">REHAB Member</span>
            </div>
            <div className="bg-white rounded-lg px-6 py-3 shadow-sm">
              <span className="font-semibold text-gray-800">
                ISO 9001:2015 Certified
              </span>
            </div>
            <div className="bg-white rounded-lg px-6 py-3 shadow-sm">
              <span className="font-semibold text-gray-800">
                Bangladesh Green Building Council
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Let our experts guide you through our premium properties and
            investment opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="bg-white text-amber-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Projects
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
