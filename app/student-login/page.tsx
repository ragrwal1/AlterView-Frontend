"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function StudentLogin() {
  const [studentId, setStudentId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId.trim()) {
      router.push(`/students/${studentId}`);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-12 ${inter.className}`}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Student Login</h1>
          <p className="text-slate-600 mt-2">
            Enter your student ID to access your assessments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentId">
              Student ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="studentId"
              type="text"
              placeholder="Enter your student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
            <Link
              href="/"
              className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
            >
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
} 