'use client';

import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Copernicus AI</h1>
          <p className="mt-2 text-xl text-gray-600">
            Making AI Research Accessible Through Engaging Podcasts
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Latest Episode</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Placeholder for latest episode */}
            <div className="aspect-video bg-gray-200 rounded-lg mb-4">
              {/* YouTube embed will go here */}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Recent Episodes</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Episode cards will go here */}
          </div>
        </section>
      </div>
    </main>
  );
} 