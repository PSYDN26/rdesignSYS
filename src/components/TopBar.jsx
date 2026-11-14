import React from 'react';
import { Search, Globe, Bell, User } from 'lucide-react';

export default function TopBar({ 
  lessonCount = 1, 
  user = { name: 'Student Name', tier: 'Free', avatar: '01' },
  onSearchClick,
  unreadCount = 1
}) {
  return (
    <header className="prod-top-header" role="banner">
      {/* Left spacer for optical center balancing */}
      <div className="header-left-spacer" />

      {/* Center Wireframe Quick Bar: [ 🔍 (orange) ] [ Navy Capsule: "Insert Text Here" ] [ 🌐 (orange) ] */}
      <div className="header-center-section">
        <div className="wireframe-search-group" role="search">
          <button 
            type="button" 
            className="wireframe-icon-btn" 
            onClick={onSearchClick}
            title="Search student records"
            aria-label="Search"
          >
            <Search size={18} color="var(--amber)" strokeWidth={2.4} />
          </button>

          <div 
            className="wireframe-navy-capsule"
            onClick={onSearchClick}
            role="button"
            tabIndex={0}
            title="Search / Insert query"
          >
            <span>Insert Text Here</span>
          </div>

          <button 
            type="button" 
            className="wireframe-icon-btn" 
            title="Global Resources"
            aria-label="Explore"
          >
            <Globe size={18} color="var(--amber)" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Right Wireframe Section: [ Orange Utility Icon ] [ Light Pill: User Icon + "Student Name" ] */}
      <div className="header-actions-section">
        <button 
          type="button" 
          className="wireframe-icon-btn"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={20} color="var(--amber)" fill="var(--amber)" strokeWidth={0} />
        </button>

        {/* Student Name Pill */}
        <div className="wireframe-student-badge" title={`Signed in as ${user.name || 'Student Name'}`}>
          <div className="wireframe-avatar-circle">
            <User size={13} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span className="wireframe-student-name">{user.name || 'Student Name'}</span>
        </div>
      </div>
    </header>
  );
}
