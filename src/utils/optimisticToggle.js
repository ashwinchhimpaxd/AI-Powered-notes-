import { handleError } from './errorHandler.js';

// Global map to track active toggles to prevent race conditions and API flooding
const activeToggles = new Map();

/**
 * A robust utility for managing optimistic UI updates with debouncing and request tracking.
 * Ideal for operations like "like", "bookmark", or "mark as important" where users might
 * click rapidly and backends (like Appwrite) don't natively support request cancellation.
 * 
 * @param {Object} options
 * @param {string} options.key - Unique identifier for the item being toggled (e.g., 'note-123-important').
 * @param {any} options.initialValue - The starting value before this interaction sequence began.
 * @param {any} options.originalData - The entire original object state to use in case of rollback.
 * @param {Function} [options.toggleFn=(val)=>!val] - A function that computes the next state based on the current one.
 * @param {Function} options.onOptimisticUpdate - Called immediately to update the UI. Receives the new computed value.
 * @param {Function} options.apiCall - The async function to perform the actual update. Receives the new computed value.
 * @param {Function} options.onRollback - Called if the API fails. Receives the originalData.
 * @param {number} [options.delay=300] - Debounce delay in milliseconds.
 */
export function executeOptimisticToggle({
  key,
  initialValue,
  originalData,
  toggleFn = (val) => !val,
  onOptimisticUpdate,
  apiCall,
  onRollback,
  delay = 1000
}) {
  // 1. Initialize or retrieve the active toggle state sequence
  if (!activeToggles.has(key)) {
    activeToggles.set(key, {
      timeoutId: null,
      latestRequestId: 0,
      originalData,
      currentValue: initialValue
    });
  }

  const state = activeToggles.get(key);

  // 2. Compute the new intended value independently of React's render cycle
  // This ensures 10 rapid clicks perfectly toggle true/false/true/false.
  state.currentValue = toggleFn(state.currentValue);
  const targetValue = state.currentValue;

  // 3. Optimistic Update: Update UI instantly
  onOptimisticUpdate(targetValue);

  // Clear any existing debounce timer
  if (state.timeoutId) {
    clearTimeout(state.timeoutId);
  }

  // Increment request ID (Latest Action Wins principle)
  const currentRequestId = ++state.latestRequestId;

  // 4. Debounce the API call
  state.timeoutId = setTimeout(async () => {
    try {
      // The API call is only executed once the user stops clicking for [delay] ms
      await apiCall(targetValue);
    } catch (error) {
      // 5. Handle failure ONLY if this is still the latest request
      // (If a new request fired before we finished, we ignore this old failure)
      const currentState = activeToggles.get(key);
      if (currentState && currentState.latestRequestId === currentRequestId) {
        onRollback(currentState.originalData);
        handleError(error, { action: `optimistic toggle for ${key}`, silent: false });
      }
    } finally {
      // 6. Cleanup
      const currentState = activeToggles.get(key);
      if (currentState && currentState.latestRequestId === currentRequestId) {
        activeToggles.delete(key);
      }
    }
  }, delay);
}
