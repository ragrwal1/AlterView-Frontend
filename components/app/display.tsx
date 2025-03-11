import { Message, MessageTypeEnum, TranscriptMessageTypeEnum, MessageRoleEnum } from "@/lib/types/conversation.type";
import { vapi } from "@/lib/vapi.sdk";
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";

// Configuration constants
const TELEPROMPTER_CONFIG = {
  // Container settings
  container: {
    height: '70vh',
    widthPercentage: 75, // Percentage of viewport width
    borderRadius: '1.5rem',
    boxShadow: '0 0 40px rgba(0, 0, 0, 0.1)',
    headerHeight: 60, // in pixels
  },
  // Text settings
  text: {
    fontSize: 'text-5xl',
    fontWeight: 'font-extrabold',
    lineHeight: 'leading-snug',
    letterSpacing: 'tracking-normal',
    marginBetweenSegments: 'mb-3',
    padding: 'py-20',
    transitionDuration: 300, // ms for smooth text transitions
  },
  // Colors
  colors: {
    assistantText: 'text-indigo-600',
    userText: 'text-gray-900',
    background: 'bg-black/5',
    border: 'border-white/20',
    cursor: {
      color: 'bg-indigo-600',
      width: 'w-2',
      height: 'h-7',
    },
  },
  // Effects
  effects: {
    inwardGlow: {
      purple: 'rgba(79, 70, 229, 0.15)', // Indigo color with low opacity
      blue: 'rgba(59, 130, 246, 0.15)', // Blue color with low opacity
      intensity: {
        outer: {
          spread: '80px',
          blur: '30px',
        },
        inner: {
          spread: '40px',
          blur: '20px',
        },
      },
    },
    fadeIn: 'transition-opacity duration-300 ease-in-out',
  },
};

// Interface for transcript segments with role information
interface TranscriptSegment {
  role: MessageRoleEnum;
  text: string;
}

function Display() {
  // Store transcript segments with role information
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [activePartial, setActivePartial] = useState<string>("");
  const [activeRole, setActiveRole] = useState<MessageRoleEnum | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState<{height: number, width: number}>({height: 0, width: 0});
  const activePartialRef = useRef<string>("");

  // Update container dimensions only when window size changes
  useLayoutEffect(() => {
    const updateContainerDimensions = () => {
      if (containerRef.current) {
        // Set container width based on config
        const viewportWidth = window.innerWidth;
        const containerWidth = viewportWidth * (TELEPROMPTER_CONFIG.container.widthPercentage / 100);
        
        setContainerDimensions({
          height: containerRef.current.clientHeight,
          width: containerWidth
        });
      }
    };

    updateContainerDimensions();
    window.addEventListener('resize', updateContainerDimensions);
    return () => window.removeEventListener('resize', updateContainerDimensions);
  }, []);

  // Auto-scroll to bottom when transcript changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcriptSegments, activePartial]);

  // Helper function to intelligently join text segments
  const joinTextSegments = (existingText: string, newText: string): string => {
    // Trim both texts to avoid extra spaces
    existingText = existingText.trim();
    newText = newText.trim();
    
    if (!existingText) return newText;
    if (!newText) return existingText;
    
    // Check if the new text is already contained in the existing text
    // This prevents duplication when partial transcripts overlap
    if (existingText.endsWith(newText)) {
      return existingText;
    }
    
    // Find the largest overlap between the end of existing text and start of new text
    let maxOverlap = 0;
    const minLength = Math.min(existingText.length, newText.length);
    
    for (let i = 1; i <= minLength; i++) {
      const endOfExisting = existingText.slice(-i);
      const startOfNew = newText.slice(0, i);
      
      if (endOfExisting === startOfNew) {
        maxOverlap = i;
      }
    }
    
    // Join with proper spacing based on punctuation and overlap
    if (maxOverlap > 0) {
      return existingText + newText.slice(maxOverlap);
    } else if (existingText.endsWith(",") || existingText.endsWith("-") || 
        existingText.endsWith(":") || existingText.endsWith(";")) {
      return `${existingText} ${newText}`;
    } else if (existingText.endsWith(".") || existingText.endsWith("?") || 
               existingText.endsWith("!")) {
      return `${existingText} ${newText}`;
    } else {
      // Add space if not ending with punctuation and not starting with punctuation
      const needsSpace = !newText.startsWith(",") && !newText.startsWith(".") && 
                         !newText.startsWith("!") && !newText.startsWith("?") &&
                         !newText.startsWith(";") && !newText.startsWith(":");
      return needsSpace ? `${existingText} ${newText}` : `${existingText}${newText}`;
    }
  };

  useEffect(() => {
    const onMessageUpdate = (message: Message) => {
      // Only process transcript messages
      if (message.type === MessageTypeEnum.TRANSCRIPT && 'transcript' in message) {
        const text = message.transcript.trim();
        const role = message.role;
        
        // Skip JSON and system messages
        if (text.startsWith('{') || text.includes('"type":') || text.includes('"status":')) {
          return;
        }
        
        // Handle partial transcripts (typing effect)
        if (message.transcriptType === TranscriptMessageTypeEnum.PARTIAL) {
          // Update the ref immediately to avoid race conditions
          activePartialRef.current = text;
          
          // Debounce the state update for smoother transitions
          setActivePartial(prevPartial => {
            // If the new text is very similar to the previous, don't update to avoid flickering
            if (text.length > 0 && prevPartial.length > 0) {
              const similarity = text.includes(prevPartial) || prevPartial.includes(text);
              if (similarity && Math.abs(text.length - prevPartial.length) < 5) {
                return prevPartial;
              }
            }
            return text;
          });
          setActiveRole(role);
        } 
        // Handle final transcripts (add to transcript segments)
        else if (message.transcriptType === TranscriptMessageTypeEnum.FINAL) {
          // Set transitioning state to enable smooth animation
          setIsTransitioning(true);
          
          // Use a small timeout to create a smooth transition effect
          setTimeout(() => {
            setTranscriptSegments(prev => {
              // If this is the first segment, just add it
              if (prev.length === 0) {
                return [{ role, text }];
              }
              
              const lastSegment = prev[prev.length - 1];
              
              // If the role is the same as the last segment, intelligently join the text
              if (lastSegment.role === role) {
                const updatedSegments = [...prev];
                const updatedText = joinTextSegments(lastSegment.text, text);
                
                updatedSegments[updatedSegments.length - 1] = {
                  ...lastSegment,
                  text: updatedText
                };
                
                return updatedSegments;
              } else {
                // If the role is different, create a new segment
                return [...prev, { role, text }];
              }
            });
            
            // Clear the active partial with a small delay for smooth transition
            setTimeout(() => {
              setActivePartial("");
              setActiveRole(null);
              setIsTransitioning(false);
            }, TELEPROMPTER_CONFIG.text.transitionDuration / 2);
          }, TELEPROMPTER_CONFIG.text.transitionDuration / 2);
        }
      }
    };

    const reset = () => {
      setTranscriptSegments([]);
      setActivePartial("");
      setActiveRole(null);
      activePartialRef.current = "";
    };

    vapi.on("message", onMessageUpdate);
    vapi.on("call-end", reset);
    return () => {
      vapi.off("message", onMessageUpdate);
      vapi.off("call-end", reset);
    };
  }, []);

  return (
    <div className="flex justify-center w-full">
      <div 
        ref={containerRef}
        className={`flex flex-col h-[${TELEPROMPTER_CONFIG.container.height}] relative ${TELEPROMPTER_CONFIG.colors.background} backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border ${TELEPROMPTER_CONFIG.colors.border}`}
        style={{ 
          width: containerDimensions.width > 0 ? `${containerDimensions.width}px` : `${TELEPROMPTER_CONFIG.container.widthPercentage}%`,
          boxShadow: TELEPROMPTER_CONFIG.container.boxShadow
        }}
      >
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md p-4 border-b border-gray-100 flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-alterview-indigo animate-pulse"></div>
          <h2 className="text-lg font-medium text-gray-800">AlterView Assistant</h2>
        </div>
        
        {/* Main content container - static dimensions based on container size */}
        <div 
          className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-hidden"
          style={{ 
            height: containerDimensions.height > 0 ? `${containerDimensions.height - TELEPROMPTER_CONFIG.container.headerHeight}px` : 'auto'
          }}
        >
          {/* Apple-style purple and blue inward gradient effect around the edges */}
          <div className="absolute inset-0 pointer-events-none" style={{ 
            boxShadow: `inset 0 0 ${TELEPROMPTER_CONFIG.effects.inwardGlow.intensity.outer.spread} ${TELEPROMPTER_CONFIG.effects.inwardGlow.intensity.outer.blur} ${TELEPROMPTER_CONFIG.effects.inwardGlow.purple}, inset 0 0 ${TELEPROMPTER_CONFIG.effects.inwardGlow.intensity.inner.spread} ${TELEPROMPTER_CONFIG.effects.inwardGlow.intensity.inner.blur} ${TELEPROMPTER_CONFIG.effects.inwardGlow.blue}`,
            borderRadius: 'inherit'
          }}></div>
          
          <div className="w-full max-w-3xl h-full flex flex-col items-center justify-center relative">
            {!transcriptSegments.length && !activePartial ? (
              <div className="text-center text-gray-500 animate-pulse">
                <p className={TELEPROMPTER_CONFIG.text.fontSize + " " + TELEPROMPTER_CONFIG.text.fontWeight}>Waiting for conversation to begin...</p>
                <p className="mt-2 text-lg">Click the microphone button below to start</p>
              </div>
            ) : (
              /* Display the transcript segments */
              <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative">
                {/* Transcript content */}
                <div className={`w-full text-center overflow-y-auto overflow-x-hidden scrollbar-hide ${TELEPROMPTER_CONFIG.text.padding}`}>
                  {transcriptSegments.map((segment, index) => (
                    <div 
                      key={index} 
                      className={`${TELEPROMPTER_CONFIG.text.marginBetweenSegments} ${
                        segment.role === MessageRoleEnum.ASSISTANT 
                          ? TELEPROMPTER_CONFIG.colors.assistantText 
                          : TELEPROMPTER_CONFIG.colors.userText
                      } ${TELEPROMPTER_CONFIG.effects.fadeIn}`}
                    >
                      <p className={`${TELEPROMPTER_CONFIG.text.fontSize} ${TELEPROMPTER_CONFIG.text.fontWeight} ${TELEPROMPTER_CONFIG.text.lineHeight} ${TELEPROMPTER_CONFIG.text.letterSpacing} break-words`}>
                        {segment.text}
                      </p>
                    </div>
                  ))}
                  
                  {/* Show the active partial with a blinking cursor effect */}
                  {activePartial && activeRole && (
                    <div 
                      className={`${TELEPROMPTER_CONFIG.text.marginBetweenSegments} ${
                        activeRole === MessageRoleEnum.ASSISTANT 
                          ? TELEPROMPTER_CONFIG.colors.assistantText 
                          : TELEPROMPTER_CONFIG.colors.userText
                      } ${isTransitioning ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`}
                    >
                      <p className={`${TELEPROMPTER_CONFIG.text.fontSize} ${TELEPROMPTER_CONFIG.text.fontWeight} ${TELEPROMPTER_CONFIG.text.lineHeight} ${TELEPROMPTER_CONFIG.text.letterSpacing} break-words`}>
                        {activePartial}
                        {/* Blinking cursor */}
                        <span className={`inline-block ${TELEPROMPTER_CONFIG.colors.cursor.width} ${TELEPROMPTER_CONFIG.colors.cursor.height} ${TELEPROMPTER_CONFIG.colors.cursor.color} ml-1 animate-pulse`}></span>
                      </p>
                    </div>
                  )}
                  
                  {/* Invisible element to scroll to */}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Display };
