const API_BASE_URL = 'http://localhost:8080';

const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('insight-token');
};

const apiFetch = async (path: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    } as Record<string, string>;

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || 'API request failed');
    }

    if (response.status === 204) {
        return;
    }

    return response.json();
};

// --- User Management ---
export const login = (email: string, password: string) => apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
});

export const register = (email: string, password: string) => apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
});

// --- Project Management ---
export const getProjects = () => apiFetch('/projects');

export const createProject = (name: string) => apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify({ name }),
});

// --- Data APIs ---
export const getSessions = (projectId: string) => apiFetch(`/projects/${projectId}/sessions`);

export const getSessionReplay = (projectId: string, sessionId: string) => apiFetch(`/projects/${projectId}/sessions/${sessionId}/replay`);

export const getHeatmap = (projectId: string, url: string) => apiFetch(`/projects/${projectId}/heatmap?url=${encodeURIComponent(url)}`);
