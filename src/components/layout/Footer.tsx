'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Copernicus AI</h3>
            <p className="mt-2 text-gray-600">
              Making AI Research Accessible Through Engaging Podcasts
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="/episodes" className="text-gray-600 hover:text-gray-900">
                  Episodes
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Connect</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="https://twitter.com/CopernicusAI" className="text-gray-600 hover:text-gray-900">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://youtube.com/@CopernicusAI" className="text-gray-600 hover:text-gray-900">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          © {new Date().getFullYear()} Copernicus AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 