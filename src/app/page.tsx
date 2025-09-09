// src/app/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from 'next/link';

// Define a strict type for our video object
interface Video {
  video_id: string;
  thumbnail_url: string;
  title: string;
  creator_name: string;
  view_count: number;
  like_count: number;
  subscriber_count: number;
  viral_score: number;
}

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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3001/api/outliers');
        setAllVideos(response.data);
      } catch (fetchError) {
        setError("Failed to load data. Is the backend API server running?");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredVideos = useMemo(() => {
    let videos = [...allVideos];
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      videos = videos.filter(video =>
        video.title?.toLowerCase().includes(lowercasedTerm) ||
        video.creator_name?.toLowerCase().includes(lowercasedTerm)
      );
    }
    // Default sort by viral score
    videos.sort((a, b) => (b.viral_score || 0) - (a.viral_score || 0));
    return videos;
  }, [allVideos, searchTerm]);

  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* ... Navbar and Header ... */}
      <main className="container mx-auto p-4 md:p-8">
        {/* ... Title and Search Bar ... */}
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading data...</p>
        ) : error ? (
          <p className="text-center text-destructive">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredVideos.map((video) => (
              <Card key={video.video_id} className="overflow-hidden">
                <a href={`https://www.youtube.com/shorts/${video.video_id}`} target="_blank" rel="noopener noreferrer">
                  <CardHeader className="p-0 relative">
                    <img src={`https://i.ytimg.com/vi/${video.video_id}/maxresdefault.jpg`} alt={video.title} className="w-full aspect-[9/16] object-cover" />
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full text-sm">{video.viral_score ? video.viral_score.toFixed(0) : 'N/A'}</div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg h-14 overflow-hidden">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">by {video.creator_name}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground p-4 pt-0">
                    <span>{formatNumber(video.view_count)} views</span>
                    <span>{formatNumber(video.like_count)} likes</span>
                  </CardFooter>
                </a>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}