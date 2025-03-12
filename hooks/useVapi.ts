"use client";

import { assistant } from "@/assistants/assistant";
import { createCustomAssistant } from "@/assistants/assistant";
import { fetchAssessmentPromptData } from "@/services/assessmentService";

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
    // Expected path format: /student/{studentId}/assessment/{assessmentId}
    // or similar pattern with student ID in the path
    const pathParts = pathname?.split('/') || [];
    const studentIndex = pathParts.findIndex(part => part === 'student');
    
    if (studentIndex !== -1 && studentIndex + 1 < pathParts.length) {
      return pathParts[studentIndex + 1];
    }
    
    // Fallback to localStorage if not found in URL
    return localStorage.getItem('studentId') || 'default';
  };

  const stop = () => {
    setCallStatus(CALL_STATUS.LOADING);
    
    // Log the final transcript when the user manually stops the call
    const finalTranscript = formatTranscript(messages);
    console.log("Final Chat Transcript:");
    console.log(finalTranscript);
    
    // Submit the assessment results to the API
    if (assessmentId) {
      // Get student ID from URL path and convert to integer
      const studentIdStr = getStudentIdFromPath();
      // Ensure we have a valid integer for student_id (default to 1 if parsing fails)
      const studentId = parseInt(studentIdStr, 10) || 1;
      
      // Convert assessmentId to integer if it's a string
      const assessmentIdInt = typeof assessmentId === 'string' ? parseInt(assessmentId, 10) : assessmentId;
      
      // Create the mindmap as a JSON string
      const mindmapJson = JSON.stringify({
      });
      
      // Prepare the payload for the API request
      const payload = {
        student_id: studentId,
        teacher_id: 1, // Already an integer
        assessment_id: assessmentIdInt,
        transcript: finalTranscript,
        mindmap: "{}"
      };
      
      console.log('Submitting assessment results with payload:', payload);
      
      // Construct query parameters for GET request
      const queryParams = new URLSearchParams({
        student_id: payload.student_id.toString(),
        assessment_id: payload.assessment_id.toString(),
        transcript: payload.transcript,
        mindmap: payload.mindmap
      }).toString();
      
      // Make the API request with CORS headers using GET method
      fetch(`https://alterview-api.vercel.app/api/v1/assessment-results/?${queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Origin': window.location.origin,
          // Update headers for GET request
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Accept'
        },
        // Add credentials if needed for cookies/auth
        credentials: 'include',
        mode: 'cors'
        // No body for GET request
      })
      .then(async response => {
        // Log the complete response information
        console.log('API Response Status:', response.status, response.statusText);
        
        // Clone the response to read it twice (once for logging, once for processing)
        const responseClone = response.clone();
        
        try {
          // Try to parse and log the response body as JSON
          const responseBody = await responseClone.json();
          console.log('API Response Body:', responseBody);
        } catch (e) {
          // If it's not JSON, try to get it as text
          const responseText = await responseClone.text();
          console.log('API Response Text:', responseText);
        }
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        return response.json();
      })
      .then(data => {
        console.log('Assessment results submitted successfully:', data);
        
        // Redirect to the results page after successful submission
        setTimeout(() => {
          router.push(`/student/${studentIdStr}/results/${assessmentId}`);
        }, 500);
      })
      .catch(error => {
        console.error('Error submitting assessment results:', error);
        
        // Log the transcript to the console as a fallback
        console.log('Transcript that would have been submitted:');
        console.log(finalTranscript);
        
        // Still redirect even if the API call fails
        setTimeout(() => {
          router.push(`/student/${studentIdStr}/results/${assessmentId}`);
        }, 500);
      });
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
