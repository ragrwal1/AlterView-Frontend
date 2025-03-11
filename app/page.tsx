"use client";

import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-12 ${inter.className}`}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Welcome to Alterview</h1>
        <p className="text-slate-600 mb-12">
          Revolutionizing student interviews using AI
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link 
            href="/student-login" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Student Login
          </Link>
          <Link 
            href="/teacher-login" 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Teacher Login
          </Link>
        </div>
      </div>
    </main>
  );
} 