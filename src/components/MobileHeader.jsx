import React from 'react';
import { Search, PlusCircle, ChevronDown, Plus, Wifi, BatteryCharging, Signal, MessageCircle } from 'lucide-react';

export default function MobileHeader({ 
  user = { avatar: '01', tier: 'Free' },
  filter = 'all',
  onSearchClick,
  onCreateClassClick,
  currentTime = '2:09'
}) {
  return (
    <header className="mobile-header-wrapper" role="banner">
      {/* Mobile Top System Status Bar */}
      <div className="mobile-status-bar" aria-label="System status">
        <div className="status-bar-left">
          <span>{currentTime}</span>
          <MessageCircle size={12} fill="currentColor" />
        </div>
        <div className="status-bar-right">
          <Signal size={12} />
          <Wifi size={12} />
          <span style={{ fontSize: '11px', fontWeight: 600 }}>5G</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BatteryCharging size={13} />
            <span style={{ fontSize: '11px', fontWeight: 700 }}>73</span>
          </div>
        </div>
      </div>

      {/* Main Mobile App Bar */}
      <div className="mobile-app-header">
        <div className="mobile-header-left">
          {/* Circular User Avatar Badge */}
          <div className="mobile-user-avatar" aria-label="User profile">
            <span>{user.avatar}</span>
          </div>
          {/* Title */}
          <h1 className="mobile-title-text">Home</h1>
          {/* Tier Pill */}
          <span className="mobile-tier-pill">{user.tier}</span>
        </div>

        {/* Right Search and Plus Icons */}
        <div className="mobile-header-right">
          <button 
            type="button" 
            className="mobile-icon-btn" 
            onClick={onSearchClick}
            aria-label="Search"
          >
            <Search size={22} strokeWidth={2.2} />
          </button>
          <button 
            type="button" 
            className="mobile-icon-btn" 
            onClick={onCreateClassClick}
            aria-label="Add class or join"
          >
            <PlusCircle size={22} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Filter and New Class Action Row */}
      <div className="mobile-controls-row">
        <button type="button" className="mobile-all-dropdown" aria-label="Filter classes">
          <span>All</span>
          <ChevronDown size={17} strokeWidth={2.4} />
        </button>

        <button 
          type="button" 
          className="mobile-new-class-btn"
          onClick={onCreateClassClick}
          aria-label="Create new class"
        >
          <Plus size={16} strokeWidth={2.6} />
          <span>New Class</span>
        </button>
      </div>
    </header>
  );
}
