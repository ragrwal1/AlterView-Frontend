"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftCircle, Upload, X, FileText, AlertCircle, CheckCircle, FileType } from "lucide-react";
import { createAssessment } from "@/services/assessmentService";
import FloatingIcons from "@/components/app/FloatingIcons";

export default function CreateAssessment({
  params,
}: {
  params: { teacher_id: string };
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseMaterial, setCourseMaterial] = useState<File | null>(null);
  const [fileValid, setFileValid] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError(null);

    if (!file) {
      setCourseMaterial(null);
      setFileValid(false);
      return;
    }

    // Basic validation - just check if file is too large (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File is too large (max 10MB)");
      setCourseMaterial(null);
      setFileValid(false);
      return;
    }

    setCourseMaterial(file);
    setFileValid(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || !title || !description) return;

    try {
      setIsSubmitting(true);

      // Create assessment using our service
      // File is optional now, only pass it if it exists and is valid
      const assessmentData: any = {
        title,
        description,
      };
      
      // Only include course_material if a valid file exists
      if (courseMaterial && fileValid) {
        assessmentData.course_material = courseMaterial;
      }

      const assessmentId = await createAssessment(assessmentData);

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
    setCourseMaterial(null);
    setFileValid(false);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Function to get file icon based on mime type
  const getFileIcon = (file: File) => {
    const type = file.type.split('/')[0];
    switch (type) {
      case 'image':
        return <FileType className="h-8 w-8 text-blue-500 mb-2" />;
      case 'application':
        return <FileText className="h-8 w-8 text-green-500 mb-2" />;
      case 'text':
        return <FileText className="h-8 w-8 text-purple-500 mb-2" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500 mb-2" />;
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-10rem)] px-4 py-8 overflow-hidden">
      {/* Background animation */}
      <FloatingIcons />
      
      {/* Main container */}
      <div className="container mx-auto max-w-2xl relative z-10">
        {/* Header section */}
        <div 
          className={`transition-all duration-700 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 mb-3 animate-fadeIn">
                Create New Assessment
              </h1>
              <p className="text-gray-500 text-lg animate-fadeIn" style={{ animationDelay: '100ms' }}>
                Design an interview assessment for your students
              </p>
            </div>
            
            <Link
              href={`/teacher/${params.teacher_id}`}
              className="inline-flex items-center p-2.5 text-alterview-indigo hover:text-alterview-violet transition-colors rounded-xl hover:bg-gray-50 animate-fadeIn"
              style={{ animationDelay: '200ms' }}
            >
              <ArrowLeftCircle className="h-5 w-5" />
              <span className="ml-2">Back</span>
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div 
          className={`bg-white/90 backdrop-blur-md rounded-2xl mb-6 shadow-apple animate-scaleIn overflow-hidden transition-all duration-700 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ animationDelay: '100ms' }}
        >
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="title"
                >
                  Assessment Title
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-alterview-indigo focus:outline-none focus:ring-1 focus:ring-alterview-indigo/20 transition-all"
                  id="title"
                  type="text"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-alterview-indigo focus:outline-none focus:ring-1 focus:ring-alterview-indigo/20 transition-all"
                  id="description"
                  placeholder="Provide details about this assessment"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Course Materials <span className="text-sm font-normal text-gray-500">(Optional)</span>
                </label>
                <div className="space-y-4">
                  {/* File upload area */}
                  <div className={`border-2 border-dashed ${fileError ? 'border-red-200 bg-red-50' : courseMaterial ? 'border-green-200 bg-green-50' : 'border-gray-200'} rounded-xl p-6 text-center transition-colors`}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    
                    {!courseMaterial ? (
                      <div>
                        <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                        <p className="mb-2 text-gray-600">Drag and drop your course materials, or</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-alterview-indigo border border-alterview-indigo/30 rounded-xl hover:bg-alterview-indigo/5 transition-colors"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Browse files
                        </button>
                        <p className="mt-3 text-xs text-gray-500">Supports PDFs, documents, images, and more (max 10MB)</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        {getFileIcon(courseMaterial)}
                        <p className="text-gray-700 font-medium mb-1 break-all">
                          {courseMaterial.name}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                          {formatFileSize(courseMaterial.size)}
                        </p>
                        <button
                          type="button"
                          onClick={clearFileSelection}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* File error message */}
                  {fileError && (
                    <div className="text-sm text-red-600 bg-red-50 py-2 px-3 rounded-lg flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      {fileError}
                    </div>
                  )}

                  {/* File success message */}
                  {courseMaterial && fileValid && (
                    <div className="text-sm text-green-600 bg-green-50 py-2 px-3 rounded-lg flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      File uploaded successfully
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  className={`w-full py-3.5 rounded-xl text-white font-medium text-lg transition-all duration-300 button-shine
                  ${title && description 
                    ? 'bg-alterview-gradient hover:shadow-md' 
                    : 'bg-gray-300 cursor-not-allowed'}`}
                  type="submit"
                  disabled={isSubmitting || !title || !description || (courseMaterial !== null && !fileValid)}
                >
                  {isSubmitting ? "Creating..." : "Create Assessment"}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Back link */}
        <div className="text-center animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <Link
            href={`/teacher/${params.teacher_id}`}
            className="inline-flex items-center justify-center text-alterview-indigo hover:text-alterview-violet transition-colors apple-hover"
          >
            <ArrowLeftCircle className="h-4 w-4 mr-1" />
            <span>Back to dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
