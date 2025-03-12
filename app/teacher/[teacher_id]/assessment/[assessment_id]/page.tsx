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
import {
  ArrowLeftCircle,
  BookOpen,
  Users,
  Activity,
  Edit3,
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

export default function AssessmentReview({
  params,
}: {
  params: { teacher_id: string; assessment_id: string };
}) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleEditMindMap = () => {
    router.push(
      `/teacher/${params.teacher_id}/assessment/${params.assessment_id}/edit-mindmap`
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-10rem)] px-4 py-8 overflow-hidden">
      {/* Background animation */}
      <FloatingIcons />

      {/* Main container */}
      <div className="container mx-auto max-w-4xl relative z-10">
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
                      <Link
                        href={`/assessment/${student.id}/${params.assessment_id}`}
                        className="text-alterview-indigo hover:text-alterview-violet transition-colors font-medium"
                      >
                        View Interview
                      </Link>
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
