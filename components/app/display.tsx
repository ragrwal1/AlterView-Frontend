import { Message, MessageTypeEnum, TranscriptMessageTypeEnum, TranscriptMessage } from "@/lib/types/conversation.type";
import { vapi } from "@/lib/vapi.sdk";
import React, { useEffect, useRef, useState } from "react";

function Display() {
  // Store the complete transcript as a single string
  const [fullTranscript, setFullTranscript] = useState<string>("");
  const [activePartial, setActivePartial] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when transcript changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [fullTranscript, activePartial]);

  useEffect(() => {
    const onMessageUpdate = (message: Message) => {
      // Only process transcript messages
      if (message.type === MessageTypeEnum.TRANSCRIPT && 'transcript' in message) {
        const text = message.transcript.trim();
        
        // Skip JSON and system messages
        if (text.startsWith('{') || text.includes('"type":') || text.includes('"status":')) {
          return;
        }
        
        // Handle partial transcripts (typing effect)
        if (message.transcriptType === TranscriptMessageTypeEnum.PARTIAL) {
          setActivePartial(text);
        } 
        // Handle final transcripts (add to full transcript)
        else if (message.transcriptType === TranscriptMessageTypeEnum.FINAL) {
          setFullTranscript(prev => {
            // If this is the first message, just return it
            if (!prev) return text;
            
            // Add proper spacing based on punctuation
            if (prev.endsWith(",") || prev.endsWith("-") || prev.endsWith(":") || prev.endsWith(";")) {
              return `${prev} ${text}`;
            } else if (prev.endsWith(".") || prev.endsWith("?") || prev.endsWith("!")) {
              return `${prev} ${text}`;
            } else {
              return `${prev} ${text}`;
            }
          });
          setActivePartial("");
        }
      }
    };

    const reset = () => {
      setFullTranscript("");
      setActivePartial("");
    };

    vapi.on("message", onMessageUpdate);
    vapi.on("call-end", reset);
    return () => {
      vapi.off("message", onMessageUpdate);
      vapi.off("call-end", reset);
    };
  }, []);

  return (
    <div className="flex flex-col h-[70vh] relative bg-gradient-to-b from-white to-gray-50 shadow-soft rounded-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-100 flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-alterview-indigo animate-pulse"></div>
        <h2 className="text-lg font-medium text-gray-800">AlterView Assistant</h2>
      </div>
      
      {/* Main content container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto scrollbar-thin">
        <div className="w-full max-w-3xl">
          {!fullTranscript && !activePartial ? (
            <div className="text-center text-gray-500 animate-pulse">
              <p className="text-xl">Waiting for conversation to begin...</p>
              <p className="mt-2">Click the microphone button below to start</p>
            </div>
          ) : (
            /* Display the full transcript */
            <div className="mb-4 animate-fadeIn">
              <p className="text-gray-800 text-xl leading-relaxed tracking-wide">
                {fullTranscript}
                {/* Show the active partial with a blinking cursor effect */}
                {activePartial && (
                  <span className="text-gray-600"> {activePartial}</span>
                )}
                {/* Blinking cursor */}
                <span className="inline-block w-1.5 h-5 bg-alterview-indigo ml-1 animate-pulse"></span>
              </p>
            </div>
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

export { Display };
