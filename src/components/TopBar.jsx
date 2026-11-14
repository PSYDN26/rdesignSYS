import React from 'react';
import { Search, Compass, Bell } from 'lucide-react';

export default function TopBar({ 
  lessonCount = 1, 
  user = { name: '006a.user...', tier: 'Free', avatar: '01' },
  onSearchClick,
  unreadCount = 1
}) {
  return (
    <header className="prod-top-header" role="banner">
      {/* Left spacer / status */}
      <div className="header-left-spacer" />

      {/* Center Capsule Quick Bar with Compass */}
      <div className="header-center-section">
        <div className="capsule-quickbar" role="search">
          <button 
            type="button" 
            className="capsule-search-btn" 
            onClick={onSearchClick}
            title="Search classes and resources"
            aria-label="Search"
          >
            <Search size={15} strokeWidth={2.2} />
          </button>

          <div className="live-lesson-badge" title="Active Lesson in Progress">
            <span className="green-bars" aria-hidden="true">
              <span />
              <span />
            </span>
            <span>{lessonCount} lesson</span>
          </div>

          <button 
            type="button" 
            className="capsule-search-btn" 
            title="Explore courses"
            aria-label="Explore"
          >
            <Compass size={15} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Right User & Actions Section */}
      <div className="header-actions-section">
        <button 
          type="button" 
          className="icon-action-btn"
          title="Notifications"
          aria-label="Notifications"
          style={{ position: 'relative' }}
        >
          <Bell size={18} strokeWidth={2} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 7,
              height: 7,
              backgroundColor: 'var(--amber)',
              borderRadius: '50%',
              border: '1.5px solid #ffffff'
            }} />
          )}
        </button>

        {/* User Account Trigger */}
        <div className="user-account-badge" title={`Signed in as ${user.name}`}>
          <div className="avatar-disc">
            <span>{user.avatar}</span>
            <span className="avatar-online-dot" />
          </div>
          <span className="user-badge-name">{user.name}</span>
          <span className="user-badge-tier">{user.tier}</span>
        </div>
      </div>
    </header>
  );
}
