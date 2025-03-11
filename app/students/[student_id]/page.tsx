"use client";

import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

// Mock data for assessments
const mockAssessments = [
  { id: "1", title: "English Literature Interview" },
  { id: "assessment2", title: "Mathematics Assessment" },
  { id: "assessment3", title: "Science Evaluation" },
];

export default function StudentDashboard({ params }: { params: { student_id: string } }) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-12 ${inter.className}`}
    >
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-slate-600">
              Student ID: {params.student_id}
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Logout
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Assessments</h2>
          
          {mockAssessments.length > 0 ? (
            <div className="space-y-4">
              {mockAssessments.map((assessment) => (
                <div 
                  key={assessment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{assessment.title}</h3>
                    <Link
                      href={`/assessment/${params.student_id}/${assessment.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Interview
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No assessments available at this time.</p>
          )}
        </div>
      </div>
    </main>
  );
} 