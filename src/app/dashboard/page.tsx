'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Video = {
  video_id: string;
  thumbnail_url?: string;
  title: string;
  creator_name: string;
  view_count: number;
  like_count: number;
  subscriber_count: number;
  viral_score: number;
};

// Helper: format numbers
const formatNumber = (num: number): string => {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function DashboardPage() {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Video; label: string }>({ key: 'viral_score', label: 'Viral Score' });

  // --- Debounce search input ---
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // --- Fetch data ---
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3001/api/outliers');
        setAllVideos(response.data);
      } catch (err) {
        setError("Failed to load data. Is the backend API running?");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- Filter & Sort ---
  const sortedAndFilteredVideos = useMemo(() => {
    let videos = [...allVideos];
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      videos = videos.filter(v =>
        v.title?.toLowerCase().includes(term) ||
        v.creator_name?.toLowerCase().includes(term)
      );
    }
    videos.sort((a, b) => (b[sortConfig.key] ?? 0) - (a[sortConfig.key] ?? 0));
    return videos;
  }, [allVideos, debouncedSearch, sortConfig]);

  return (
    <div className="bg-background min-h-screen text-foreground">
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">NicheFire</Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center my-8">
          <h2 className="text-5xl font-bold tracking-tighter">Outlier Dashboard</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto mb-12">
          <Input
            type="search"
            placeholder="Search by title or creator..."
            className="flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort by: {sortConfig.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortConfig({ key: 'viral_score', label: 'Viral Score' })}>Viral Score</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortConfig({ key: 'view_count', label: 'Views' })}>Views</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortConfig({ key: 'like_count', label: 'Likes' })}>Likes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortConfig({ key: 'subscriber_count', label: 'Subscribers' })}>Subscribers</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-16">Loading data...</p>
        ) : error ? (
          <p className="text-center text-destructive py-16">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedAndFilteredVideos.length > 0 ? (
              sortedAndFilteredVideos.map((video) => (
                <motion.div
                  key={video.video_id}
                  className="overflow-hidden border-border hover:border-primary transition-colors group rounded-xl shadow-md"
                  whileHover={{ scale: 1.03 }}
                >
                  <a href={`https://www.youtube.com/shorts/${video.video_id}`} target="_blank" rel="noopener noreferrer">
                    <CardHeader className="p-0 relative">
                      <img
                        src={`https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`}
                        alt={video.title}
                        loading="lazy"
                        className="w-full aspect-[9/16] object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-xl"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/fallback-thumbnail.jpg'; }}
                      />
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full text-sm shadow-lg animate-pulse">
                        {video.viral_score ? video.viral_score.toFixed(0) : 'N/A'}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg h-14 overflow-hidden leading-tight">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 truncate">by {video.creator_name}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between text-sm text-muted-foreground p-4 pt-0">
                      <span>{formatNumber(video.view_count)} views</span>
                      <span>{formatNumber(video.like_count)} likes</span>
                      <span>{formatNumber(video.subscriber_count)} subs</span>
                    </CardFooter>
                  </a>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-16">
                <h3 className="text-lg font-semibold">No Results Found</h3>
                <p>Try adjusting your search or run the backend bots to find more outliers.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
