const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// --- Helper: Unified response handler ---
const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch (parseError) {
        throw new Error(`Server returned invalid response (${response.status})`);
    }
    
    if (!response.ok) {
        const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }
    return data;
};

// --- Helper: Auth headers including guest mode ---
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const isGuest = localStorage.getItem('isGuest') === 'true';
    return {
        'Content-Type': 'application/json',
        'x-auth-token': token || '',
        'x-guest-mode': isGuest ? 'true' : 'false'
    };
};

// --- Optional: Simulate delay for dev testing ---
const simulateDelay = () => {
    if (process.env.NODE_ENV === 'development') {
        return new Promise(resolve => setTimeout(resolve, 500));
    }
    return Promise.resolve();
};

export const api = {
    // --- Auth ---
    login: async (email, password) => {
        await simulateDelay();
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    register: async (email, password, name) => {
        await simulateDelay();
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    // Get current user profile
    getCurrentUser: async () => {
        await simulateDelay();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch(`${API_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        await simulateDelay();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(profileData),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    // --- Progress ---
    fetchProgress: async () => {
        await simulateDelay();
        try {
            const response = await fetch(`${API_URL}/progress/user`, {
                method: 'GET',
                headers: {
                    ...getAuthHeaders(),
                    'x-user-id': 'guest' // Add user ID header
                },
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Fetch progress error:', error);
            if (localStorage.getItem('isGuest') === 'true') {
                return { 
                    completedExercises: {},
                    completedQuizzes: {},
                    completedChallenges: {},
                    unlockedAchievements: {},
                    xp: 0,
                    level: 1,
                    streak: 1
                };
            }
            throw error;
        }
    },

    saveProgress: async (progressData) => {
        await simulateDelay();
        try {
            if (localStorage.getItem('isGuest') === 'true') {
                console.warn('Progress not saved - guest mode active');
                return { success: true, guest: true };
            }

            const response = await fetch(`${API_URL}/progress/update`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'x-user-id': 'guest'
                },
                body: JSON.stringify(progressData),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Save progress error:', error);
            throw error;
        }
    },

    // --- Guest Mode ---
    initializeGuestSession: async () => {
        await simulateDelay();
        try {
            return { success: true, guest: true };
        } catch (error) {
            console.error('Guest initialization error:', error);
            throw error;
        }
    },

    // --- Submit Feedback via Backend ---
    submitFeedback: async ({ message, email, issueType, name }) => {
        await simulateDelay();
        try {
            const response = await fetch(`${API_URL}/submit-feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name || 'Anonymous User',
                    email: email || 'no-reply@sqlflow.com',
                    message,
                    issueType
                }),
            });

            return await handleResponse(response);

        } catch (error) {
            console.error('Feedback submission error:', error);
            let enhancedError = error;
            if (error.message.includes('Failed to fetch')) {
                enhancedError = new Error('Network error. Please check your connection.');
            } else if (error.message.includes('Too many submissions')) {
                enhancedError = new Error('Too many submissions. Please try again later.');
            }
            throw enhancedError;
        }
    },

    // --- XP & Achievements ---
    get: async (endpoint) => {
        await simulateDelay();
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'GET',
                headers: getAuthHeaders(),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`GET ${endpoint} error:`, error);
            throw error;
        }
    },

    post: async (endpoint, data) => {
        await simulateDelay();
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error(`POST ${endpoint} error:`, error);
            throw error;
        }
    }
};
