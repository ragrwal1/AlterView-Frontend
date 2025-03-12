import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alterview - AI-Powered Student Assessments",
  description: "Revolutionizing student assessments using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <header className="w-full bg-white shadow-soft py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <div className="relative h-20 w-20">
                  <Image
                    src="/alterview-logo.svg"
                    alt="Alterview Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-alterview-gradient -ml-1">
                  AlterView
                </span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/student-login"
                  className="text-gray-700 hover:text-alterview-indigo transition-colors"
                >
                  For Students
                </Link>
                <Link
                  href="/teacher-login"
                  className="text-gray-700 hover:text-alterview-indigo transition-colors"
                >
                  For Teachers
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-grow">{children}</main>
          <footer className="bg-white py-6 border-t border-gray-200">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Alterview. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
