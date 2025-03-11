import { assistant as defaultAssistant } from "@/assistants/assistant";

export interface AssistmentPromptData {
  systemPrompt: string;
  firstMessage: string;
}

interface AssessmentApiResponse {
  id: number;
  created_at: string;
  name: string;
  first_question: string;
  system_prompt: string;
  mindmap_template: Record<string, any>;
}

/**
 * Fetches assessment prompt data from the backend
 * @param assessmentId The ID of the assessment
 * @returns Promise with the assessment prompt data
 */
export async function fetchAssessmentPromptData(assessmentId: string): Promise<AssistmentPromptData> {
  try {
    // Fetch assessment data from the API
    const response = await fetch('https://alterview-api.vercel.app/api/v1/assessments');
    
    if (!response.ok) {
      throw new Error('Failed to fetch assessment data');
    }
    
    const assessments: AssessmentApiResponse[] = await response.json();
    
    // Find the assessment with the matching ID
    const assessment = assessments.find(a => a.id.toString() === assessmentId);
    
    if (!assessment) {
      console.warn(`Assessment with ID ${assessmentId} not found, using default values`);
      return {
        systemPrompt: defaultAssistant.model.systemPrompt,
        firstMessage: defaultAssistant.firstMessage
      };
    }
    
    // Map the API response to the expected format
    return {
      systemPrompt: assessment.system_prompt,
      firstMessage: assessment.first_question
    };
  } catch (error) {
    console.error('Error fetching assessment prompt data:', error);
    // Fallback to default values if API call fails
    return {
      systemPrompt: defaultAssistant.model.systemPrompt,
      firstMessage: defaultAssistant.firstMessage
    };
  }
} 