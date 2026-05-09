import { handleError } from './errorHandler.js';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

/**
 * A delay helper function.
 * @param {number} ms 
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A wrapper around native fetch that handles retries for GET requests
 * and automatically calls the global error handler.
 * 
 * @param {string} url - The URL to fetch.
 * @param {RequestInit} [options] - Fetch options.
 * @param {number} [attempt=0] - Current retry attempt (used internally).
 * @returns {Promise<any>} - Resolves with the JSON response data.
 */
export async function apiFetch(url, options = {}, attempt = 0) {
  const method = (options.method || 'GET').toUpperCase();
  const isGetRequest = method === 'GET';

  try {
    const response = await fetch(url, options);

    // Parse JSON safely
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If it's not JSON, we can just grab text or assume success if status is OK
      data = await response.text();
    }

    // 1. Handle HTTP errors (!response.ok)
    if (!response.ok) {
      // Attach status so handleError can classify it
      const error = new Error(data?.message || response.statusText || 'HTTP Error');
      error.statusCode = response.status;
      error.response = response;
      throw error;
    }

    // 2. Handle 200 OK but { success: false } business logic errors
    if (data && typeof data === 'object' && data.success === false) {
      const error = new Error(data.message || 'API reported a failure despite 200 OK');
      error.statusCode = 400; // Treat as a client business logic error
      throw error;
    }

    return data;

  } catch (error) {
    // Determine if we should retry
    const isNetworkError = error.name === 'TypeError' && error.message.includes('fetch');
    const isServerError = error.statusCode >= 500;
    
    const isRecoverable = isNetworkError || isServerError;
    const canRetry = isGetRequest && isRecoverable && attempt < MAX_RETRIES;

    if (canRetry) {
      console.warn(`[apiFetch] Request failed. Retrying... (${attempt + 1}/${MAX_RETRIES})`);
      await delay(RETRY_DELAY_MS);
      return apiFetch(url, options, attempt + 1);
    }

    // If we've exhausted retries or it's not recoverable, handle the error globally
    handleError(error, { action: `apiFetch ${method} ${url}` });

    // Re-throw so the calling component can still handle it if needed
    // (e.g., stop loading state)
    throw error;
  }
}
