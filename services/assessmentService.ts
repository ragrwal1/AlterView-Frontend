import { assistant as defaultAssistant } from "@/assistants/assistant";
import { getMindmap } from "./supabaseService";

export interface AssistmentPromptData {
  systemPrompt: string;
  firstMessage: string;
}

export interface CreateAssessmentData {
  title: string;
  description: string;
  mindmap_template?: Record<string, any>;
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
export async function fetchAssessmentPromptData(
  assessmentId: string
): Promise<AssistmentPromptData> {
  try {
    // Fetch assessment data from the API
    const response = await fetch(
      "https://alterview-api.vercel.app/api/v1/assessments"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch assessment data");
    }

    const assessments: AssessmentApiResponse[] = await response.json();

    // Find the assessment with the matching ID
    const assessment = assessments.find(
      (a) => a.id.toString() === assessmentId
    );

    if (!assessment) {
      console.warn(
        `Assessment with ID ${assessmentId} not found, using default values`
      );
      return {
        systemPrompt: defaultAssistant.model.systemPrompt,
        firstMessage: defaultAssistant.firstMessage,
      };
    }

    // Get the mindmap from Supabase
    let mindmapString = "";
    try {
      const mindmap = await getMindmap(parseInt(assessmentId));
      if (mindmap) {
        mindmapString = `\n\nMindmap: ${JSON.stringify(mindmap)}`;
      }
    } catch (error) {
      console.error("Error fetching mindmap:", error);
    }

    // Map the API response to the expected format and append mindmap to system prompt
    return {
      systemPrompt: assessment.system_prompt + mindmapString,
      firstMessage: assessment.first_question,
    };
  } catch (error) {
    console.error("Error fetching assessment prompt data:", error);
    // Fallback to default values if API call fails
    return {
      systemPrompt: defaultAssistant.model.systemPrompt,
      firstMessage: defaultAssistant.firstMessage,
    };
  }
}

/**
 * Creates a new assessment with the provided data
 * @param data Assessment data including title, description, and optional mind map template
 * @returns Promise with the created assessment ID
 */
export async function createAssessment(
  data: CreateAssessmentData
): Promise<string> {
  try {
    // In a real implementation, this would send a POST request to the API
    // For demo purposes, we'll just simulate a successful response
    console.log("Creating assessment with data:", data);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return a mock assessment ID
    return `new-assessment-${Date.now()}`;

    // Actual implementation would look something like:
    /*
    const response = await fetch('https://alterview-api.vercel.app/api/v1/assessments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.title,
        description: data.description,
        mindmap_template: data.mindmap_template || {},
        // Add other required fields based on API requirements
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create assessment');
    }
    
    const result = await response.json();
    return result.id.toString();
    */
  } catch (error) {
    console.error("Error creating assessment:", error);
    throw error;
  }
}

/**
 * Fetches the mind map template for a specific assessment
 * @param assessmentId The ID of the assessment
 * @returns Promise with the mind map template data
 */
export async function fetchAssessmentMindMap(
  assessmentId: string
): Promise<Record<string, any>> {
  try {
    // For this demo, we'll use the static file for CSE 310
    // In a real implementation, this would fetch from the API
    if (assessmentId === "assessment1") {
      const response = await fetch("/dsa-cse310-mindmap.json");
      if (!response.ok) {
        throw new Error("Failed to fetch mind map data");
      }
      return await response.json();
    }

    // For other assessments, use the generic template
    const response = await fetch("/mindmap-template-example.json");
    if (!response.ok) {
      throw new Error("Failed to fetch mind map data");
    }
    return await response.json();

    // Actual implementation would look something like:
    /*
    const response = await fetch(`https://alterview-api.vercel.app/api/v1/assessments/${assessmentId}/mindmap`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch mind map data');
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error("Error fetching mind map data:", error);
    throw error;
  }
}

/**
 * Updates the mind map template for a specific assessment
 * @param assessmentId The ID of the assessment
 * @param mindMapData The updated mind map data
 * @returns Promise indicating success
 */
export async function updateAssessmentMindMap(
  assessmentId: string,
  mindMapData: Record<string, any>
): Promise<boolean> {
  try {
    // In a real implementation, this would send a PUT/PATCH request to the API
    // For demo purposes, we'll just simulate a successful response
    console.log(
      `Updating mind map for assessment ${assessmentId}:`,
      mindMapData
    );

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return true;

    // Actual implementation would look something like:
    /*
    const response = await fetch(`https://alterview-api.vercel.app/api/v1/assessments/${assessmentId}/mindmap`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mindMapData),
    });
    
    return response.ok;
    */
  } catch (error) {
    console.error("Error updating mind map data:", error);
    throw error;
  }
}
