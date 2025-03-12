"use client";

import { assistant } from "@/assistants/assistant";
import { createCustomAssistant } from "@/assistants/assistant";
import { fetchAssessmentPromptData } from "@/services/assessmentService";
import { postAssessmentResult } from "@/services/supabaseService";

import {
  Message,
  MessageTypeEnum,
  TranscriptMessage,
  TranscriptMessageTypeEnum,
} from "@/lib/types/conversation.type";
import { useEffect, useState } from "react";
// import { MessageActionTypeEnum, useMessages } from "./useMessages";
import { vapi } from "@/lib/vapi.sdk";
import { useRouter, usePathname } from "next/navigation";

export enum CALL_STATUS {
  INACTIVE = "inactive",
  ACTIVE = "active",
  LOADING = "loading",
}

export function useVapi(assessmentId?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [callStatus, setCallStatus] = useState<CALL_STATUS>(
    CALL_STATUS.INACTIVE
  );

  const [messages, setMessages] = useState<Message[]>([]);

  const [activeTranscript, setActiveTranscript] =
    useState<TranscriptMessage | null>(null);

  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    const onSpeechStart = () => setIsSpeechActive(true);
    const onSpeechEnd = () => {
      console.log("Speech has ended");
      setIsSpeechActive(false);
    };

    const onCallStartHandler = () => {
      console.log("Call has started");
      setCallStatus(CALL_STATUS.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("Call has stopped");
      setCallStatus(CALL_STATUS.INACTIVE);
      
      // Log the final transcript when the call ends
      const finalTranscript = formatTranscript(messages);
      console.log("Final Chat Transcript:");
      console.log(finalTranscript);
    };

    const onVolumeLevel = (volume: number) => {
      setAudioLevel(volume);
    };

    const onMessageUpdate = (message: Message) => {
      console.log("message", message);
      if (
        message.type === MessageTypeEnum.TRANSCRIPT &&
        message.transcriptType === TranscriptMessageTypeEnum.PARTIAL
      ) {
        setActiveTranscript(message);
      } else {
        setMessages((prev) => [...prev, message]);
        setActiveTranscript(null);
      }
    };

    const onError = (e: any) => {
      setCallStatus(CALL_STATUS.INACTIVE);
      console.error(e);
    };

    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("call-start", onCallStartHandler);
    vapi.on("call-end", onCallEnd);
    vapi.on("volume-level", onVolumeLevel);
    vapi.on("message", onMessageUpdate);
    vapi.on("error", onError);

    return () => {
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("call-start", onCallStartHandler);
      vapi.off("call-end", onCallEnd);
      vapi.off("volume-level", onVolumeLevel);
      vapi.off("message", onMessageUpdate);
      vapi.off("error", onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    setCallStatus(CALL_STATUS.LOADING);
    
    try {
      let assistantConfig = assistant;
      
      // If assessmentId is provided, fetch custom prompt data
      if (assessmentId) {
        console.log(`Fetching prompt data for assessment: ${assessmentId}`);
        const promptData = await fetchAssessmentPromptData(assessmentId);
        assistantConfig = createCustomAssistant(promptData);
      }
      
      const response = vapi.start(assistantConfig);
      response.then((res) => {
        console.log("call", res);
      });
    } catch (error) {
      console.error("Error starting call:", error);
      setCallStatus(CALL_STATUS.INACTIVE);
    }
  };

  // Function to extract student ID from the URL path
  const getStudentIdFromPath = (): string => {
    // Expected path formats:
    // 1. /assessment/{studentId}/assessment/{assessmentId}
    // 2. /student/{studentId}/assessment/{assessmentId}
    // or similar patterns with student ID in the path
    const pathParts = pathname?.split('/') || [];
    
    // Check for student ID in path after 'student' segment
    const studentIndex = pathParts.findIndex(part => part === 'student');
    if (studentIndex !== -1 && studentIndex + 1 < pathParts.length) {
      return pathParts[studentIndex + 1];
    }
    
    // Check for student ID in path after 'assessment' segment (if URL is /assessment/{studentId}/...)
    const assessmentIndex = pathParts.findIndex(part => part === 'assessment');
    if (assessmentIndex !== -1 && assessmentIndex + 1 < pathParts.length) {
      return pathParts[assessmentIndex + 1];
    }
    
    // Fallback to localStorage if not found in URL
    const storedStudentId = localStorage.getItem('studentId');
    if (storedStudentId) {
      return storedStudentId;
    }
    
    // Default fallback
    console.warn('Could not determine student ID from path or localStorage, using default');
    return '1';
  };

  const stop = () => {
    setCallStatus(CALL_STATUS.LOADING);
    
    // Log the final transcript when the user manually stops the call
    const finalTranscript = formatTranscript(messages);
    console.log("Final Chat Transcript:");
    console.log(finalTranscript);
    
    // Get student ID from URL path
    const studentIdStr = getStudentIdFromPath();
    
    // Ensure we have a valid integer for student_id (default to 1 if parsing fails)
    const studentId = parseInt(studentIdStr, 10) || 1;
    
    // Use a default assessment ID of "1" if not provided
    const assessmentIdToUse = assessmentId || "1";
    
    // Convert assessmentId to integer if it's a string
    const assessmentIdInt = typeof assessmentIdToUse === 'string' ? parseInt(assessmentIdToUse, 10) : assessmentIdToUse;
    
    // Submit the assessment results to the API if assessmentId is provided
    if (assessmentId) {
      console.log('Submitting assessment results to Supabase');
      
      // Use the postAssessmentResult function from supabaseService
      postAssessmentResult(
        assessmentIdInt,  // assessment_id
        1,                // teacher_id (hardcoded to 1 as in original code)
        studentId,        // student_id
        null,             // voice_recording_id (null as requested)
        finalTranscript,  // transcript
        null              // mindmap (null as requested)
      )
      .then(response => {
        console.log('Assessment results submitted successfully:', response);
        
        // Extract the generated ID from the response
        const generatedResultId = response.generatedId;
        console.log('Generated assessment result ID:', generatedResultId);
        
        // Store the generated ID in localStorage for potential future use
        localStorage.setItem('assessmentResultId', generatedResultId.toString());
        
        // Redirect to the results page using the generated result ID
        setTimeout(() => {
          router.push(`/student/${studentIdStr}/results/${generatedResultId}`);
        }, 500);
      })
      .catch(error => {
        console.error('Error submitting assessment results:', error);
        
        // Log the transcript to the console as a fallback
        console.log('Transcript that would have been submitted:');
        console.log(finalTranscript);
        
        // Still redirect even if the API call fails, but use the original assessment ID
        setTimeout(() => {
          router.push(`/student/${studentIdStr}/results/${assessmentIdToUse}`);
        }, 500);
      });
    } else {
      // If no assessmentId is provided, just navigate to the results page with default ID "1"
      console.log('No assessment ID provided, navigating to results page with default ID "1"');
      setTimeout(() => {
        router.push(`/student/${studentIdStr}/results/1`);
      }, 500);
    }
    
    vapi.stop();
  };

  const toggleCall = () => {
    if (callStatus == CALL_STATUS.ACTIVE) {
      stop();
    } else {
      start();
    }
  };

  // Helper function to format the transcript
  const formatTranscript = (msgs: Message[]): string => {
    // Filter only transcript messages with FINAL type
    const transcriptMsgs = msgs.filter(
      msg => 
        msg.type === MessageTypeEnum.TRANSCRIPT && 
        'transcriptType' in msg && 
        msg.transcriptType === TranscriptMessageTypeEnum.FINAL
    ) as TranscriptMessage[];
    
    // Format the transcript with role labels
    return transcriptMsgs.map(msg => 
      `${msg.role.toUpperCase()}: ${msg.transcript}`
    ).join('\n\n');
  };

  return {
    isSpeechActive,
    callStatus,
    audioLevel,
    activeTranscript,
    messages,
    start,
    stop,
    toggleCall,
  };
}
