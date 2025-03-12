import { createClient } from '@supabase/supabase-js';

// Utility function to generate random integers
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Supabase configuration
const SUPABASE_URL = "https://ieaylpizqqbrmyduarvx.supabase.co";
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllYXlscGl6cXFicm15ZHVhcnZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTY3ODMxMywiZXhwIjoyMDU3MjU0MzEzfQ.qi-n5c0TRR-LZv9gp3DDrpTDXbJYvr5jlNfif1KBHrc';

// Create a Supabase client with the service key for full access
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

/**
 * Posts data to a specified Supabase table
 * @param tableName - The name of the table to post data to
 * @param data - The data to post to the table
 * @returns The result of the insert operation
 */
export async function postToSupabase(tableName: string, data: any) {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();
    
    if (error) {
      console.error('Error posting to Supabase:', error);
      throw error;
    }
    
    return result;
  } catch (error) {
    console.error('Exception when posting to Supabase:', error);
    throw error;
  }
}

/**
 * Posts data specifically to the AssessmentResult table
 * @param assessmentId - The ID of the assessment
 * @param teacherId - The ID of the teacher
 * @param studentId - The ID of the student
 * @param voiceRecordingId - The ID of the voice recording (optional)
 * @param transcript - The transcript text (optional)
 * @param mindmap - The mindmap JSON data (optional)
 * @returns The result of the insert operation
 */
export async function postAssessmentResult(
  assessmentId: number | null,
  teacherId: number | null,
  studentId: number | null,
  voiceRecordingId: number | null = null,
  transcript: string | null = null,
  mindmap: any | null = null
) {
  try {
    const generatedId = randomInt(1,1000000);
    const data = {
      id: generatedId,
      assessment_id: assessmentId,
      teacher_id: teacherId,
      student_id: studentId,
      voice_recording_id: voiceRecordingId,
      transcript: transcript,
      mindmap: mindmap
    };

    const { data: result, error } = await supabase
      .from('AssessmentResult')
      .insert(data)
      .select();
    
    if (error) {
      console.error('Error posting to AssessmentResult table:', error);
      throw error;
    }
    
    return { result, generatedId };
  } catch (error) {
    console.error('Exception when posting to AssessmentResult table:', error);
    throw error;
  }
}

/**
 * Updates data in a specified Supabase table
 * @param tableName - The name of the table to update data in
 * @param id - The id of the record to update
 * @param data - The data to update
 * @returns The result of the update operation
 */
export async function updateInSupabase(tableName: string, id: string | number, data: any) {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating in Supabase:', error);
      throw error;
    }
    
    return result;
  } catch (error) {
    console.error('Exception when updating in Supabase:', error);
    throw error;
  }
}

/**
 * Deletes data from a specified Supabase table
 * @param tableName - The name of the table to delete data from
 * @param id - The id of the record to delete
 * @returns The result of the delete operation
 */
export async function deleteFromSupabase(tableName: string, id: string | number) {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error deleting from Supabase:', error);
      throw error;
    }
    
    return result;
  } catch (error) {
    console.error('Exception when deleting from Supabase:', error);
    throw error;
  }
}

/**
 * Fetches data from a specified Supabase table
 * @param tableName - The name of the table to fetch data from
 * @param query - Optional query parameters
 * @returns The fetched data
 */
export async function fetchFromSupabase(tableName: string, query?: any) {
  try {
    let queryBuilder = supabase.from(tableName).select('*');
    
    // Apply query parameters if provided
    if (query) {
      // Example: if query has a filter property
      if (query.filter) {
        for (const [key, value] of Object.entries(query.filter)) {
          queryBuilder = queryBuilder.eq(key, value);
        }
      }
      
      // Example: if query has a limit property
      if (query.limit) {
        queryBuilder = queryBuilder.limit(query.limit);
      }
    }
    
    const { data, error } = await queryBuilder;
    
    if (error) {
      console.error('Error fetching from Supabase:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception when fetching from Supabase:', error);
    throw error;
  }
}

export { supabase }; 


//getPrompts from supabase in  Assessment table using id , return system_prompt and first_question
export async function getPrompts(id: number) {
  const { data, error } = await supabase
    .from('Assessment')
    .select('system_prompt, first_question')
    .eq('id', id)
    .single();
}

//getMindmap string from Assessment Table using id, return mindmap string
export async function getMindmap(id: number) {
  const { data, error } = await supabase
    .from('Assessment')
    .select('mindmap_template')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching mindmap:', error);
    return null;
  }
  
  return data?.mindmap_template;
}