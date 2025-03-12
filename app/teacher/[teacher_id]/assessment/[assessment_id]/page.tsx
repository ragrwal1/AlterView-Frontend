"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  fetchAssessmentMindMap,
  updateAssessmentMindMap,
} from "@/services/assessmentService";

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
  const [isMindMapLoading, setIsMindMapLoading] = useState(false);
  const [isMindMapEditorOpen, setIsMindMapEditorOpen] = useState(false);
  const [mindMapData, setMindMapData] = useState<Record<string, any> | null>(
    null
  );

  const handleEditMindMap = async () => {
    try {
      setIsMindMapLoading(true);
      const data = await fetchAssessmentMindMap(params.assessment_id);
      setMindMapData(data);
      setIsMindMapEditorOpen(true);
    } catch (error) {
      console.error("Failed to fetch mind map data:", error);
      alert("Failed to load mind map data. Please try again.");
    } finally {
      setIsMindMapLoading(false);
    }
  };

  const handleSaveMindMap = async () => {
    if (!mindMapData) return;

    try {
      setIsMindMapLoading(true);
      const success = await updateAssessmentMindMap(
        params.assessment_id,
        mindMapData
      );

      if (success) {
        setIsMindMapEditorOpen(false);
        alert("Mind map successfully updated!");
      } else {
        alert("Failed to update mind map. Please try again.");
      }
    } catch (error) {
      console.error("Error saving mind map:", error);
      alert("An error occurred while saving the mind map. Please try again.");
    } finally {
      setIsMindMapLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsMindMapEditorOpen(false);
    setMindMapData(null);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-12 ${inter.className}`}
    >
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Assessment Review</h1>
            <p className="text-slate-600">
              Assessment ID: {params.assessment_id}
            </p>
          </div>
          <Link
            href={`/teacher/${params.teacher_id}`}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Assessment Details</h2>
            <button
              onClick={handleEditMindMap}
              disabled={isMindMapLoading || isMindMapEditorOpen}
              className={`px-4 py-2 rounded-lg text-white ${
                isMindMapLoading || isMindMapEditorOpen
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } transition-colors`}
            >
              {isMindMapLoading ? "Loading..." : "Edit Mind-map"}
            </button>
          </div>

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
                  (mockStudents.filter((s) => s.status === "Completed").length /
                    mockStudents.length) *
                    100
                )}
                %
              </p>
            </div>
          </div>
        </div>

        {isMindMapEditorOpen && mindMapData && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Mind Map</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={isMindMapLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMindMap}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isMindMapLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } transition-colors`}
                  disabled={isMindMapLoading}
                >
                  {isMindMapLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                This is a placeholder for the mind map editor. In a complete
                implementation, this would include a rich editor for modifying
                the mind map structure.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                For now, you can view the JSON structure that would be edited in
                a real implementation:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                <pre className="text-xs text-gray-800">
                  {JSON.stringify(mindMapData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Student Results</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Student</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Score</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {mockStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="font-medium">{student.name}</div>
                      <div className="text-xs text-gray-500">
                        ID: {student.id}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
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
                    <td className="py-3 px-6 text-left">
                      {student.score !== null ? `${student.score}/100` : "-"}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <Link
                        href={`/assessment/${student.id}/${params.assessment_id}`}
                        className="text-blue-600 hover:text-blue-900"
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
    </main>
  );
}
