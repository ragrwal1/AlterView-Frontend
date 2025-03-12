"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftCircle,
  BookOpen,
  ChevronRight,
  LogOut,
  History,
  ExternalLink,
  FileText,
  Calendar,
  ChevronDown,
  Settings,
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import FloatingIcons from "@/components/app/FloatingIcons";
import { getStudentName } from "@/services/supabaseService";
import StudentSettings from "@/components/app/StudentSettings";
import { fetchStudentAssessments } from "@/services/assessmentService";

// Define student assessment interface
interface StudentAssessment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: string;
}

// Type definition for assessment results
interface AssessmentResult {
  id: number;
  created_at: string;
  assessment_id: number;
  teacher_id: number;
  student_id: number;
  voice_recording_id: number | null;
  transcript_id: number | null;
}

// Define concept interface for spaced repetition
interface Concept {
  id: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  lastPracticed: string | null; 
  nextReview: string | null;
  mastery: number; // 0-100
  source: string; // which assessment revealed this concept
  status: "new" | "learning" | "reviewing" | "mastered";
}

export default function StudentDashboard({
  params,
}: {
  params: { student_id: string };
}) {
  const [loaded, setLoaded] = useState(false);
  const [studentName, setStudentName] = useState("Student");
  const [assessments, setAssessments] = useState<StudentAssessment[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllResults, setShowAllResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [concepts, setConcepts] = useState<Concept[]>([]);

  useEffect(() => {
    setLoaded(true);

    // Fetch student name
    const fetchStudentName = async () => {
      try {
        const name = await getStudentName(parseInt(params.student_id));
        setStudentName(name);
      } catch (err) {
        console.error("Error fetching student name:", err);
      }
    };

    // Fetch assignments
    const loadAssignments = async () => {
      try {
        const data = await fetchStudentAssessments(params.student_id);
        setAssessments(data);
      } catch (err) {
        console.error("Error fetching student assessments:", err);
      }
    };

    // Fetch assessment results
    const fetchAssessmentResults = async () => {
      try {
        const response = await fetch(
          `https://alterview-api.vercel.app/api/v1/assessment-results/student/${params.student_id}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch assessment results: ${response.status}`
          );
        }

        const data = await response.json();
        // Sort assessment results from latest to oldest based on created_at date
        const sortedData = [...data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setAssessmentResults(sortedData);
      } catch (err) {
        console.error("Error fetching assessment results:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch assessment results"
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Mock function to load spaced repetition concepts
    const loadConcepts = () => {
      // This would normally fetch from an API, but we'll use mock data
      const mockConcepts: Concept[] = [
        {
          id: "c1",
          name: "Active Listening",
          description: "Demonstrating full attention and engagement with the speaker",
          difficulty: "medium",
          lastPracticed: "2023-11-10T15:30:00Z",
          nextReview: "2023-11-15T15:30:00Z",
          mastery: 65,
          source: "Interview Skills Assessment",
          status: "learning"
        },
        {
          id: "c2",
          name: "Behavioral Questions",
          description: "Responding to questions about past experiences",
          difficulty: "hard",
          lastPracticed: "2023-11-05T10:15:00Z",
          nextReview: "2023-11-12T10:15:00Z",
          mastery: 40,
          source: "Job Interview Practice",
          status: "learning"
        },
        {
          id: "c3",
          name: "Concise Communication",
          description: "Communicating ideas clearly and briefly",
          difficulty: "medium",
          lastPracticed: "2023-11-08T14:45:00Z",
          nextReview: "2023-11-13T14:45:00Z",
          mastery: 70,
          source: "Communication Skills Assessment",
          status: "reviewing"
        },
        {
          id: "c4",
          name: "Technical Terminology",
          description: "Using appropriate field-specific terminology",
          difficulty: "hard",
          lastPracticed: null,
          nextReview: "2023-11-11T09:00:00Z",
          mastery: 20,
          source: "Technical Interview Assessment",
          status: "new"
        },
        {
          id: "c5",
          name: "Professional Etiquette",
          description: "Demonstrating proper professional behavior",
          difficulty: "easy",
          lastPracticed: "2023-11-01T11:30:00Z",
          nextReview: "2023-11-16T11:30:00Z",
          mastery: 90,
          source: "Professional Skills Assessment",
          status: "mastered"
        }
      ];
      
      setConcepts(mockConcepts);
    };

    fetchStudentName();
    loadAssignments();
    fetchAssessmentResults();
    loadConcepts(); // Load mock concept data
  }, [params.student_id]);

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get visible results - either all or just the first 5
  const visibleResults = showAllResults
    ? assessmentResults
    : assessmentResults.slice(0, 5);

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "learning": return "bg-amber-100 text-amber-800";
      case "reviewing": return "bg-purple-100 text-purple-800";
      case "mastered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get difficulty icon
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return <span className="text-green-500">●</span>;
      case "medium": return <span className="text-amber-500">●</span>;
      case "hard": return <span className="text-red-500">●</span>;
      default: return <span className="text-gray-500">●</span>;
    }
  };

  // Format for spaced repetition dates
  const formatReviewDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    
    const date = new Date(dateString);
    const today = new Date();
    
    // If it's today
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    
    // If it's tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    
    // Otherwise return full date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Group concepts by status for the practice view
  const conceptsByStatus = {
    new: concepts.filter(c => c.status === "new"),
    learning: concepts.filter(c => c.status === "learning"),
    reviewing: concepts.filter(c => c.status === "reviewing"),
    mastered: concepts.filter(c => c.status === "mastered")
  };

  // Calculate days since last practice
  const getDaysSince = (dateString: string | null) => {
    if (!dateString) return "Never practiced";
    
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="relative min-h-[calc(100vh-10rem)] px-4 py-8 overflow-hidden">
      {/* Background animation */}
      <FloatingIcons />

      {/* Settings Modal */}
      <StudentSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Main container */}
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header section with welcome message */}
        <div
          className={`transition-all duration-700 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-4xl font-semibold text-gray-900 animate-fadeIn">
                Welcome, {studentName || "Student"}
              </h1>
              
              {/* Practice Mode Toggle */}
              <button
                onClick={() => setPracticeMode(!practiceMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  practiceMode 
                    ? "bg-alterview-gradient text-white" 
                    : "bg-white border border-alterview-indigo/30 text-alterview-indigo"
                }`}
              >
                <Brain className="h-4 w-4" />
                <span>Practice Mode</span>
                {practiceMode ? 
                  <ToggleRight className="h-5 w-5 ml-1" /> : 
                  <ToggleLeft className="h-5 w-5 ml-1" />
                }
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <p
                className="text-gray-500 text-lg animate-fadeIn"
                style={{ animationDelay: "100ms" }}
              >
                ID: {params.student_id}
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSettings(true)}
                  className="inline-flex items-center text-sm text-alterview-indigo hover:text-alterview-violet transition-colors"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  <span>Settings</span>
                </button>
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
        </div>

        {!practiceMode ? (
          // Standard view - show assessments and past attempts
          <>
            {/* Assessments section */}
            <div
              className={`bg-white/90 backdrop-blur-md rounded-2xl mb-6 shadow-apple animate-scaleIn overflow-hidden transition-all duration-700 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: "100ms" }}
            >
              {/* Section header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-alterview-indigo mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Your Assessments
                  </h2>
                </div>
                <span className="text-sm text-gray-500">
                  {assessments.length} total
                </span>
              </div>

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
                          <h3 className="font-medium text-gray-900 mb-1">
                            {assessment.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 space-x-3">
                            <span>{assessment.course}</span>
                            <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                            <span>Due: {assessment.dueDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/student/${params.student_id}/practice/${assessment.id}`}
                            className="flex items-center px-5 py-2.5 bg-white border border-alterview-indigo/30 text-alterview-indigo rounded-xl hover:bg-alterview-indigo/5 transition-all duration-300 group"
                          >
                            <span>Practice</span>
                            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                          <Link
                            href={`/assessment/${params.student_id}/${assessment.id}`}
                            className="flex items-center px-5 py-2.5 bg-alterview-gradient text-white rounded-xl hover:shadow-md transition-all duration-300 group"
                          >
                            <span>Start</span>
                            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
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
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: "200ms" }}
            >
              {/* Section header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <History className="h-5 w-5 text-alterview-violet mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Past Attempts
                  </h2>
                </div>
                <span className="text-sm text-gray-500">
                  {assessmentResults.length > 0 &&
                    `Showing ${visibleResults.length} of ${assessmentResults.length}`}
                </span>
              </div>

              {/* Loading state */}
              {isLoading && (
                <div className="px-8 py-10 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-50 rounded-xl p-6 mb-4 animate-pulse">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error state */}
              {!isLoading && error && (
                <div className="px-8 py-10 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="bg-red-50 rounded-xl p-6 mb-4">
                      <h3 className="text-lg font-medium text-red-800 mb-2">
                        Error loading results
                      </h3>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                    <button
                      className="mt-2 inline-flex items-center px-4 py-2 text-sm font-medium text-alterview-indigo border border-alterview-indigo/30 rounded-xl hover:bg-alterview-indigo/5 transition-colors"
                      onClick={() => window.location.reload()}
                    >
                      <History className="h-4 w-4 mr-2" />
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {/* Assessment results list */}
              {!isLoading && !error && assessmentResults.length > 0 ? (
                <>
                  <div className="divide-y divide-gray-100">
                    {visibleResults.map((result, index) => {
                      // Find matching assessment from our assessments array
                      const matchingAssessment = assessments.find(
                        (a) => a.id === result.assessment_id.toString()
                      );

                      return (
                        <div
                          key={result.id}
                          className="hover:bg-gray-50/80 transition-colors"
                          style={{ animationDelay: `${150 + index * 50}ms` }}
                        >
                          <div className="px-8 py-5 flex justify-between items-center">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {matchingAssessment?.title || `Assessment #${result.assessment_id}`}
                              </h3>
                              <div className="flex items-center text-sm text-gray-500 space-x-3">
                                <div className="flex items-center">
                                  <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                  <span>{formatDate(result.created_at)}</span>
                                </div>
                                {matchingAssessment && (
                                  <>
                                    <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                                    <span>{matchingAssessment.course}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Link
                              href={`/student/${params.student_id}/results/${result.id}`}
                              className="flex items-center px-4 py-2 text-alterview-indigo border border-alterview-indigo/30 rounded-xl hover:bg-alterview-indigo/5 transition-colors group"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              <span>View</span>
                              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Show More button - only display if there are more than 5 results */}
                  {assessmentResults.length > 5 && (
                    <div className="px-8 py-4 border-t border-gray-100 flex justify-center">
                      <button
                        onClick={() => setShowAllResults(!showAllResults)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-alterview-indigo hover:text-alterview-violet transition-colors"
                      >
                        {showAllResults ? (
                          <>
                            <span>Show Less</span>
                            <ChevronDown className="h-4 w-4 ml-1 transform rotate-180" />
                          </>
                        ) : (
                          <>
                            <span>Show More</span>
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                !isLoading &&
                !error && (
                  <div className="px-8 py-10 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="bg-gray-50 rounded-xl p-6 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <History className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                          No past attempts yet
                        </h3>
                        <p className="text-gray-500 text-sm">
                          After you complete an assessment, your attempts will
                          appear here for review.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        ) : (
          // Practice Mode View - show concepts to practice
          <>
            {/* Practice Dashboard */}
            <div 
              className={`bg-white/90 backdrop-blur-md rounded-2xl mb-6 shadow-apple animate-scaleIn overflow-hidden transition-all duration-700 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: "100ms" }}
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 text-alterview-indigo mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Practice Dashboard
                  </h2>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {conceptsByStatus.new.length} New
                  </span>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                    {conceptsByStatus.learning.length} Learning
                  </span>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {conceptsByStatus.reviewing.length} Review
                  </span>
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {conceptsByStatus.mastered.length} Mastered
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Due Today Card */}
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-amber-900">Due Today</h3>
                      <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                    <p className="text-amber-700 mb-3">You have 3 concepts to review today.</p>
                    <button className="bg-white text-amber-600 px-4 py-2 rounded-lg shadow-sm border border-amber-200 hover:bg-amber-50 transition-colors">
                      Start Practice Session
                    </button>
                  </div>
                  
                  {/* Mastery Progress Card */}
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-indigo-900">Overall Mastery</h3>
                      <CheckCircle className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div className="w-full bg-white rounded-full h-4 mb-3">
                      <div className="bg-indigo-500 h-4 rounded-full" style={{ width: "57%" }}></div>
                    </div>
                    <p className="text-indigo-700">You've mastered 57% of all concepts.</p>
                  </div>
                </div>
                
                {/* Concepts Due for Review */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-blue-900">Next Reviews</h3>
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  
                  <div className="divide-y divide-blue-200">
                    {concepts
                      .filter(c => c.nextReview !== null)
                      .sort((a, b) => new Date(a.nextReview!).getTime() - new Date(b.nextReview!).getTime())
                      .slice(0, 3)
                      .map(concept => (
                        <div key={concept.id} className="py-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-blue-900">{concept.name}</h4>
                              <div className="flex items-center text-sm text-blue-700 mt-1">
                                <span className="inline-block mr-2">
                                  {getDifficultyIcon(concept.difficulty)}
                                </span>
                                <span>Next review: {formatReviewDate(concept.nextReview)}</span>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 text-xs rounded-full ${getStatusColor(concept.status)}`}>
                              {concept.status}
                            </span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
            
            {/* Concepts to Practice */}
            <div 
              className={`bg-white/90 backdrop-blur-md rounded-2xl mb-6 shadow-apple animate-scaleIn overflow-hidden transition-all duration-700 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ animationDelay: "200ms" }}
            >
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-alterview-violet" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Concepts to Practice
                  </h2>
                </div>
                <span className="text-sm text-gray-500">
                  Based on assessment results
                </span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {concepts.map((concept) => (
                  <div 
                    key={concept.id}
                    className="px-8 py-5 hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-gray-900">
                            {concept.name}
                          </h3>
                          <span className={`px-2.5 py-0.5 text-xs rounded-full ${getStatusColor(concept.status)}`}>
                            {concept.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {concept.description}
                        </p>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            {getDifficultyIcon(concept.difficulty)}
                            <span className="capitalize">{concept.difficulty}</span>
                          </div>
                          <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            <span>Last practiced: {getDaysSince(concept.lastPracticed)}</span>
                          </div>
                          <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                          <span>Source: {concept.source}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Mastery:</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                concept.mastery > 75 ? 'bg-green-500' : 
                                concept.mastery > 50 ? 'bg-blue-500' : 
                                concept.mastery > 25 ? 'bg-amber-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${concept.mastery}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{concept.mastery}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Back to home link */}
        <div
          className="text-center animate-fadeIn"
          style={{ animationDelay: "300ms" }}
        >
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
