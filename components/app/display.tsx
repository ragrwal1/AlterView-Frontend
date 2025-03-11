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
    <div className="flex flex-col h-[70vh] relative bg-[#f5f5f7]">
      {/* Main content container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-3xl">
          {/* Display the full transcript */}
          <div className="mb-4">
            <h1 className="text-[#1d1d1f] text-4xl font-bold leading-tight tracking-tight mb-6">
              {fullTranscript}
              {/* Show the active partial with a blinking cursor effect */}
              {activePartial && (
                <span className="text-[#1d1d1f] opacity-80"> {activePartial}</span>
              )}
              {/* Blinking cursor */}
              <span className="inline-block w-2 h-8 bg-[#1d1d1f] ml-1 animate-blink"></span>
            </h1>
          </div>
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

export { Display };
