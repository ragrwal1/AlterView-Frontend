"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  fetchAssessmentMindMap,
  updateAssessmentMindMap,
} from "@/services/assessmentService";
import FloatingIcons from "@/components/app/FloatingIcons";
import { ArrowLeftCircle, BookOpen, Save } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

interface TopicNode {
  topic: any;
  path: string[];
  parent: TopicNode | null;
  children: TopicNode[];
}

// Topic sidebar item component
const TopicSidebarItem = ({
  topic,
  path,
  currentPath,
  level = 0,
  onSelect,
}: {
  topic: any;
  path: string[];
  currentPath: string[];
  level?: number;
  onSelect: (path: string[]) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Check if this topic is in the current path
  const isActive =
    currentPath.length >= path.length &&
    path.every((item, index) => item === currentPath[index]);

  // Function to toggle expanded state
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      <div
        className={`flex items-center py-1 px-2 rounded cursor-pointer ${
          isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onSelect(path)}
      >
        {topic.subtopics && topic.subtopics.length > 0 && (
          <button
            onClick={toggleExpand}
            className="w-5 h-5 mr-1 text-gray-500 hover:text-gray-700 flex-shrink-0"
          >
            {isExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        )}
        <span className="truncate">{topic.name}</span>
      </div>

      {isExpanded && topic.subtopics && topic.subtopics.length > 0 && (
        <div className="mt-1">
          {topic.subtopics.map((subtopic: any, index: number) => (
            <TopicSidebarItem
              key={index}
              topic={subtopic}
              path={[...path, "subtopics", index.toString()]}
              currentPath={currentPath}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Component for editing a single topic widget
const TopicWidget = ({
  topic,
  onUpdate,
  onRemove,
  onViewSubtopics,
  hasSubtopics,
  currentIndex,
  totalTopics,
  onNavigate,
  onUpdateSubtopic,
  onRemoveSubtopic,
  onApproveSubtopic,
}: {
  topic: any;
  onUpdate: (updatedTopic: any) => void;
  onRemove: () => void;
  onViewSubtopics: () => void;
  hasSubtopics: boolean;
  currentIndex: number;
  totalTopics: number;
  onNavigate: (direction: "prev" | "next") => void;
  onUpdateSubtopic: (subtopicIndex: number, updatedSubtopic: any) => void;
  onRemoveSubtopic: (subtopicIndex: number) => void;
  onApproveSubtopic: (subtopicIndex: number) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(topic.name);
  const [editedDescription, setEditedDescription] = useState(
    topic.description || ""
  );

  // State for assessment criteria
  const [editedExcellentUnderstanding, setEditedExcellentUnderstanding] =
    useState<string[]>(topic.assessmentCriteria?.excellentUnderstanding || []);
  const [editedAdequateUnderstanding, setEditedAdequateUnderstanding] =
    useState<string[]>(topic.assessmentCriteria?.adequateUnderstanding || []);
  const [editedMisconceptions, setEditedMisconceptions] = useState<string[]>(
    topic.assessmentCriteria?.misconceptions || []
  );
  const [editedTutorGuidance, setEditedTutorGuidance] = useState<string>(
    topic.assessmentCriteria?.tutorGuidance || ""
  );

  // Helper function to update arrays
  const updateCriteriaItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = value;
      return newItems;
    });
  };

  // Helper function to add empty array item
  const addCriteriaItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prevItems) => [...prevItems, ""]);
  };

  // Helper function to remove array item
  const removeCriteriaItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedTopic = {
      ...topic,
      name: editedName,
      description: editedDescription,
      assessmentCriteria: {
        excellentUnderstanding: editedExcellentUnderstanding.filter(
          (item) => item.trim() !== ""
        ),
        adequateUnderstanding: editedAdequateUnderstanding.filter(
          (item) => item.trim() !== ""
        ),
        misconceptions: editedMisconceptions.filter(
          (item) => item.trim() !== ""
        ),
        tutorGuidance: editedTutorGuidance,
      },
    };
    onUpdate(updatedTopic);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(topic.name);
    setEditedDescription(topic.description || "");
    setEditedExcellentUnderstanding(
      topic.assessmentCriteria?.excellentUnderstanding || []
    );
    setEditedAdequateUnderstanding(
      topic.assessmentCriteria?.adequateUnderstanding || []
    );
    setEditedMisconceptions(topic.assessmentCriteria?.misconceptions || []);
    setEditedTutorGuidance(topic.assessmentCriteria?.tutorGuidance || "");
    setIsEditing(false);
  };

  // Check if assessment criteria exists
  const hasAssessmentCriteria =
    topic.assessmentCriteria &&
    (topic.assessmentCriteria.excellentUnderstanding ||
      topic.assessmentCriteria.adequateUnderstanding ||
      topic.assessmentCriteria.misconceptions ||
      topic.assessmentCriteria.tutorGuidance);

  return (
    <div className="border border-gray-100 rounded-xl p-6 bg-white/90 backdrop-blur-md shadow-apple">
      <div className="flex justify-between items-start mb-5">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-3 py-2 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-alterview-indigo/20 focus:border-alterview-indigo transition-all duration-300"
            />
          ) : (
            <h2 className="text-2xl font-semibold text-gray-800">
              {topic.name}
            </h2>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2 font-medium">
          Description
        </div>
        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alterview-indigo/20 focus:border-alterview-indigo transition-all duration-300"
            rows={3}
          />
        ) : (
          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
            {topic.description || "No description provided"}
          </p>
        )}
      </div>

      {/* Assessment Criteria Section - Simplified UI */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium text-gray-500">
            Assessment Criteria
          </div>
          {!isEditing && hasAssessmentCriteria && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-all"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-5 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {/* Excellent Understanding - Edit Mode */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="text-sm font-medium text-green-700 mb-3">
                Excellent Understanding
              </h4>
              {editedExcellentUnderstanding.map((item, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      updateCriteriaItem(
                        setEditedExcellentUnderstanding,
                        idx,
                        e.target.value
                      )
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all duration-300"
                    placeholder="Enter criteria for excellent understanding"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCriteriaItem(setEditedExcellentUnderstanding, idx);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addCriteriaItem(setEditedExcellentUnderstanding);
                }}
                className="text-green-600 hover:text-green-800 text-sm flex items-center mt-2 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Criterion
              </button>
            </div>

            {/* Adequate Understanding - Edit Mode */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium text-blue-700 mb-3">
                Adequate Understanding
              </h4>
              {editedAdequateUnderstanding.map((item, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      updateCriteriaItem(
                        setEditedAdequateUnderstanding,
                        idx,
                        e.target.value
                      )
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300"
                    placeholder="Enter criteria for adequate understanding"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCriteriaItem(setEditedAdequateUnderstanding, idx);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addCriteriaItem(setEditedAdequateUnderstanding);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-2 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Criterion
              </button>
            </div>

            {/* Tutor Guidance - Edit Mode */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h4 className="text-sm font-medium text-purple-700 mb-3">
                Tutor Guidance
              </h4>
              <textarea
                value={editedTutorGuidance}
                onChange={(e) => setEditedTutorGuidance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
                rows={3}
                placeholder="Enter guidance for tutors"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Display assessment criteria sections if they exist */}
            {hasAssessmentCriteria ? (
              <>
                {/* Excellent Understanding */}
                {topic.assessmentCriteria?.excellentUnderstanding &&
                  topic.assessmentCriteria.excellentUnderstanding.length >
                    0 && (
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
                  )}

                {/* Tutor Guidance */}
                {topic.assessmentCriteria?.tutorGuidance && (
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <h4 className="text-sm font-medium text-purple-700 mb-2">
                      Tutor Guidance
                    </h4>
                    <p className="text-sm pl-2 text-gray-700">
                      {topic.assessmentCriteria.tutorGuidance}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="col-span-full text-center py-4 text-gray-500">
                <p>
                  No assessment criteria defined yet. Click Edit to add
                  criteria.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subtopics Section - Simplified view */}
      {hasSubtopics && (
        <div className="mb-5 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-gray-700">Subtopics</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewSubtopics();
              }}
              className="flex items-center px-3 py-1.5 bg-alterview-gradient text-white rounded-lg hover:shadow-md transition-all duration-300 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              View All Subtopics
            </button>
          </div>

          <div className="space-y-3">
            {topic.subtopics.slice(0, 3).map((subtopic: any, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-medium">{subtopic.name}</h4>
                    {subtopic.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {subtopic.description.length > 100
                          ? subtopic.description.substring(0, 100) + "..."
                          : subtopic.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {topic.subtopics.length > 3 && (
              <div className="text-center py-2">
                <span className="text-sm text-gray-500">
                  +{topic.subtopics.length - 3} more subtopics
                </span>
              </div>
            )}

            {topic.subtopics.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p>No subtopics available.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation and Actions Bar - Simplified */}
      <div className="border-t pt-5 mt-4">
        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("prev");
            }}
            disabled={currentIndex <= 0}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
              currentIndex <= 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-alterview-indigo hover:bg-gray-50 hover:shadow-sm"
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
          <div className="px-3 py-1 bg-gray-50 rounded-lg text-sm text-gray-600 font-medium">
            {currentIndex + 1} of {totalTopics}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("next");
            }}
            disabled={currentIndex >= totalTopics - 1}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
              currentIndex >= totalTopics - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-alterview-indigo hover:bg-gray-50 hover:shadow-sm"
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
        <div className="flex justify-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="flex-1 flex items-center justify-center px-5 py-2.5 bg-alterview-gradient text-white rounded-lg hover:shadow-md transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Save
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="flex items-center justify-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="flex-1 flex items-center justify-center px-5 py-2.5 bg-alterview-indigo text-white rounded-lg hover:bg-alterview-violet hover:shadow-md transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Topic
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="flex items-center justify-center px-4 py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);

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
        setLoaded(true);
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

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Functions for handling subtopics
  const updateSubtopic = (subtopicIndex: number, updatedSubtopic: any) => {
    if (!mindMapData || currentPath.length > 0 || currentTopics.length === 0)
      return;

    const newMindMapData = { ...mindMapData };
    const currentTopic = currentTopics[currentTopicIndex];

    // Make sure subtopics array exists
    if (!currentTopic.subtopics) {
      currentTopic.subtopics = [];
    }

    // Update the subtopic
    currentTopic.subtopics[subtopicIndex] = updatedSubtopic;

    setMindMapData(newMindMapData);
    setSuccessMessage("Subtopic updated successfully!");
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const removeSubtopic = (subtopicIndex: number) => {
    if (!mindMapData || currentPath.length > 0 || currentTopics.length === 0)
      return;

    const newMindMapData = { ...mindMapData };
    const currentTopic = currentTopics[currentTopicIndex];

    // Remove the subtopic
    if (
      currentTopic.subtopics &&
      currentTopic.subtopics.length > subtopicIndex
    ) {
      currentTopic.subtopics.splice(subtopicIndex, 1);

      setMindMapData(newMindMapData);
      setSuccessMessage("Subtopic removed successfully!");
      setTimeout(() => setSuccessMessage(null), 2000);
    }
  };

  const approveSubtopic = (subtopicIndex: number) => {
    // This is a placeholder for whatever "approve" means in your context
    // For now, it just shows a success message
    setSuccessMessage(`Subtopic ${subtopicIndex + 1} approved successfully!`);
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-10rem)] px-4 py-8 overflow-hidden">
      {/* Background animation */}
      <FloatingIcons />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div
          className={`transition-all duration-700 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2 animate-fadeIn">
                Edit Mind Map
              </h1>
              <p
                className="text-gray-500 text-base animate-fadeIn"
                style={{ animationDelay: "100ms" }}
              >
                Assessment ID: {params.assessment_id}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveAll}
                disabled={isLoading || isSaving}
                className={`inline-flex items-center px-4 py-2 ${
                  isLoading || isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-alterview-gradient hover:shadow-md"
                } text-white rounded-lg transition-all duration-300 animate-fadeIn`}
                style={{ animationDelay: "150ms" }}
              >
                <Save className="h-4 w-4 mr-2" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>

              <Link
                href={`/teacher/${params.teacher_id}/assessment/${params.assessment_id}`}
                className="inline-flex items-center p-2.5 text-alterview-indigo hover:text-alterview-violet transition-colors rounded-lg hover:bg-gray-50 animate-fadeIn"
                style={{ animationDelay: "200ms" }}
              >
                <ArrowLeftCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {/* Sidebar */}
          <div className="md:w-64 w-full mb-5 md:mb-0">
            <div className="bg-white/90 backdrop-blur-md shadow-apple rounded-xl overflow-hidden h-full">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-alterview-indigo mr-2" />
                    <h3 className="font-medium text-gray-800">
                      Topics Overview
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {mindMapData && (
                  <TopicSidebarItem
                    topic={mindMapData.topic}
                    path={[]}
                    currentPath={currentPath}
                    onSelect={navigateToPath}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Breadcrumb navigation */}
            {breadcrumbs.length > 0 && (
              <div
                className={`bg-white/90 backdrop-blur-md rounded-xl shadow-apple p-3 mb-5 flex items-center overflow-x-auto transition-all duration-700 ease-out ${
                  loaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ animationDelay: "250ms" }}
              >
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
                            ? "bg-blue-100 text-alterview-indigo font-medium"
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
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 transition-all duration-700 ease-out opacity-100 translate-y-0"
                style={{ animationDelay: "300ms" }}
              >
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 transition-all duration-700 ease-out opacity-100 translate-y-0"
                style={{ animationDelay: "300ms" }}
              >
                {successMessage}
              </div>
            )}

            {isLoading ? (
              <div
                className="bg-white/90 backdrop-blur-md rounded-xl shadow-apple p-12 text-center transition-all duration-700 ease-out opacity-100 translate-y-0"
                style={{ animationDelay: "300ms" }}
              >
                <div className="inline-block animate-spin h-8 w-8 border-4 border-alterview-indigo border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-600">Loading mind map data...</p>
              </div>
            ) : mindMapData ? (
              <div
                className="mb-8 transition-all duration-700 ease-out opacity-100 translate-y-0"
                style={{ animationDelay: "350ms" }}
              >
                {currentTopics.length > 0 ? (
                  <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-apple overflow-hidden">
                    <TopicWidget
                      topic={currentTopics[currentTopicIndex]}
                      onUpdate={(updatedTopic) => updateTopic(updatedTopic)}
                      onRemove={removeTopic}
                      onViewSubtopics={handleViewSubtopics}
                      hasSubtopics={
                        currentTopics[currentTopicIndex]?.subtopics &&
                        currentTopics[currentTopicIndex]?.subtopics.length > 0
                      }
                      currentIndex={currentTopicIndex}
                      totalTopics={currentTopics.length}
                      onNavigate={handleNavigate}
                      onUpdateSubtopic={updateSubtopic}
                      onRemoveSubtopic={removeSubtopic}
                      onApproveSubtopic={approveSubtopic}
                    />
                  </div>
                ) : (
                  <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-apple p-8 text-center">
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
                        className="mt-4 px-4 py-2 bg-alterview-gradient text-white rounded-xl hover:shadow-md transition-all duration-300"
                      >
                        Back to Parent Topic
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="bg-white/90 backdrop-blur-md rounded-xl shadow-apple p-12 text-center transition-all duration-700 ease-out opacity-100 translate-y-0"
                style={{ animationDelay: "300ms" }}
              >
                <p className="text-red-600">No mind map data available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
