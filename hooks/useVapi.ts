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

export enum CALL_STATUS {
  INACTIVE = "inactive",
  ACTIVE = "active",
  LOADING = "loading",
}

export function useVapi(assessmentId?: string) {
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

  const stop = () => {
    setCallStatus(CALL_STATUS.LOADING);
    
    // Log the final transcript when the user manually stops the call
    const finalTranscript = formatTranscript(messages);
    console.log("Final Chat Transcript:");
    console.log(finalTranscript);
    
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
