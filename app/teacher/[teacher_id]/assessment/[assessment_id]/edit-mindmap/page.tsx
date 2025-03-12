"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  fetchAssessmentMindMap,
  updateAssessmentMindMap,
} from "@/services/assessmentService";

const inter = Inter({ subsets: ["latin"] });

interface TopicNode {
  topic: any;
  path: string[];
  parent: TopicNode | null;
  children: TopicNode[];
}

// Component for editing a single topic widget
const TopicWidget = ({
  topic,
  onUpdate,
  onRemove,
  onApprove,
  onViewSubtopics,
  hasSubtopics,
  currentIndex,
  totalTopics,
  onNavigate,
}: {
  topic: any;
  onUpdate: (updatedTopic: any) => void;
  onRemove: () => void;
  onApprove: () => void;
  onViewSubtopics: () => void;
  hasSubtopics: boolean;
  currentIndex: number;
  totalTopics: number;
  onNavigate: (direction: "prev" | "next") => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(topic.name);
  const [editedDescription, setEditedDescription] = useState(topic.description);

  const handleSave = () => {
    const updatedTopic = {
      ...topic,
      name: editedName,
      description: editedDescription,
    };
    onUpdate(updatedTopic);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(topic.name);
    setEditedDescription(topic.description);
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 mb-4 bg-white shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-3 py-2 text-xl border border-gray-300 rounded"
            />
          ) : (
            <h2 className="text-2xl font-semibold">{topic.name}</h2>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-1 font-medium">
          Description
        </div>
        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            rows={4}
          />
        ) : (
          <p className="text-gray-700 bg-gray-50 p-3 rounded">
            {topic.description}
          </p>
        )}
      </div>

      {!isEditing && (
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-500 mb-2">
            Assessment Criteria
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg border border-green-100">
              <h4 className="text-sm font-medium text-green-700 mb-2">
                Excellent Understanding
              </h4>
              <ul className="list-disc list-inside text-sm pl-2 text-gray-700">
                {topic.assessmentCriteria.excellentUnderstanding.map(
                  (item: string, idx: number) => (
                    <li key={idx} className="mb-1">
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium text-blue-700 mb-2">
                Adequate Understanding
              </h4>
              <ul className="list-disc list-inside text-sm pl-2 text-gray-700">
                {topic.assessmentCriteria.adequateUnderstanding.map(
                  (item: string, idx: number) => (
                    <li key={idx} className="mb-1">
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
              <h4 className="text-sm font-medium text-orange-700 mb-2">
                Misconceptions
              </h4>
              <ul className="list-disc list-inside text-sm pl-2 text-gray-700">
                {topic.assessmentCriteria.misconceptions.map(
                  (item: string, idx: number) => (
                    <li key={idx} className="mb-1">
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <h4 className="text-sm font-medium text-purple-700 mb-2">
                Tutor Guidance
              </h4>
              <p className="text-sm pl-2 text-gray-700">
                {topic.assessmentCriteria.tutorGuidance}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation and Actions Bar */}
      <div className="border-t pt-4 mt-4">
        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => onNavigate("prev")}
            disabled={currentIndex <= 0}
            className={`px-4 py-2 rounded-lg flex items-center ${
              currentIndex <= 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </button>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} of {totalTopics}
          </div>
          <button
            onClick={() => onNavigate("next")}
            disabled={currentIndex >= totalTopics - 1}
            className={`px-4 py-2 rounded-lg flex items-center ${
              currentIndex >= totalTopics - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onRemove}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
              <button
                onClick={onApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              {hasSubtopics && (
                <button
                  onClick={onViewSubtopics}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View Subtopics
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function EditMindMap({
  params,
}: {
  params: { teacher_id: string; assessment_id: string };
}) {
  const [mindMapData, setMindMapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Navigation state
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState<
    { name: string; path: string[] }[]
  >([]);

  useEffect(() => {
    async function loadMindMap() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await fetchAssessmentMindMap(params.assessment_id);
        setMindMapData(data);
        // Reset navigation when data changes
        setCurrentPath([]);
        setCurrentTopicIndex(0);
        setBreadcrumbs([]);
      } catch (error) {
        console.error("Failed to load mind map data:", error);
        setErrorMessage("Failed to load mind map data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadMindMap();
  }, [params.assessment_id]);

  // Derive the current topics to display based on currentPath
  const { currentTopics, parentTopic } = useMemo(() => {
    if (!mindMapData) return { currentTopics: [], parentTopic: null };

    let parent = null;
    let topics = [mindMapData.topic];

    if (currentPath.length === 0) {
      // At the root level, show the main topic
      return { currentTopics: topics, parentTopic: null };
    }

    // Navigate to the current path
    let current = mindMapData.topic;
    let pathSoFar: string[] = [];

    for (let i = 0; i < currentPath.length; i += 2) {
      const key = currentPath[i];
      const index = parseInt(currentPath[i + 1]);

      if (i < currentPath.length - 2) {
        pathSoFar.push(key, currentPath[i + 1]);
      }

      parent = current;
      current = current[key][index];
    }

    // Get the subtopics of the current node
    if (current.subtopics && current.subtopics.length > 0) {
      topics = current.subtopics;
    } else {
      topics = [];
    }

    return { currentTopics: topics, parentTopic: parent };
  }, [mindMapData, currentPath]);

  // Update breadcrumbs whenever currentPath changes
  useEffect(() => {
    if (!mindMapData) return;

    const newBreadcrumbs = [];
    let current = mindMapData.topic;
    let pathSoFar: string[] = [];

    // Add root level
    newBreadcrumbs.push({
      name: mindMapData.topic.name,
      path: [],
    });

    // Build path
    for (let i = 0; i < currentPath.length; i += 2) {
      const key = currentPath[i];
      const index = parseInt(currentPath[i + 1]);

      pathSoFar = [...pathSoFar, key, currentPath[i + 1]];
      current = current[key][index];

      newBreadcrumbs.push({
        name: current.name,
        path: [...pathSoFar],
      });
    }

    setBreadcrumbs(newBreadcrumbs);
  }, [mindMapData, currentPath]);

  // Reset current topic index when the available topics change
  useEffect(() => {
    setCurrentTopicIndex(0);
  }, [currentPath]);

  const updateTopic = (updatedTopic: any) => {
    if (!mindMapData) return;

    const newMindMapData = { ...mindMapData };

    if (currentPath.length === 0) {
      // Updating the root topic
      newMindMapData.topic = updatedTopic;
    } else {
      // Navigate to the parent of the current topic
      let current = newMindMapData.topic;

      for (let i = 0; i < currentPath.length - 2; i += 2) {
        const key = currentPath[i];
        const index = parseInt(currentPath[i + 1]);
        current = current[key][index];
      }

      // Update the topic
      const lastKey = currentPath[currentPath.length - 2];
      const lastIndex = parseInt(currentPath[currentPath.length - 1]);
      current[lastKey][lastIndex] = updatedTopic;
    }

    setMindMapData(newMindMapData);
    setSuccessMessage("Topic updated successfully!");
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const removeTopic = () => {
    if (!mindMapData || currentPath.length === 0) return;

    const newMindMapData = { ...mindMapData };

    // Navigate to the parent of the topic to remove
    let current = newMindMapData.topic;

    for (let i = 0; i < currentPath.length - 2; i += 2) {
      const key = currentPath[i];
      const index = parseInt(currentPath[i + 1]);
      current = current[key][index];
    }

    // Remove the topic
    const lastKey = currentPath[currentPath.length - 2];
    const lastIndex = parseInt(currentPath[currentPath.length - 1]);
    current[lastKey].splice(lastIndex, 1);

    setMindMapData(newMindMapData);

    // Go back to parent view after removing
    const newPath = currentPath.slice(0, currentPath.length - 2);
    setCurrentPath(newPath);
    setSuccessMessage("Topic removed successfully!");
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const approveTopic = () => {
    // This is a placeholder for whatever "approve" means in your context
    // For now, it just shows a success message
    setSuccessMessage("Topic approved successfully!");
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleViewSubtopics = () => {
    if (currentTopics.length === 0) return;

    const currentTopic = currentTopics[currentTopicIndex];
    if (!currentTopic.subtopics || currentTopic.subtopics.length === 0) return;

    // Add to the path to navigate to subtopics
    const newPath = [...currentPath, "subtopics", currentTopicIndex.toString()];
    setCurrentPath(newPath);
  };

  const navigateToPath = (path: string[]) => {
    setCurrentPath(path);
  };

  const handleNavigate = (direction: "prev" | "next") => {
    if (direction === "prev" && currentTopicIndex > 0) {
      setCurrentTopicIndex(currentTopicIndex - 1);
    } else if (
      direction === "next" &&
      currentTopicIndex < currentTopics.length - 1
    ) {
      setCurrentTopicIndex(currentTopicIndex + 1);
    }
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const success = await updateAssessmentMindMap(
        params.assessment_id,
        mindMapData
      );

      if (success) {
        setSuccessMessage("Mind map saved successfully!");
      } else {
        setErrorMessage("Failed to save the mind map. Please try again.");
      }
    } catch (error) {
      console.error("Error saving mind map:", error);
      setErrorMessage("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-8 bg-gray-50 ${inter.className}`}
    >
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Edit Mind Map</h1>
            <p className="text-slate-600">
              Assessment ID: {params.assessment_id}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleSaveAll}
              disabled={isLoading || isSaving}
              className={`px-4 py-2 rounded-lg text-white ${
                isLoading || isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } transition-colors`}
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
            <Link
              href={`/teacher/${params.teacher_id}/assessment/${params.assessment_id}`}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Assessment
            </Link>
          </div>
        </div>

        {/* Breadcrumb navigation */}
        {breadcrumbs.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-3 mb-6 flex items-center overflow-x-auto">
            <div className="text-sm text-gray-600 mr-2">Navigation:</div>
            <div className="flex items-center space-x-2">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 mx-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                  <button
                    onClick={() => navigateToPath(crumb.path)}
                    className={`py-1 px-2 rounded ${
                      currentPath.length === crumb.path.length
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {crumb.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
            <p className="text-gray-600">Loading mind map data...</p>
          </div>
        ) : mindMapData ? (
          <div className="mb-8">
            {currentTopics.length > 0 ? (
              <TopicWidget
                topic={currentTopics[currentTopicIndex]}
                onUpdate={(updatedTopic) => updateTopic(updatedTopic)}
                onRemove={removeTopic}
                onApprove={approveTopic}
                onViewSubtopics={handleViewSubtopics}
                hasSubtopics={
                  currentTopics[currentTopicIndex]?.subtopics &&
                  currentTopics[currentTopicIndex]?.subtopics.length > 0
                }
                currentIndex={currentTopicIndex}
                totalTopics={currentTopics.length}
                onNavigate={handleNavigate}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No topics to display
                </h3>
                {currentPath.length > 0 && (
                  <button
                    onClick={() => {
                      const newPath = currentPath.slice(
                        0,
                        currentPath.length - 2
                      );
                      setCurrentPath(newPath);
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Back to Parent Topic
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-red-600">No mind map data available.</p>
          </div>
        )}
      </div>
    </main>
  );
}
