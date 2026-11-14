import React from 'react';
import { 
  Home, 
  MessageSquare, 
  CheckSquare, 
  Calendar, 
  HardDrive, 
  Presentation, 
  Cast 
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabSelect, todoCount = 1, user = { name: '006a.user...', tier: 'Free', avatar: '0' } }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'todo', label: 'To Do', icon: CheckSquare, badge: todoCount },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'drive', label: 'Drive', icon: HardDrive },
    { id: 'blackboard', label: 'Blackboard', icon: Presentation },
    { id: 'mirroring', label: 'Mirroring', icon: Cast },
  ];

  return (
    <aside className="desktop-sidebar" aria-label="Main Navigation">
      <div>
        {/* Brand Logo */}
        <div className="brand-logo-container">
          <div className="brand-logo-text">
            ClassIn
          </div>
        </div>

        {/* Navigation List */}
        <nav>
          <ul className="nav-links-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`nav-item-btn ${isActive ? 'active' : ''}`}
                    onClick={() => onTabSelect(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="nav-item-icon" strokeWidth={isActive ? 2.4 : 2} />
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="nav-badge-red" aria-label={`${item.badge} notifications`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* User Profile in Sidebar Footer */}
      <div className="sidebar-user-footer" title={`Logged in as ${user.name}`}>
        <div className="user-avatar-wrap">
          <span>{user.avatar}</span>
          <span className="user-status-dot" aria-label="Online status" />
        </div>
        <div className="user-info-text">
          <span className="user-name-label">{user.name}</span>
          <span className="user-tier-badge">{user.tier}</span>
        </div>
      </div>
    </aside>
  );
}
