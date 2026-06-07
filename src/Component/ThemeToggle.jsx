import React from "react";
import { Sun, Moon } from "@phosphor-icons/react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all duration-300 cursor-pointer shadow-sm group focus:outline-none focus:ring-2 focus:ring-ring"
      aria-label="Toggle Theme"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {theme === "dark" ? (
            <Moon size={20} weight="fill" className="text-indigo-400" />
          ) : (
            <Sun size={20} weight="fill" className="text-amber-500" />
          )}
        </div>
        <div className="text-left">
          <p className="font-semibold text-sm">Theme Mode</p>
          <p className="text-xs text-muted-foreground capitalize">
            {theme} Mode active
          </p>
        </div>
      </div>
      
      {/* Visual toggle pill */}
      <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${
        theme === "dark" ? "bg-primary" : "bg-muted"
      }`}>
        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          theme === "dark" ? "translate-x-4" : "translate-x-0"
        }`} />
      </div>
    </button>
  );
}

export default ThemeToggle;
