"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftCircle, LogOut, BookOpen, ChevronRight, Plus, Users } from "lucide-react";
import FloatingIcons from "@/components/app/FloatingIcons";
import { fetchTeacherAssessments } from "@/services/assessmentService";

// We will replace this with real data from the API
// Keeping it as a fallback in case the API fails
const mockAssessments = [
  {
    id: "assessment1",
    title: "Data Structures and Algorithms",
    course: "CSE 310",
    students: 15,
    lastUpdated: "Feb 28, 2023"
  },
  { 
    id: "assessment2", 
    title: "Mathematics Assessment", 
    course: "MATH 241",
    students: 22,
    lastUpdated: "Mar 2, 2023"
  },
  { 
    id: "assessment3", 
    title: "Science Evaluation", 
    course: "SCI 201",
    students: 18,
    lastUpdated: "Mar 5, 2023"
  },
];

export default function TeacherDashboard({
  params,
}: {
  params: { teacher_id: string };
}) {
  const [loaded, setLoaded] = useState(false);
  const [assessments, setAssessments] = useState(mockAssessments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoaded(true);
    
    const loadAssessments = async () => {
      try {
        const data = await fetchTeacherAssessments(params.teacher_id);
        setAssessments(data);
        setError(null);
      } catch (err) {
        console.error("Error loading assessments:", err);
        setError("Failed to load assessments. Using sample data instead.");
        // Keep using mockAssessments as fallback
      } finally {
        setLoading(false);
      }
    };
    
    loadAssessments();
  }, [params.teacher_id]);

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 mb-3 animate-fadeIn">
                Teacher Dashboard
              </h1>
              <p className="text-gray-500 text-lg animate-fadeIn" style={{ animationDelay: '100ms' }}>
                ID: {params.teacher_id}
              </p>
              {error && (
                <p className="text-amber-600 text-sm mt-2 animate-fadeIn">
                  {error}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href={`/teacher/${params.teacher_id}/create-assessment`}
                className="inline-flex items-center px-5 py-2.5 bg-alterview-gradient text-white rounded-xl hover:shadow-md transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: '150ms' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Create New Assessment</span>
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center p-2.5 text-alterview-indigo hover:text-alterview-violet transition-colors rounded-xl hover:bg-gray-50 animate-fadeIn"
                style={{ animationDelay: '200ms' }}
              >
                <LogOut className="h-5 w-5" />
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
            <span className="text-sm text-gray-500">{assessments.length} total</span>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="px-8 py-12 flex justify-center items-center">
              <div className="h-6 w-6 border-2 border-alterview-indigo border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading assessments...</span>
            </div>
          ) : (
            <>
              {/* Assessment list */}
              {assessments.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {assessments.map((assessment, index) => (
                    <div
                      key={assessment.id}
                      className="hover:bg-gray-50/80 transition-colors"
                      style={{ animationDelay: `${150 + index * 50}ms` }}
                    >
                      <div className="px-8 py-5 flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{assessment.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 space-x-3">
                            <span>{assessment.course || "No course assigned"}</span>
                            <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                            <div className="flex items-center">
                              <Users className="h-3.5 w-3.5 mr-1 text-gray-400" />
                              <span>{assessment.students || 0} students</span>
                            </div>
                            <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                            <span>Updated: {assessment.lastUpdated}</span>
                          </div>
                        </div>
                        <Link
                          href={`/teacher/${params.teacher_id}/assessment/${assessment.id}`}
                          className="flex items-center px-5 py-2.5 bg-alterview-gradient text-white rounded-xl hover:shadow-md transition-all duration-300 group"
                        >
                          <span>View Details</span>
                          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-8 py-12 text-center">
                  <p className="text-gray-500">
                    No assessments created yet.
                  </p>
                </div>
              )}
            </>
          )}
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
