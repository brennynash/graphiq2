"use client";

import { ArrowLeft } from "lucide-react";
import Partners from "./Partners";
import { partnerItems } from "@/constants";
import Button from "@/components/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Trending({ trendingRef }) {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/trends');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch trends');
        }

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error('Invalid response format');
        }

        setTrends(result.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching trends:', error);
        setError(error.message);
        setTrends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-gray-500">
        Failed to load trends. Please try again later.
      </div>
    );
  }

  if (trends.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No trends available at the moment.
      </div>
    );
  }

  return (
    <div ref={trendingRef} className="transition-colors duration-500 overflow-hidden">
      <div className="flex justify-between items-center mb-8 w-full py-4">
        <h1 className="text-4xl font-medium lg:text-6xl">What's trending</h1>
        <div className="hidden items-center lg:flex">
          <Button
            id="menu-button"
            title="What's trending"
            containerClass="flex items-center justify-center px-7 py-3"
          />
          <Button
            id="arrow-button"
            title={<ArrowLeft size={16} color="#111827" />}
            containerClass="flex items-center justify-center p-2 rounded-full"
          />
        </div>
      </div>
      <div className="relative w-full overflow-hidden overflow-x-scroll hidden-scrollbar flex items-center gap-6">
        {trends.map((trend) => (
          <Link
            key={trend.id}
            href={trend.href || "#"}
            className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 min-w-[300px]"
          >
            {trend.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={trend.image}
                  alt={trend.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mt-2">{trend.title}</h3>
              {trend.description && (
                <p className="text-gray-600 mt-2">{trend.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
      {partnerItems.map((item) => (
        <Partners key={item.title} partner={item} />
      ))}
    </div>
  );
}
