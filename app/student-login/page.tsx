"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import FloatingIcons from "@/components/app/FloatingIcons";
import { AppleInput } from "@/components/app/AppleInput";

export default function StudentLogin() {
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  // Animation on page load
  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!studentId.trim()) {
      setError("Please enter your student ID");
      return;
    }
    
    // Here you would typically validate the student ID against your backend
    // For now, we'll just navigate to the student dashboard
    router.push(`/students/${studentId}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 overflow-hidden">
      {/* Background animation */}
      <FloatingIcons />
      
      {/* Card container */}
      <div 
        className={`w-full max-w-md relative z-10 transition-all duration-700 ease-out ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Top logo section */}
        <div className="flex justify-center mb-6">
          <div className="relative h-24 w-24 animate-float">
            <Image
              src="/alterview-logo.svg"
              alt="AlterView Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        
        {/* Heading - larger and more prominent */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4 animate-fadeIn">Welcome to AlterView</h1>
          <p className="text-gray-500 text-lg animate-fadeIn" style={{ animationDelay: '100ms' }}>
            Sign in with your student ID
          </p>
        </div>

        {/* Login Form - clean white card with subtle shadow - made taller */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-8 pt-10 pb-10 mb-6 shadow-apple animate-scaleIn">
          <form onSubmit={handleSubmit}>
            <AppleInput
              label="Student ID"
              variant="default"
              inputSize="lg"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                if (error) setError("");
              }}
              error={error}
              showFocusEffect={true}
              className="text-gray-800 text-lg"
            />
            
            <div className="flex justify-center mt-10">
              <button
                className={`w-full py-3.5 rounded-xl text-white font-medium text-lg transition-all duration-300 button-shine
                ${studentId.trim() 
                  ? 'bg-alterview-gradient hover:shadow-md' 
                  : 'bg-gray-300 cursor-not-allowed'}`}
                type="submit"
                disabled={!studentId.trim()}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
        
        {/* Back link */}
        <div className="text-center animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <Link
            href="/"
            className="inline-flex items-center justify-center text-alterview-indigo hover:text-alterview-violet transition-colors apple-hover"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 