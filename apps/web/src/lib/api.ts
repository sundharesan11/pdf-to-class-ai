// API client configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get token from localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  // Don't return 'undefined' string, return null instead
  return token === 'undefined' ? null : token;
};

// Save token to localStorage
export const saveToken = (token: string) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Generic fetch wrapper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  demoUser?: string
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    ...options.headers,
  };

  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add Content-Type for JSON requests
  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }
  
  // Add demoUser query param for DEMO_MODE
  let url = `${API_BASE_URL}${endpoint}`;
  if (demoUser) {
    const separator = endpoint.includes('?') ? '&' : '?';
    url += `${separator}demoUser=${demoUser}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string; role: 'teacher' | 'student' }) =>
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  login: (data: { email: string; password: string }) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  me: () => apiRequest('/api/auth/me'),
};

// PDF API
export const pdfApi = {
  upload: async (file: File, metadata: { title: string; description?: string; difficulty: string }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', metadata.title);
    if (metadata.description) formData.append('description', metadata.description);
    formData.append('difficulty', metadata.difficulty);

    const token = getToken();

    // Create headers using Headers API - this might handle FormData better
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    console.log('PDF upload - sending with headers:', Object.fromEntries(headers.entries()));
    console.log('PDF upload - FormData has fields:', Array.from(formData.entries()).map(([k, v]) => `${k}: ${v instanceof File ? `File(${v.name})` : v}`));

    const response = await fetch(`${API_BASE_URL}/api/pdf/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }
    
    return response.json();
  },
};

// Classes API
export const classesApi = {
  list: async () => {
    const response = await apiRequest('/api/classes');
    return response.data || [];
  },
  
  get: async (id: number) => {
    const response = await apiRequest(`/api/classes/${id}`, {}, true); // Skip auth temporarily
    return response.data;
  },

  join: async (joinCode: string) => {
    const response = await apiRequest('/api/classes/join', {
      method: 'POST',
      body: JSON.stringify({ joinCode }),
    });
    return response.data;
  },

  getStudents: async (id: number) => {
    const response = await apiRequest(`/api/classes/${id}/students`);
    return response.data || [];
  },
};

// Sessions API
export const sessionsApi = {
  start: (classId: number) =>
    apiRequest('/api/sessions/start', {
      method: 'POST',
      body: JSON.stringify({ classId }),
    }, 'student'),
  
  continue: (sessionId: number, action: string, data?: any) =>
    apiRequest(`/api/sessions/${sessionId}/continue`, {
      method: 'POST',
      body: JSON.stringify({ action, ...data }),
    }, 'student'),
  
  get: (sessionId: number) => apiRequest(`/api/sessions/${sessionId}`, {}, 'student'),
  
  pause: (sessionId: number) =>
    apiRequest(`/api/sessions/${sessionId}/pause`, {
      method: 'POST',
    }, 'student'),
};

// Chat API
export const chatApi = {
  sendMessage: (data: { classId: number; sectionId?: number; message: string }) =>
    apiRequest('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getHistory: (classId: number) => apiRequest(`/api/chat/history/${classId}`),
};

export default {
  auth: authApi,
  pdf: pdfApi,
  classes: classesApi,
  sessions: sessionsApi,
  chat: chatApi,
};
