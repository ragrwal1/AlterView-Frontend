"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createAssessment } from "@/services/assessmentService";

const inter = Inter({ subsets: ["latin"] });

export default function CreateAssessment({
  params,
}: {
  params: { teacher_id: string };
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [mindMapData, setMindMapData] = useState<any>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError(null);

    if (!file) {
      setJsonFile(null);
      setMindMapData(null);
      return;
    }

    // Validate file type
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setFileError("Please upload a JSON file");
      setJsonFile(null);
      setMindMapData(null);
      return;
    }

    setJsonFile(file);

    // Read and parse the JSON file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setMindMapData(json);
        setFileError(null);
      } catch (error) {
        setFileError("Invalid JSON format");
        setMindMapData(null);
      }
    };
    reader.onerror = () => {
      setFileError("Error reading file");
      setMindMapData(null);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Create assessment using our service
      const assessmentId = await createAssessment({
        title,
        description,
        mindmap_template: mindMapData,
      });

      // Redirect to the assessment details page
      router.push(`/teacher/${params.teacher_id}/assessment/${assessmentId}`);
    } catch (error) {
      console.error("Failed to create assessment:", error);
      alert("Failed to create assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFileSelection = () => {
    setJsonFile(null);
    setMindMapData(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-12 ${inter.className}`}
    >
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Assessment</h1>
          <Link
            href={`/teacher/${params.teacher_id}`}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Assessment Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                placeholder="Enter assessment title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                placeholder="Enter assessment description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mind Map Template (JSON)
              </label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="hidden"
                    id="json-upload"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Upload JSON File
                  </button>
                  {jsonFile && (
                    <button
                      type="button"
                      onClick={clearFileSelection}
                      className="text-red-600 hover:text-red-800"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  <a
                    href="/mindmap-template-example.json"
                    download
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Download example template
                  </a>
                </div>

                {jsonFile && (
                  <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                    Selected file: {jsonFile.name} (
                    {(jsonFile.size / 1024).toFixed(2)} KB)
                  </div>
                )}

                {fileError && (
                  <div className="text-sm text-red-600">{fileError}</div>
                )}

                {mindMapData && (
                  <div className="text-sm text-green-600">
                    ✓ Valid JSON mind map template loaded
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className={`${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Assessment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
