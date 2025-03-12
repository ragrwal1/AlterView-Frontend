
"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  fetchAssessmentMindMap,
  updateAssessmentMindMap,
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

// Mock data for student results
const mockStudents = [
  { id: "student1", name: "Alex Johnson", status: "Completed", score: 85 },
  { id: "student2", name: "Jamie Smith", status: "In Progress", score: null },
  { id: "student3", name: "Taylor Brown", status: "Completed", score: 92 },
  { id: "student4", name: "Casey Wilson", status: "Not Started", score: null },
  { id: "student5", name: "Jordan Lee", status: "Completed", score: 78 },
];

// Mock data for the aggregated mindmap insights
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

// Mock insights data
const mockInsights = [
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

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleEditMindMap = () => {
    router.push(
      `/teacher/${params.teacher_id}/assessment/${params.assessment_id}/edit-mindmap`
    );
  };

  const handleGenerateInsights = () => {
    setIsGenerating(true);
    
    // Simulate API call to generate insights
    setTimeout(() => {
      setIsGenerating(false);
      setShowInsights(true);
    }, 2000);
  };

  const handleDownloadReport = () => {
    // Placeholder for download report functionality
    alert("Report download functionality will be integrated with backend API");
  };

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
                Assessment ID: {params.assessment_id}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleEditMindMap}
                className="inline-flex items-center px-5 py-2.5 bg-alterview-gradient text-white rounded-xl hover:shadow-md transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: "150ms" }}
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

          <div className="p-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium">
                  Data Structures and Algorithms (CSE 310)
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">June 15, 2023</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="font-medium">{mockStudents.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="font-medium">
                  {Math.round(
                    (mockStudents.filter((s) => s.status === "Completed")
                      .length /
                      mockStudents.length) *
                      100
                  )}
                  %
                </p>
              </div>
            </div>
          </div>
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
                disabled={isGenerating}
                className={`px-6 py-3 bg-alterview-gradient text-white rounded-xl hover:shadow-md transition-all duration-300 flex items-center ${
                  isGenerating ? "opacity-75" : ""
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Insights Cards */}
              <div className="col-span-2">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-apple overflow-hidden transition-all duration-700 ease-out h-full">
                  <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <Lightbulb className="h-5 w-5 text-alterview-indigo mr-2" />
                      <h2 className="text-xl font-semibold text-gray-800">
                        Class Insights
                      </h2>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleDownloadReport}
                        className="p-2 text-gray-500 hover:text-alterview-indigo transition-colors rounded-lg hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-alterview-indigo transition-colors rounded-lg hover:bg-gray-50"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-1 gap-6">
                      {mockInsights.map((insight, index) => (
                        <div 
                          key={index} 
                          className="flex items-start p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all bg-white"
                        >
                          <div className={`p-3 rounded-full bg-${insight.color}-100 text-${insight.color}-600 mr-4 flex-shrink-0`}>
                            {insight.title.includes("Strong") && <CheckCircle className="h-5 w-5" />}
                            {insight.title.includes("Misconception") && <AlertCircle className="h-5 w-5" />}
                            {insight.title.includes("Gap") && <BarChart className="h-5 w-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-800">{insight.title}</h4>
                              <span className={`text-sm font-medium text-${insight.color}-600`}>
                                {insight.percentage}%
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm">{insight.description}</p>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full mt-3 overflow-hidden">
                              <div 
                                className={`h-full bg-${insight.color}-500 rounded-full`} 
                                style={{ width: `${insight.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="font-medium text-gray-800 mb-3">Recommended Actions</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0">•</div>
                          <p className="text-sm text-gray-600">Review logarithmic complexity concepts with a focus on practical applications.</p>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0">•</div>
                          <p className="text-sm text-gray-600">Address the common misconception about time complexity vs. actual runtime.</p>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0">•</div>
                          <p className="text-sm text-gray-600">Provide additional exercises on analyzing algorithms with different complexity classes.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Aggregate Mind Map */}
              <div className="col-span-1">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-apple overflow-hidden transition-all duration-700 ease-out h-full flex flex-col">
                  <div className="px-8 py-6 border-b border-gray-100 flex items-center">
                    <FileText className="h-5 w-5 text-alterview-indigo mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Class Knowledge Map
                    </h2>
                  </div>
                  <div className="p-2 flex-1 min-h-[400px]">
                    <div className="h-full w-full">
                      <MindMap 
                        data={mockAggregatedData} 
                        className="w-full h-full min-h-[400px]" 
                      />
                    </div>
                  </div>
                  <div className="px-8 py-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">Understanding Legend:</p>
                      <div className="flex space-x-2">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                          <span className="text-xs">Low</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
                          <span className="text-xs">Medium</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                          <span className="text-xs">High</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Student Results section */}
        <div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-apple animate-scaleIn overflow-hidden transition-all duration-700 ease-out"
          style={{ animationDelay: "200ms" }}
        >
          {/* Section header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-alterview-indigo mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Student Results
              </h2>
            </div>
            <span className="text-sm text-gray-500">
              {mockStudents.length} total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white/0">
              <thead>
                <tr className="bg-gray-50/80 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-8 text-left">Student</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Score</th>
                  <th className="py-3 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {mockStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors"
                    style={{ animationDelay: `${250 + index * 50}ms` }}
                  >
                    <td className="py-4 px-8 text-left">
                      <div className="font-medium text-gray-800">
                        {student.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {student.id}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          student.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : student.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-left">
                      {student.score !== null ? (
                        <div className="flex items-center">
                          <Activity className="h-3.5 w-3.5 text-alterview-indigo mr-1" />
                          <span>{student.score}/100</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-4 px-8 text-right">
                      {student.status === "Completed" ? (
                        <Link
                          href={`/teacher/${params.teacher_id}/student/${student.id}/results/${params.assessment_id}`}
                          className="text-alterview-indigo hover:text-alterview-violet transition-colors font-medium"
                        >
                          View Results
                        </Link>
                      ) : (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
