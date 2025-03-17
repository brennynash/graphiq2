'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AllProjects() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/admin/blogs');
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const { data } = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 h-48 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-lg transition-shadow"
          >
            {blog.coverImage && (
              <div className="relative aspect-video">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  {blog.topic}
                </span>
                <span className="text-gray-500 text-sm">
                  {blog.readTime} min read
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{blog.title}</h3>
              <p className="text-gray-600 line-clamp-3">
                {blog.content || 'No description available'}
              </p>
              {blog.url ? (
                <a
                  href={blog.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  Read More →
                </a>
              ) : (
                <Link
                  href={`/blog/${blog.slug}`}
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  Read More →
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
      {blogs.length === 0 && (
        <div className="text-center text-gray-600">
          No blog posts available yet.
        </div>
      )}
    </div>
  );
}
