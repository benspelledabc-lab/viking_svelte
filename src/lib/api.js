import { PUBLIC_API_BASE, PUBLIC_SWAGGER_URL } from '$env/static/public';

export function swaggerUrl(path) {
  return `${PUBLIC_SWAGGER_URL}${path}`;
}

export function apiUrl(path) {
  return `${PUBLIC_API_BASE}${path}`;
}

/**
 * Make an authenticated API request
 * Automatically includes credentials for session-based auth
 */
export async function apiRequest(path, options = {}) {
  const defaultOptions = {
    credentials: 'include', // Include cookies for session auth
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  const response = await fetch(apiUrl(path), defaultOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const err = new Error(error.message || `API request failed: ${response.status}`);
    err.status = response.status;
    throw err;
  }

  return response.json();
}


