import React, { useEffect, useState } from 'react';
import { WarningCircle, WifiSlash, Warning, X, CheckCircle, Sparkle } from '@phosphor-icons/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

/**
 * Individual Toast Notification Component
 */
const Toast = ({ id, type, message, onRemove, duration = 4500 }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Auto-dismiss timer
    const timer = setTimeout(() => {
      triggerRemove();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const triggerRemove = () => {
    setIsLeaving(true);
    // Wait for the exit animation to finish before fully removing from DOM
    setTimeout(() => {
      onRemove(id);
    }, 300); // 300ms matches the Tailwind transition duration
  };

  // Determine icon and color based on error type
  let Icon = WarningCircle;
  let iconColorClass = 'text-red-400';
  let bgColorClass = 'bg-[#18181b] border-red-500/20'; // Base dark theme

  switch (type) {
    case 'success':
      Icon = CheckCircle;
      iconColorClass = 'toast-success-icon';
      bgColorClass = 'toast-success';
      break;
    case 'ai_success':
      Icon = Sparkle;
      iconColorClass = 'toast-ai-icon';
      bgColorClass = 'toast-ai';
      break;
    case 'network':
      Icon = WifiSlash;
      iconColorClass = 'text-orange-400';
      bgColorClass = 'bg-[#2a1a15] border-orange-500/40';
      break;
    case 'error':
    case 'server':
      Icon = Warning;
      iconColorClass = 'text-red-500';
      bgColorClass = 'bg-[#2a1515] border-red-500/50';
      break;
    case 'warning':
    case 'client':
      Icon = WarningCircle;
      iconColorClass = 'text-yellow-400';
      bgColorClass = 'bg-[#2a2615] border-yellow-500/50';
      break;
    default:
      Icon = WarningCircle;
      iconColorClass = 'text-gray-400';
      bgColorClass = 'bg-[#18181b] border-white/10';
      break;
  }

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300",
        bgColorClass,
        // Entry animation
        !isLeaving ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      )}
    >
      <div className={cn("mt-0.5 flex-shrink-0", iconColorClass)}>
        <Icon size={20} weight="fill" />
      </div>
      
      <div className="flex-1 text-sm font-medium text-gray-200">
        {message}
      </div>

      <button
        onClick={triggerRemove}
        className="flex-shrink-0 rounded-md p-1 text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors"
        aria-label="Close"
      >
        <X size={16} weight="bold" />
      </button>
    </div>
  );
};

export default Toast;
