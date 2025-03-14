'use client';

import React from 'react';

interface PlaceholderImageProps {
  title: string;
  className?: string;
}

export function PlaceholderImage({ title, className = '' }: PlaceholderImageProps) {
  return (
    <div 
      className={`bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white ${className}`}
    >
      <span className="text-lg font-medium px-4 text-center">
        {title}
      </span>
    </div>
  );
} 