"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftCircle, BookOpen, ChevronRight, LogOut, History, ExternalLink } from "lucide-react";
import FloatingIcons from "@/components/app/FloatingIcons";

// Mock data for assessments
const mockAssessments = [
  { 
    id: "1", 
    title: "Data Structures and Algorithms",
    course: "CSE 310",
    dueDate: "March 15, 2023",
    status: "Not Started"
  },
  { 
    id: "2", 
    title: "Mathematics Assessment",
    course: "MATH 241",
    dueDate: "March 18, 2023",
    status: "Not Started"
  },
  { 
    id: "3", 
    title: "Science Evaluation",
    course: "SCI 201",
    dueDate: "March 20, 2023",
    status: "Not Started"
  },
];

export default function StudentDashboard({
  params,
}: {
  params: { student_id: string };
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-10rem)] px-4 py-8 overflow-hidden">
      {/* Background animation */}
      <FloatingIcons />
      
      {/* Main container */}
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header section with welcome message */}
        <div 
          className={`transition-all duration-700 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-gray-900 mb-3 animate-fadeIn">
              Welcome, Student
            </h1>
            <div className="flex items-center space-x-4">
              <p className="text-gray-500 text-lg animate-fadeIn" style={{ animationDelay: '100ms' }}>
                ID: {params.student_id}
              </p>
              <Link
                href="/"
                className="inline-flex items-center text-sm text-alterview-indigo hover:text-alterview-violet transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Assessments section */}
        <div 
          className={`bg-white/90 backdrop-blur-md rounded-2xl mb-6 shadow-apple animate-scaleIn overflow-hidden transition-all duration-700 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ animationDelay: '100ms' }}
        >
          {/* Section header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-alterview-indigo mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Your Assessments</h2>
            </div>
            <span className="text-sm text-gray-500">{mockAssessments.length} total</span>
          </div>

          {/* Assessment list */}
          {mockAssessments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {mockAssessments.map((assessment, index) => (
                <div
                  key={assessment.id}
                  className="hover:bg-gray-50/80 transition-colors"
                  style={{ animationDelay: `${150 + index * 50}ms` }}
                >
                  <div className="px-8 py-5 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{assessment.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-3">
                        <span>{assessment.course}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                        <span>Due: {assessment.dueDate}</span>
                      </div>
                    </div>
                    <Link
                      href={`/assessment/${params.student_id}/${assessment.id}`}
                      className="flex items-center px-5 py-2.5 bg-alterview-gradient text-white rounded-xl hover:shadow-md transition-all duration-300 group"
                    >
                      <span>Start</span>
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-8 py-12 text-center">
              <p className="text-gray-500">
                No assessments available at this time.
              </p>
            </div>
          )}
        </div>
        
        {/* Past Attempts section */}
        <div 
          className={`bg-white/90 backdrop-blur-md rounded-2xl mb-6 shadow-apple animate-scaleIn overflow-hidden transition-all duration-700 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ animationDelay: '200ms' }}
        >
          {/* Section header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <History className="h-5 w-5 text-alterview-violet mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Past Attempts</h2>
            </div>
            <button 
              className="text-sm text-alterview-indigo hover:text-alterview-violet transition-colors flex items-center"
            >
              <span>View all</span>
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </button>
          </div>

          {/* Empty state for now */}
          <div className="px-8 py-10 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No past attempts yet</h3>
                <p className="text-gray-500 text-sm">
                  After you complete an assessment, your attempts will appear here for review.
                </p>
              </div>
              
              <button 
                className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-alterview-indigo border border-alterview-indigo/30 rounded-xl hover:bg-alterview-indigo/5 transition-colors"
              >
                <History className="h-4 w-4 mr-2" />
                Browse your history
              </button>
            </div>
          </div>
        </div>
        
        {/* Back to home link */}
        <div className="text-center animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <Link
            href="/"
            className="inline-flex items-center justify-center text-alterview-indigo hover:text-alterview-violet transition-colors apple-hover"
          >
            <ArrowLeftCircle className="h-4 w-4 mr-1" />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
