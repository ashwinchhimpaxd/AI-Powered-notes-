import React, { useState, useEffect, useCallback } from 'react';
import Toast from './Toast';

const MAX_TOASTS = 3;

/**
 * Global Toast Container
 * Listens for 'show-toast' window events and manages the active toasts.
 */
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleShowToast = (event) => {
      const { type, message, statusCode } = event.detail;
      
      const newToast = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        type,
        message,
        statusCode
      };

      setToasts((prevToasts) => {
        // Add to the top of the list, keeping only the most recent MAX_TOASTS
        const updated = [newToast, ...prevToasts];
        if (updated.length > MAX_TOASTS) {
          return updated.slice(0, MAX_TOASTS);
        }
        return updated;
      });
    };

    window.addEventListener('show-toast', handleShowToast);

    return () => {
      window.removeEventListener('show-toast', handleShowToast);
    };
  }, []);

  const handleRemoveToast = useCallback((idToRemove) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== idToRemove));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col-reverse gap-3 pointer-events-none">
      {/* We use flex-col-reverse so newer toasts appear at the bottom of the stack, 
          or just flex-col depending on preference. 
          Usually, newer toasts at the bottom push older ones up. */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onRemove={handleRemoveToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
