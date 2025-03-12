"use client";

import { useVapi } from "../../hooks/useVapi";
import { AssistantButton } from "./assistantButton";
import { Display } from "./display";
import { useState } from "react";

interface AssistantProps {
  assessmentId: string;
}

function Assistant({ assessmentId }: AssistantProps) {
  const { toggleCall, callStatus, audioLevel } = useVapi(assessmentId);
  const [speed, setSpeed] = useState(50); // Default to middle speed (50%)

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseInt(e.target.value));
    // Functionality to be implemented later
  };

  return (
    <>
      <div className="chat-history">
        <Display />
      </div>

      {/* AI Speed Control Slider */}
      <div className="speed-control my-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Text Speed</span>
          <span className="text-sm font-medium text-indigo-600">{speed}%</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="10"
            max="100"
            value={speed}
            onChange={handleSpeedChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
      </div>

      <div className="user-input">
        <AssistantButton
          audioLevel={audioLevel}
          callStatus={callStatus}
          toggleCall={toggleCall}
        ></AssistantButton>
      </div>
    </>
  );
}

export { Assistant };
