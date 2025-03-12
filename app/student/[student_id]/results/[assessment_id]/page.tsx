"use client";

import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

interface AssessmentResult {
  id: number;
  student_id: string;
  assessment_id: string;
  score: number;
  feedback: string;
  completed_at: string;
  answers: Record<string, any>[];
}

export default function StudentResultsPage({ params }: { params: { student_id: string, assessment_id: string } }) {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        // This is a placeholder API endpoint - replace with your actual endpoint
        const response = await fetch(`https://alterview-api.vercel.app/api/v1/students/${params.student_id}/assessments/${params.assessment_id}/results`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch assessment results');
        }
        
        const resultData: AssessmentResult = await response.json();
        setResult(resultData);
      } catch (err) {
        setError('Error loading assessment results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [params.student_id, params.assessment_id]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-12 ${inter.className}`}
    >
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
              Assessment Results
            </h1>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 text-xl">Loading results...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            ) : (
              <div className="transition-all duration-300 ease-in-out">
                {/* Results card */}
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md border border-gray-100 mt-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Results</h3>
                  
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Student ID:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-indigo-700">{params.student_id}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Assessment ID:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-indigo-700">{params.assessment_id}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Score:</span>
                      <span className="font-mono bg-indigo-100 px-3 py-1 rounded-full text-indigo-700 font-bold">
                        {result?.score || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Completed:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-indigo-700">
                        {result?.completed_at ? new Date(result.completed_at).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Feedback</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700">{result?.feedback || 'No feedback available'}</p>
                    </div>
                  </div>
                  
                  {result?.answers && result.answers.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-700 mb-2">Answers</h4>
                      <div className="space-y-3">
                        {result.answers.map((answer, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-gray-600 font-medium mb-1">Question {index + 1}</p>
                            <p className="text-gray-700">{answer.question}</p>
                            <p className="text-gray-600 font-medium mt-2 mb-1">Your Answer</p>
                            <p className="text-gray-700">{answer.response}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 