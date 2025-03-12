"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  fetchAssessmentStudents,
  generateAssessmentInsights
} from "@/services/assessmentService";
import { useRouter } from "next/navigation";
import FloatingIcons from "@/components/app/FloatingIcons";
import MindMap from "@/components/app/MindMap";
import {
  ArrowLeftCircle,
  BookOpen,
  Users,
  Activity,
  Edit3,
  BarChart2,
  FileText,
  CheckCircle,
  AlertCircle,
  Brain,
  Lightbulb,
  BarChart,
  Share2,
  Download,
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

// Interface for insight data
interface Insight {
  title: string;
  description: string;
  percentage: number;
  color: string;
}

// Mock data for student results - will be replaced with API data
const mockStudents = [
  { id: "student1", name: "Alex Johnson", status: "Completed", score: 85 },
  { id: "student2", name: "Jamie Smith", status: "In Progress", score: null },
  { id: "student3", name: "Taylor Brown", status: "Completed", score: 92 },
  { id: "student4", name: "Casey Wilson", status: "Not Started", score: null },
  { id: "student5", name: "Jordan Lee", status: "Completed", score: 78 },
];

// Mock data for assessment details
const mockAssessment = {
  id: "assessment1",
  name: "Data Structures and Algorithms",
  created_at: "2023-02-28T12:00:00Z",
  description: "An assessment covering algorithm analysis, time complexity, and space complexity"
};

// Mock data for the aggregated mindmap insights - will be replaced with API data
const mockAggregatedData = {
  topic: {
    name: "Algorithm Analysis",
    description: "The systematic study of the performance of algorithms, focusing on their efficiency in terms of time and space requirements.",
    understandingLevel: 4,
    subtopics: [
      {
        name: "Time Complexity",
        description: "A measurement of the amount of time an algorithm takes to complete as a function of the input size.",
        understandingLevel: 3,
        subtopics: [
          {
            name: "Asymptotic Analysis",
            description: "Mathematical approach to describe algorithm behavior as input sizes become very large.",
            understandingLevel: 2,
            subtopics: []
          }
        ]
      },
      {
        name: "Space Complexity",
        description: "The amount of memory space required by an algorithm during program execution.",
        understandingLevel: 4,
        subtopics: []
      }
    ]
  }
};

// Mock insights data - will be replaced with API data
const mockInsights: Insight[] = [
  {
    title: "Strong Understanding",
    description: "Most students grasp the core concept of algorithm analysis and its importance.",
    percentage: 85,
    color: "emerald"
  },
  {
    title: "Common Misconception",
    description: "Students often confuse time complexity with actual runtime in seconds.",
    percentage: 65,
    color: "amber"
  },
  {
    title: "Knowledge Gap",
    description: "Understanding of logarithmic complexity is weaker than other complexity classes.",
    percentage: 42,
    color: "rose"
  }
];

export default function AssessmentReview({
  params,
}: {
  params: { teacher_id: string; assessment_id: string };
}) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [assessment, setAssessment] = useState<any>(mockAssessment);
  const [students, setStudents] = useState(mockStudents);
  const [insights, setInsights] = useState<any>(null);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoaded(true);
    
    // Immediately show insights for better demo experience
    setInsights({
      topic: mockAggregatedData.topic,
      insights: mockInsights
    });
    setShowInsights(true);
    
    // Use mock data instead of API calls
    setAssessment(mockAssessment);
    setStudents(mockStudents);
    setLoadingAssessment(false);
    setLoadingStudents(false);
  }, [params.assessment_id]);

  const handleEditMindMap = () => {
    router.push(
      `/teacher/${params.teacher_id}/assessment/${params.assessment_id}/edit-mindmap`
    );
  };

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    
    // Simulate API delay
    setTimeout(() => {
      setInsights({
        topic: mockAggregatedData.topic,
        insights: mockInsights
      });
      setShowInsights(true);
      setIsGenerating(false);
    }, 1500);
  };

  const handleDownloadReport = () => {
    // Placeholder for download report functionality
    alert("Report download functionality will be integrated with backend API");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return "Unknown date";
    }
  };

  const getCompletionRate = () => {
    if (!students || students.length === 0) return 0;
    const completedCount = students.filter(s => s.status === "Completed").length;
    return Math.round((completedCount / students.length) * 100);
  };

  // Use assessment data if available, otherwise show loading or error state
  const assessmentTitle = assessment ? assessment.name : loadingAssessment ? "Loading..." : "Unknown Assessment";
  const assessmentCreatedDate = assessment ? formatDate(assessment.created_at) : "Unknown date";

  return (
    <div className="relative min-h-[calc(100vh-10rem)] px-4 py-8 overflow-hidden">
      {/* Background animation */}
      <FloatingIcons />

      {/* Main container */}
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header section with title */}
        <div
          className={`transition-all duration-700 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 mb-3 animate-fadeIn">
                Assessment Review
              </h1>
              <p
                className="text-gray-500 text-lg animate-fadeIn"
                style={{ animationDelay: "100ms" }}
              >
                {loadingAssessment ? "Loading assessment details..." : `Assessment ID: ${params.assessment_id}`}
              </p>
              {error && (
                <p className="text-amber-600 text-sm mt-2 animate-fadeIn">
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleEditMindMap}
                className="inline-flex items-center px-5 py-2.5 bg-alterview-gradient text-white rounded-xl hover:shadow-md transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: "150ms" }}
                disabled={loadingAssessment}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                <span>Edit Mind-map</span>
              </button>

              <Link
                href={`/teacher/${params.teacher_id}`}
                className="inline-flex items-center p-2.5 text-alterview-indigo hover:text-alterview-violet transition-colors rounded-xl hover:bg-gray-50 animate-fadeIn"
                style={{ animationDelay: "200ms" }}
              >
                <ArrowLeftCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Assessment Details section */}
        <div
          className="bg-white/90 backdrop-blur-md rounded-2xl mb-6 shadow-apple animate-scaleIn overflow-hidden transition-all duration-700 ease-out"
          style={{ animationDelay: "100ms" }}
        >
          {/* Section header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center">
            <BookOpen className="h-5 w-5 text-alterview-indigo mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Assessment Details
            </h2>
          </div>

          {loadingAssessment ? (
            <div className="p-8 flex justify-center items-center">
              <div className="h-6 w-6 border-2 border-alterview-indigo border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading assessment details...</span>
            </div>
          ) : (
            <div className="p-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="font-medium">
                    {assessmentTitle}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{assessmentCreatedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="font-medium">{loadingStudents ? "Loading..." : students.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                  <p className="font-medium">
                    {loadingStudents ? "Loading..." : `${getCompletionRate()}%`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Aggregated Insights Section */}
        <div className="mb-6">
          {!showInsights ? (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl py-10 shadow-apple flex flex-col items-center justify-center transition-all duration-700 ease-out">
              <Brain className="h-16 w-16 text-alterview-indigo mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Generate Aggregated Insights
              </h3>
              <p className="text-gray-600 max-w-md text-center mb-6">
                Analyze student mind maps to discover knowledge patterns, common misconceptions,
                and areas that need additional attention.
              </p>
              <button
                onClick={handleGenerateInsights}
                disabled={isGenerating || loadingAssessment || loadingStudents}
                className={`px-6 py-3 bg-alterview-gradient text-white rounded-xl hover:shadow-md transition-all duration-300 flex items-center ${
                  isGenerating || loadingAssessment || loadingStudents ? "opacity-75" : ""
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Analyzing Responses...</span>
                  </>
                ) : (
                  <>
                    <BarChart2 className="h-4 w-4 mr-2" />
                    <span>Generate Insights</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Insights Cards */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-apple overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center">
                  <Lightbulb className="h-5 w-5 text-alterview-indigo mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Key Insights</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="p-8">
                    <div className="grid grid-cols-1 gap-6">
                      {(insights?.insights || mockInsights).map((insight: Insight, index: number) => (
                        <div 
                          key={index} 
                          className={`bg-${insight.color}-50 border border-${insight.color}-200 rounded-xl p-4`}
                        >
                          <div className="flex items-start justify-between">
                            <h3 className={`text-${insight.color}-800 font-medium`}>{insight.title}</h3>
                            <span className={`bg-${insight.color}-100 text-${insight.color}-800 text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                              {insight.percentage}%
                            </span>
                          </div>
                          <p className={`text-${insight.color}-700 text-sm mt-2`}>{insight.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mind Map Visualization */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-apple overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 text-alterview-indigo mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Understanding Analysis</h2>
                  </div>
                  <button
                    onClick={handleDownloadReport}
                    className="text-sm text-alterview-indigo hover:text-alterview-violet transition-colors flex items-center"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    <span>Download Report</span>
                  </button>
                </div>
                <div className="p-6">
                  <div className="h-full w-full">
                    <MindMap 
                      data={insights?.topic || mockAggregatedData.topic} 
                      className="w-full h-full min-h-[400px]" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Student Results Section */}
        <div
          className="bg-white/90 backdrop-blur-md rounded-2xl mb-6 shadow-apple overflow-hidden transition-all duration-700 ease-out"
          style={{ animationDelay: "200ms" }}
        >
          {/* Section header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-alterview-indigo mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Student Results</h2>
            </div>
            <Link
              href={`/teacher/${params.teacher_id}`}
              className="text-sm text-alterview-indigo hover:text-alterview-violet transition-colors"
            >
              View All
            </Link>
          </div>

          {loadingStudents ? (
            <div className="p-8 flex justify-center items-center">
              <div className="h-6 w-6 border-2 border-alterview-indigo border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading student results...</span>
            </div>
          ) : students.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {students.map((student, index) => (
                <div key={student.id} className="px-8 py-4 hover:bg-gray-50/80 transition-colors flex justify-between items-center">
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="flex items-center mt-1 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                          student.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : student.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {student.status === "Completed" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : student.status === "In Progress" ? (
                          <Activity className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {student.status}
                      </span>
                      {student.score !== null && (
                        <span className="ml-3 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium flex items-center">
                          <BarChart2 className="h-3 w-3 mr-1" />
                          Score: {student.score}%
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/teacher/${params.teacher_id}/student/${student.id}/results/${params.assessment_id}`}
                    className="px-4 py-2 bg-alterview-indigo/10 hover:bg-alterview-indigo/20 rounded-lg text-alterview-indigo text-sm transition-colors"
                  >
                    View Results
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-8 py-6 text-center text-gray-500">
              No student results available for this assessment yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
