"use client";

import { Inter } from "next/font/google";
import { Assistant } from "@/components/app/assistant";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

interface Assessment {
  id: number;
  created_at: string;
  name: string;
  first_question: string;
  system_prompt: string;
  mindmap_template: Record<string, any>;
}

export default function AssessmentPage({ params }: { params: { student_id: string, assessment_id: string } }) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssessment() {
      try {
        const response = await fetch('https://alterview-api.vercel.app/api/v1/assessments');
        
        if (!response.ok) {
          throw new Error('Failed to fetch assessment data');
        }
        
        const assessments: Assessment[] = await response.json();
        const foundAssessment = assessments.find(a => a.id.toString() === params.assessment_id);
        
        if (foundAssessment) {
          setAssessment(foundAssessment);
        } else {
          setError(`Assessment with ID ${params.assessment_id} not found`);
        }
      } catch (err) {
        setError('Error loading assessment data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAssessment();
  }, [params.assessment_id]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-12 ${inter.className}`}
    >
      <div className="text-center">
        <h1 className="text-3xl">Alterview Assessment</h1>
        {loading ? (
          <p className="text-slate-600">Loading assessment...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-slate-600 mt-2 text-xl font-medium">{assessment?.name}</p>
            <p className="text-slate-600 mt-1">
              Student ID: {params.student_id}, Assessment ID: {params.assessment_id}
            </p>
          </>
        )}
      </div>
      <Assistant assessmentId={params.assessment_id} />
    </main>
  );
} 