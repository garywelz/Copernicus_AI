'use client';

import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-gray-900">Copernicus AI</span>
          </Link>
          <nav className="flex space-x-8">
            <Link href="/episodes" className="text-gray-700 hover:text-gray-900">
              Episodes
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 