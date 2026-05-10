'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = ['All', 'Ongoing', 'Upcoming', 'Completed'] as const;
type Category = (typeof categories)[number];

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-amber-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {project.bannerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.bannerImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center">
            <Building2 className="w-12 h-12 text-stone-300" />
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
            project.category === 'ongoing'   && 'bg-emerald-500 text-white',
            project.category === 'upcoming'  && 'bg-blue-500 text-white',
            project.category === 'completed' && 'bg-stone-700 text-white',
          )}>
            {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
          </span>
        </div>

        {/* Featured badge */}
        {project.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white">
              Featured
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 transition-colors duration-300" />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-stone-900 text-base mb-1.5 group-hover:text-amber-700 transition-colors line-clamp-1">
          {project.title}
        </h3>

        <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{project.location}</span>
        </div>

        {project.summary && (
          <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {project.summary}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
          <div className="flex gap-4 text-xs text-stone-500">
            {project.totalUnits && (
              <span><span className="font-semibold text-stone-700">{project.totalUnits}</span> Units</span>
            )}
            {project.totalArea && (
              <span><span className="font-semibold text-stone-700">{project.totalArea}</span></span>
            )}
          </div>
          <span className="text-amber-600 text-xs font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Skeleton loader
function ProjectSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-stone-100 bg-white animate-pulse">
      <div className="aspect-[4/3] bg-stone-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-stone-100 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-1/2" />
        <div className="h-3 bg-stone-100 rounded w-full" />
        <div className="h-3 bg-stone-100 rounded w-5/6" />
      </div>
    </div>
  );
}

interface Props {
  projects: Project[];
  loading?: boolean;
}

export default function FeaturedProjects({ projects, loading = false }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory.toLowerCase());

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-2">
              Our Portfolio
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors shrink-0"
          >
            View All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                activeCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-stone-500 hover:text-stone-800 border border-stone-200 hover:border-stone-300'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProjectSkeleton key={i} />)
            : filtered.length > 0
              ? filtered.map((project) => <ProjectCard key={project._id} project={project} />)
              : (
                <div className="col-span-full text-center py-16 text-stone-400">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No projects found in this category.</p>
                </div>
              )
          }
        </div>
      </div>
    </section>
  );
}
