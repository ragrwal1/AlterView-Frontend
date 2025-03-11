"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between mb-20">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-alterview-blue">Revolutionizing</span> <br />
            <span className="bg-clip-text text-transparent bg-alterview-gradient">Student Interviews</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Empowering educators with AI-powered interview assessments that provide deeper insights into student understanding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/student-login" 
              className="px-8 py-3 bg-alterview-indigo hover:bg-alterview-violet text-white rounded-lg font-medium transition-colors shadow-soft text-center"
            >
              Student Portal
            </Link>
            <Link 
              href="/teacher-login" 
              className="px-8 py-3 border-2 border-alterview-indigo text-alterview-indigo hover:bg-alterview-indigo hover:text-white rounded-lg font-medium transition-colors text-center"
            >
              Teacher Portal
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative h-80 w-80">
            <Image
              src="/alterview-logo.svg"
              alt="Alterview"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Makes Alterview Special</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-card hover:shadow-lg transition-shadow">
            <div className="bg-alterview-blue/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-alterview-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">AI-Powered Conversations</h3>
            <p className="text-gray-600">Natural, adaptive interview experiences that respond intelligently to student answers.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-card hover:shadow-lg transition-shadow">
            <div className="bg-alterview-indigo/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-alterview-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Detailed Assessments</h3>
            <p className="text-gray-600">Comprehensive reports and insights that help teachers understand their students better.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-card hover:shadow-lg transition-shadow">
            <div className="bg-alterview-purple/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-alterview-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Seamless Experience</h3>
            <p className="text-gray-600">Easy to use platform for both students and teachers with minimal setup required.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-alterview-blue via-alterview-indigo to-alterview-purple rounded-xl p-10 text-white text-center shadow-card">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Student Interviews?</h2>
        <p className="mb-8 max-w-lg mx-auto">Join educators who are revolutionizing the way they assess student understanding.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/teacher-login" 
            className="px-8 py-3 bg-white text-alterview-indigo hover:bg-gray-100 rounded-lg font-medium transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
} 