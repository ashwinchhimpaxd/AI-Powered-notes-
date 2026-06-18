import React, { useEffect, useState, useCallback } from 'react';
import { WarningCircle, WifiSlash, Warning, X, CheckCircle, Sparkle } from '@phosphor-icons/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

/**
 * Individual Toast Notification Component
 */
const Toast = ({ id, type, message, onRemove, duration = 4500 }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  const triggerRemove = useCallback(() => {
    setIsLeaving(true);
    // Wait for the exit animation to finish before fully removing from DOM
    setTimeout(() => {
      onRemove(id);
    }, 300); // 300ms matches the Tailwind transition duration
  }, [id, onRemove]);

  useEffect(() => {
    // Auto-dismiss timer
    const timer = setTimeout(() => {
      triggerRemove();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, triggerRemove]);

  // Determine icon and color based on error type
  let Icon = WarningCircle;
  let iconColorClass = '';
  let bgColorClass = '';
  let textColorClass = '';

  switch (type) {
    case 'success':
      Icon = CheckCircle;
      iconColorClass = 'toast-success-icon';
      bgColorClass = 'toast-success';
      textColorClass = 'toast-success-text';
      break;
    case 'ai_success':
      Icon = Sparkle;
      iconColorClass = 'toast-ai-icon';
      bgColorClass = 'toast-ai';
      textColorClass = 'toast-ai-text';
      break;
    case 'network':
      Icon = WifiSlash;
      iconColorClass = 'toast-network-icon';
      bgColorClass = 'toast-network';
      textColorClass = 'toast-network-text';
      break;
    case 'error':
    case 'server':
      Icon = Warning;
      iconColorClass = 'toast-error-icon';
      bgColorClass = 'toast-error';
      textColorClass = 'toast-error-text';
      break;
    case 'warning':
    case 'client':
      Icon = WarningCircle;
      iconColorClass = 'toast-warning-icon';
      bgColorClass = 'toast-warning';
      textColorClass = 'toast-warning-text';
      break;
    default:
      Icon = WarningCircle;
      iconColorClass = 'toast-default-icon';
      bgColorClass = 'toast-default';
      textColorClass = 'toast-default-text';
      break;
  }

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300 toast",
        bgColorClass,
        // Entry animation
        !isLeaving ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      )}
    >
      <div className={cn("mt-0.5 flex-shrink-0", iconColorClass)}>
        <Icon size={20} weight="fill" />
      </div>

      <div className={cn("flex-1 text-sm font-medium", textColorClass)}>
        {message}
      </div>

      <button
        type='button'
        onClick={triggerRemove}
        className="flex-shrink-0 rounded-md p-1 text-gray-500 hover:bg-black/5 hover:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-colors"
        aria-label="Close"
      >
        <X size={16} weight="bold" />
      </button>
    </div>
  );
};

export default Toast;
