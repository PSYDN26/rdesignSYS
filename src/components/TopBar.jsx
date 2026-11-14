import React from 'react';
import { Search, Compass, RefreshCw, LayoutGrid, Minus, Square, X } from 'lucide-react';

export default function TopBar({ lessonCount = 1, onSearchClick, onSyncClick }) {
  return (
    <header className="window-top-bar" role="banner" aria-label="Window Navigation Bar">
      {/* Left empty spacer to balance layout */}
      <div className="bar-left" />

      {/* Center Capsule Pill Bar */}
      <div className="bar-center">
        <div className="capsule-control" role="toolbar" aria-label="Quick Actions">
          {/* Search Icon Button */}
          <button 
            type="button" 
            className="capsule-icon-btn" 
            onClick={onSearchClick}
            title="Search"
            aria-label="Search classes and resources"
          >
            <Search size={15} strokeWidth={2.2} />
          </button>

          {/* Active Lesson Status Pill */}
          <div className="lesson-status-pill" title="Active Lesson in Progress">
            <span className="green-bars-icon" aria-hidden="true">
              <span />
              <span />
            </span>
            <span>{lessonCount} lesson</span>
          </div>

          {/* Compass / Location / Target Icon Button */}
          <button 
            type="button" 
            className="capsule-icon-btn" 
            title="Discovery / Explore"
            aria-label="Explore"
          >
            <Compass size={15} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Right Window Control Buttons */}
      <div className="bar-right" role="toolbar" aria-label="Window Controls">
        <button 
          type="button" 
          className="window-ctrl-btn" 
          onClick={onSyncClick}
          title="Refresh / Sync"
          aria-label="Refresh"
        >
          <RefreshCw size={14} strokeWidth={2} />
        </button>
        <button 
          type="button" 
          className="window-ctrl-btn" 
          title="Split View Layout"
          aria-label="Layout"
        >
          <LayoutGrid size={14} strokeWidth={2} />
        </button>
        <button 
          type="button" 
          className="window-ctrl-btn" 
          title="Minimize"
          aria-label="Minimize Window"
        >
          <Minus size={14} strokeWidth={2} />
        </button>
        <button 
          type="button" 
          className="window-ctrl-btn" 
          title="Maximize"
          aria-label="Maximize Window"
        >
          <Square size={12} strokeWidth={2} />
        </button>
        <button 
          type="button" 
          className="window-ctrl-btn close-btn" 
          title="Close"
          aria-label="Close Window"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
