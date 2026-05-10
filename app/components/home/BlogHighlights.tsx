import Link from 'next/link';
import { ArrowRight, Calendar, Eye, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

function BlogCard({ blog, featured = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className={`group flex flex-col bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${featured ? 'lg:flex-row' : ''}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2 aspect-[4/3] lg:aspect-auto' : 'aspect-[16/9]'}`}>
        {blog.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center">
            <Tag className="w-10 h-10 text-amber-200" />
          </div>
        )}
        {blog.category && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white">
              {blog.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-5 flex flex-col flex-1 ${featured ? 'lg:p-8 lg:justify-center' : ''}`}>
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-stone-400 mb-3">
          {blog.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(blog.publishedAt)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {blog.views.toLocaleString()} views
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-bold text-stone-900 group-hover:text-amber-700 transition-colors mb-2 line-clamp-2 ${featured ? 'text-xl sm:text-2xl' : 'text-base'}`}>
          {blog.title}
        </h3>

        {/* Excerpt */}
        {blog.excerpt && (
          <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {blog.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
          <span className="text-xs text-stone-400 font-medium">{blog.author}</span>
          <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-semibold group-hover:gap-2 transition-all">
            Read More <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function BlogSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`rounded-xl overflow-hidden border border-stone-100 bg-white animate-pulse ${featured ? 'lg:flex' : ''}`}>
      <div className={`bg-stone-100 ${featured ? 'lg:w-1/2 aspect-[4/3]' : 'aspect-[16/9]'}`} />
      <div className="p-5 space-y-3 flex-1">
        <div className="h-3 bg-stone-100 rounded w-1/3" />
        <div className="h-5 bg-stone-100 rounded w-full" />
        <div className="h-5 bg-stone-100 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-full" />
        <div className="h-3 bg-stone-100 rounded w-5/6" />
      </div>
    </div>
  );
}

interface Props {
  blogs: Blog[];
  loading?: boolean;
}

export default function BlogHighlights({ blogs, loading = false }: Props) {
  const [featured, ...rest] = blogs;

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest mb-2">
              Latest Articles
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
              Blog & News
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors shrink-0"
          >
            All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-6">
            <BlogSkeleton featured />
            <div className="grid sm:grid-cols-2 gap-6">
              <BlogSkeleton />
              <BlogSkeleton />
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <p>No articles published yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Featured (first) blog — full width, horizontal */}
            {featured && <BlogCard blog={featured} featured />}

            {/* Rest — 2 columns */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-6">
                {rest.slice(0, 2).map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
