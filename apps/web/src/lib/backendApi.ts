/**
 * Backend API Integration - FastAPI Backend
 * Connects React frontend to Python FastAPI backend with OpenAI Agents
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types matching backend Pydantic models
export interface TutorResponse {
  explanation: string;
  examples: string[];
  key_concepts: string[];
  follow_up_questions: string[];
  depth_adjustment: 'deeper' | 'simpler' | 'appropriate';
  next_action: 'continue' | 'quiz' | 'next_section';
}

export interface QuizEvaluation {
  is_correct: boolean;
  explanation: string;
  key_concept: string;
  confidence_level: number;
  hint_if_wrong?: string;
  next_step: 'try_again' | 'review' | 'move_to_next';
  adaptive_difficulty: 'easier' | 'same' | 'harder';
}

export interface OrchestrationDecision {
  action: 'teach' | 'quiz' | 'review' | 'next_section' | 'congratulate';
  target: string;
  reasoning: string;
  student_message: string;
}

export interface SessionState {
  session_id: string;
  class_id: string;
  student_id: string;
  current_section_id: string | null;
  started_at: string;
  status: string;
}

// API Functions

/**
 * Upload and process PDF
 */
export async function uploadPDF(file: File, subject: string, level: string = 'beginner') {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${API_BASE_URL}/api/pdf/upload?subject=${encodeURIComponent(subject)}&level=${level}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`PDF upload failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Send message to Tutor Agent
 */
export async function sendChatMessage(
  sessionId: string,
  message: string,
  classId: string,
  sectionId?: string
): Promise<{ success: boolean; response: TutorResponse; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      message,
      class_id: classId,
      section_id: sectionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Chat failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get chat history
 */
export async function getChatHistory(sessionId: string) {
  const response = await fetch(`${API_BASE_URL}/api/chat/history/${sessionId}`);

  if (!response.ok) {
    throw new Error(`Failed to get chat history: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Submit quiz answer
 */
export async function submitQuizAnswer(
  sessionId: string,
  questionId: string,
  answer: string,
  sectionId: string
): Promise<{ success: boolean; evaluation: QuizEvaluation; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      question_id: questionId,
      answer,
      section_id: sectionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Quiz submission failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Start a learning session
 */
export async function startLearningSession(
  classId: string,
  studentId: string
): Promise<SessionState & { next_action: OrchestrationDecision }> {
  const response = await fetch(`${API_BASE_URL}/api/learning/session/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      class_id: classId,
      student_id: studentId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Session start failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get session state
 */
export async function getSessionState(sessionId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/learning/session/${sessionId}/state`
  );

  if (!response.ok) {
    throw new Error(`Failed to get session state: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get next action from Orchestrator (auto-pacing)
 */
export async function getNextAction(
  sessionId: string
): Promise<{ success: boolean; decision: OrchestrationDecision }> {
  const response = await fetch(
    `${API_BASE_URL}/api/learning/session/${sessionId}/next`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get next action: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get student progress
 */
export async function getStudentProgress(studentId: string, classId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/learning/progress/${studentId}/${classId}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get progress: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Health check
 */
export async function healthCheck() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error('Backend health check failed');
  }

  return response.json();
}

/**
 * Get API info
 */
export async function getApiInfo() {
  const response = await fetch(`${API_BASE_URL}/`);

  if (!response.ok) {
    throw new Error('Failed to get API info');
  }

  return response.json();
}

// Export for use in components
export default {
  uploadPDF,
  sendChatMessage,
  getChatHistory,
  submitQuizAnswer,
  startLearningSession,
  getSessionState,
  getNextAction,
  getStudentProgress,
  healthCheck,
  getApiInfo,
};
