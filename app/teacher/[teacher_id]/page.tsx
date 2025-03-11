"use client";

import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

// Mock data for assessments
const mockAssessments = [
  { id: "assessment1", title: "English Literature Interview", students: 15 },
  { id: "assessment2", title: "Mathematics Assessment", students: 22 },
  { id: "assessment3", title: "Science Evaluation", students: 18 },
];

export default function TeacherDashboard({ params }: { params: { teacher_id: string } }) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-12 ${inter.className}`}
    >
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-slate-600">
              Teacher ID: {params.teacher_id}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href={`/teacher/${params.teacher_id}/create-assessment`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create New Assessment
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </Link>
          </div>
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
                    <div>
                      <h3 className="font-medium">{assessment.title}</h3>
                      <p className="text-sm text-gray-500">{assessment.students} students</p>
                    </div>
                    <Link
                      href={`/teacher/${params.teacher_id}/assessment/${assessment.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No assessments created yet.</p>
          )}
        </div>
      </div>
    </main>
  );
} 