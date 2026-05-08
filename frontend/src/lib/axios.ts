import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_API;

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

/** Get the current access token from localStorage */
export const getAccessToken = (): string | null => {
    return localStorage.getItem('memento_token');
};

/** Set the access token in localStorage */
export const setAccessToken = (token: string): void => {
    localStorage.setItem('memento_token', token);
};

/** Remove the access token from localStorage */
export const removeAccessToken = (): void => {
    localStorage.removeItem('memento_token');
};

// Request interceptor: attach Bearer token
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401 → refresh token
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    for (const promise of failedQueue) {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token!);
        }
    }
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Don't retry refresh-token or login endpoints
            if (
                originalRequest.url?.includes('/auth/refresh-token') ||
                originalRequest.url?.includes('/auth/login')
            ) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await api.get('/auth/refresh-token');
                const newToken = data.data.token;
                setAccessToken(newToken);
                processQueue(null, newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                removeAccessToken();
                // Redirect to login
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
