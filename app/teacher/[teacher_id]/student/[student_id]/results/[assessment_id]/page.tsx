"use client";

import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import MindMap from "@/components/app/MindMap";
import FloatingIcons from "@/components/app/FloatingIcons";
import { fetchStudentAssessmentResult } from "@/services/assessmentService";
import { ArrowLeftCircle, Download, Edit3, FileText, MessageSquare, Mic, PenTool, BarChart2, HelpCircle, Share2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

// Add this custom CSS for the scrollbar
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(79, 70, 229, 0.6), rgba(59, 130, 246, 0.6));
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(79, 70, 229, 0.8), rgba(59, 130, 246, 0.8));
  }
`;

interface AssessmentResult {
  id: number;
  created_at: string;
  assessment_id: number;
  teacher_id: number;
  student_id: number;
  voice_recording_id: number | null;
  transcript: string | null;
  mindmap: any | null;
  insights: any | null;
  score?: number;
  duration?: number;
}

// Mock student data for a more complete interface
const mockStudentData = {
  name: "Alex Johnson",
  email: "alex.johnson@university.edu",
  studentId: "STU-1234",
  grade: "Undergraduate",
  program: "Computer Science",
  avatarUrl: "https://i.pravatar.cc/150?u=alex"
};

// Mock teacher annotations for the results
const mockAnnotations = [
  {
    id: 1,
    text: "Student showed excellent understanding of time complexity but struggled with space complexity concepts.",
    timestamp: "2023-06-16T10:23:45Z",
    concept: "Time Complexity"
  },
  {
    id: 2,
    text: "Recommend additional resources on logarithmic algorithms to help with this knowledge gap.",
    timestamp: "2023-06-16T10:25:12Z",
    concept: "O(log n)"
  }
];

export default function TeacherStudentResultsPage({ params }: { params: { teacher_id: string, student_id: string, assessment_id: string } }) {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedTranscript, setParsedTranscript] = useState<{speaker: string, text: string}[]>([]);
  const [newAnnotation, setNewAnnotation] = useState("");
  const [annotations, setAnnotations] = useState(mockAnnotations);
  const [selectedConcept, setSelectedConcept] = useState("");
  const [concepts, setConcepts] = useState<string[]>(["Time Complexity", "Space Complexity", "Asymptotic Analysis", "O(log n)", "O(n)", "O(n²)"]);
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);

  // Parse transcript when result changes
  useEffect(() => {
    if (result?.transcript) {
      const lines = result.transcript.split('\n').filter(line => line.trim() !== '');
      const parsedLines = lines.map(line => {
        const [speaker, ...textParts] = line.split(': ');
        return {
          speaker: speaker.trim(),
          text: textParts.join(': ').trim()
        };
      });
      setParsedTranscript(parsedLines);
    }
  }, [result?.transcript]);

  // Fetch assessment results
  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        setError(null);
        
        // Use our API service to fetch the student's assessment result
        const resultData = await fetchStudentAssessmentResult(
          params.student_id,
          params.assessment_id
        );
        
        setResult(resultData);
        
        // Extract concepts from the mind map for annotations
        if (resultData?.mindmap?.topic) {
          const extractConcepts = (node: any): string[] => {
            let concepts = [node.name];
            if (node.subtopics) {
              node.subtopics.forEach((subtopic: any) => {
                concepts = [...concepts, ...extractConcepts(subtopic)];
              });
            }
            return concepts;
          };
          
          const extractedConcepts = extractConcepts(resultData.mindmap.topic);
          if (extractedConcepts.length > 0) {
            setConcepts(extractedConcepts);
          }
        }
      } catch (err) {
        console.error("Error loading assessment results:", err);
        setError('Error loading assessment results. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [params.student_id, params.assessment_id, params.teacher_id]);

  const handleAddAnnotation = () => {
    if (newAnnotation.trim() !== "") {
      const annotation = {
        id: Date.now(),
        text: newAnnotation,
        timestamp: new Date().toISOString(),
        concept: selectedConcept || "General"
      };
      
      setAnnotations([...annotations, annotation]);
      setNewAnnotation("");
      setSelectedConcept("");
      setShowAnnotationForm(false);
    }
  };

  const handleDownloadResults = () => {
    alert("This feature will be integrated with the backend API to download assessment results");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background animation */}
      <FloatingIcons />

      {/* Custom scrollbar styles */}
      <style jsx global>{customScrollbarStyles}</style>
      
      {/* Main container */}
      <div className="container mx-auto max-w-6xl px-4 py-8 relative z-10">
        {/* Header with navigation */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden flex-shrink-0">
                <img 
                  src={mockStudentData.avatarUrl} 
                  alt={mockStudentData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {mockStudentData.name}'s Results
            </h1>
            <p className="text-gray-500 ml-[52px]">
              Assessment: {params.assessment_id} • {result ? formatDate(result.created_at) : "Loading..."}
            </p>
            {error && (
              <p className="text-amber-600 text-sm mt-2 ml-[52px]">
                {error}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadResults}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2" />
              <span>Download Results</span>
            </button>
            
            <Link
              href={`/teacher/${params.teacher_id}/assessment/${params.assessment_id}`}
              className="inline-flex items-center p-2.5 text-alterview-indigo hover:text-alterview-violet transition-colors rounded-xl hover:bg-gray-50"
            >
              <ArrowLeftCircle className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-10 w-10 border-4 border-alterview-indigo border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-4 text-gray-600 text-lg">Loading assessment results...</span>
          </div>
        ) : result ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - About student and assessment */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Student card */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-apple overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center">
                  <FileText className="h-5 w-5 text-alterview-indigo mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Student Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{mockStudentData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{mockStudentData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Student ID</p>
                      <p className="font-medium">{mockStudentData.studentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Program</p>
                      <p className="font-medium">{mockStudentData.program}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assessment Stats */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-apple overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center">
                  <BarChart2 className="h-5 w-5 text-alterview-indigo mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Assessment Stats
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 rounded-xl p-4 text-center">
                      <p className="text-sm text-indigo-600 mb-1">Score</p>
                      <p className="text-2xl font-bold text-indigo-700">{result?.score || 0}/100</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-sm text-blue-600 mb-1">Duration</p>
                      <p className="text-2xl font-bold text-blue-700">{result?.duration || 0} min</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annotations */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-apple overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <PenTool className="h-5 w-5 text-alterview-indigo mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Teacher Notes
                    </h2>
                  </div>
                  <button 
                    onClick={() => setShowAnnotationForm(!showAnnotationForm)}
                    className="text-alterview-indigo hover:text-alterview-violet transition-colors"
                  >
                    {showAnnotationForm ? 'Cancel' : 'Add Note'}
                  </button>
                </div>
                <div className="p-6">
                  {showAnnotationForm && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                      <div className="mb-3">
                        <label className="block text-sm text-gray-600 mb-1">Related Concept</label>
                        <select 
                          value={selectedConcept}
                          onChange={(e) => setSelectedConcept(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-alterview-indigo focus:border-transparent"
                        >
                          <option value="">General</option>
                          {concepts.map((concept, index) => (
                            <option key={index} value={concept}>{concept}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm text-gray-600 mb-1">Note</label>
                        <textarea 
                          value={newAnnotation}
                          onChange={(e) => setNewAnnotation(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-alterview-indigo focus:border-transparent"
                          rows={3}
                          placeholder="Add your observation or note here..."
                        />
                      </div>
                      <button 
                        onClick={handleAddAnnotation}
                        className="px-4 py-2 bg-alterview-gradient text-white rounded-lg hover:shadow-md transition-all duration-300"
                      >
                        Save Note
                      </button>
                    </div>
                  )}
                  
                  {annotations.length > 0 ? (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                      {annotations.map(annotation => (
                        <div key={annotation.id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-alterview-indigo">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-alterview-indigo bg-indigo-50 px-2 py-1 rounded-full">
                              {annotation.concept}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(annotation.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{annotation.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <HelpCircle className="h-8 w-8 text-gray-300 mb-2" />
                      <p className="text-gray-500">No notes yet</p>
                      <p className="text-sm text-gray-400">Add notes to track observations</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column - Mind Map and Transcript */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Teacher Mind Map with teacher-specific features */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-apple overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-alterview-indigo mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Knowledge Mind Map <span className="text-xs text-alterview-indigo font-normal ml-1">Teacher View</span>
                    </h2>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-gray-500 hover:text-alterview-indigo transition-colors rounded-lg hover:bg-gray-50"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/teacher/${params.teacher_id}/assessment/${params.assessment_id}/edit-mindmap`}
                      className="p-2 text-gray-500 hover:text-alterview-indigo transition-colors rounded-lg hover:bg-gray-50"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600">Loading mind map...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 rounded-md">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="bg-gray-50 rounded-xl overflow-hidden h-[400px] relative">
                      {result?.mindmap ? (
                        <MindMap 
                          data={result.mindmap} 
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <p className="text-gray-500 text-lg font-medium">No mind map available</p>
                          <p className="text-gray-400 text-sm mt-2">This assessment doesn't have a mind map yet</p>
                          <button 
                            className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                            onClick={() => {
                              // For testing purposes, we'll use the sample data
                              fetch('/sample.json')
                                .then(response => response.json())
                                .then(data => {
                                  if (result) {
                                    setResult({
                                      ...result,
                                      mindmap: data
                                    });
                                  }
                                })
                                .catch(err => console.error('Error loading sample mindmap:', err));
                            }}
                          >
                            Load Sample Mind Map
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Transcript */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-apple overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-alterview-indigo mr-2" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Interview Transcript
                    </h2>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 text-gray-500 hover:text-alterview-indigo transition-colors rounded-lg hover:bg-gray-50"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600">Loading transcript...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 rounded-md">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-left max-h-[400px] overflow-y-auto custom-scrollbar">
                      {parsedTranscript.length > 0 ? (
                        <div className="space-y-4">
                          {parsedTranscript.map((line, index) => (
                            <div key={index} className={`flex ${line.speaker === 'USER' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] rounded-lg p-3 ${
                                line.speaker === 'USER' 
                                  ? 'bg-indigo-100 text-indigo-800' 
                                  : 'bg-gray-200 text-gray-800'
                              }`}>
                                <p className="text-xs font-semibold mb-1">{line.speaker}</p>
                                <p>{line.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[200px]">
                          <p className="text-gray-500">No transcript available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-apple p-8 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any assessment results for this student. Please check the assessment ID and try again.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 