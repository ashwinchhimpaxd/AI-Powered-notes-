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
    <div className="fixed z-[99999] pointer-events-none flex gap-3 
      top-4 left-1/2 -translate-x-1/2 w-[90vw] max-w-max flex-col items-center
      md:top-auto md:bottom-6 md:left-auto md:right-6 md:translate-x-0 md:w-auto md:flex-col-reverse md:items-end">
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
