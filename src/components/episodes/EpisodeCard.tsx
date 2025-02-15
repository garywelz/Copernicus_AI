'use client';

import React from 'react';
import Image from 'next/image';

interface EpisodeCardProps {
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  date: string;
  url: string;
}

export function EpisodeCard({
  title,
  description,
  thumbnailUrl,
  duration,
  date,
  url,
}: EpisodeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">{description}</p>
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <span>{duration}</span>
          <span>{date}</span>
        </div>
        <a
          href={url}
          className="mt-4 block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Watch Episode
        </a>
      </div>
    </div>
  );
} 