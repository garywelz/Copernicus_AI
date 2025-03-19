import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Copernicus AI - Keeping Current With Engaging AI Podcasts",
  description: "Browse and listen to episodes from the Copernicus AI podcast",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Copernicus AI</h1>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="/" className="text-gray-600 hover:text-gray-900">Home</a></li>
                <li><a href="#episodes" className="text-gray-600 hover:text-gray-900">Episodes</a></li>
                <li><a href="#about" className="text-gray-600 hover:text-gray-900">About</a></li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">Copernicus AI</h3>
                <p className="text-gray-400">Keeping Current With Engaging AI Podcasts</p>
              </div>
              <div>
                <p className="text-gray-400">&copy; {new Date().getFullYear()} Copernicus AI. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
