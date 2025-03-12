"use client";

import { Inter } from "next/font/google";
import { Assistant } from "@/components/app/assistant";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

interface Assessment {
  id: number;
  created_at: string;
  name: string;
  first_question: string;
  system_prompt: string;
  mindmap_template: Record<string, any>;
}

export default function AssessmentPage({ params }: { params: { student_id: string, assessment_id: string } }) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Store student ID in localStorage for later use
    if (params.student_id) {
      localStorage.setItem('studentId', params.student_id);
    }
    
    async function fetchAssessment() {
      try {
        const response = await fetch('https://alterview-api.vercel.app/api/v1/assessments');
        
        if (!response.ok) {
          throw new Error('Failed to fetch assessment data');
        }
        
        const assessments: Assessment[] = await response.json();
        const foundAssessment = assessments.find(a => a.id.toString() === params.assessment_id);
        
        if (foundAssessment) {
          setAssessment(foundAssessment);
        } else {
          setError(`Assessment with ID ${params.assessment_id} not found`);
        }
      } catch (err) {
        setError('Error loading assessment data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAssessment();
  }, [params.assessment_id, params.student_id]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-12 ${inter.className}`}
    >
      {/* Enhanced header with gradient styling */}
      <div className="w-full max-w-4xl relative">
        {/* Apple-style purple and blue inward gradient effect */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ 
          boxShadow: `inset 0 0 80px 30px rgba(79, 70, 229, 0.15), inset 0 0 40px 20px rgba(59, 130, 246, 0.15)`,
          borderRadius: 'inherit'
        }}></div>
        
        <div className="backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20 p-8 mb-8">
          <div className="text-center">
            {/* Animated indicator */}
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse"></div>
              <span className="text-gray-700 font-medium">AlterView</span>
            </div>
            
            {/* Gradient title */}
            <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text tracking-tight">
              Assessment Portal
            </h1>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 text-xl">Loading assessment...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            ) : (
              <div className="transition-all duration-300 ease-in-out">
                <p className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-transparent bg-clip-text">
                  {assessment?.name}
                </p>
                
                {/* Student info card */}
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md border border-gray-100 mt-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Student Login</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-indigo-700">{params.student_id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Assessment:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-indigo-700">{params.assessment_id}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Assistant assessmentId={params.assessment_id} />
    </main>
  );
} 