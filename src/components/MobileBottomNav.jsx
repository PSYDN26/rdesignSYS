import React from 'react';
import { 
  Home, 
  MessageSquare, 
  CheckSquare, 
  Calendar, 
  Inbox, 
  Sprout 
} from 'lucide-react';

export default function MobileBottomNav({ 
  activeTab = 'home', 
  onTabSelect, 
  todoBadge = 1 
}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, solid: true },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'todo', label: 'To Do', icon: CheckSquare, badge: todoBadge },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'drive', label: 'Drive', icon: Inbox },
    { id: 'growth', label: 'Growth', icon: Sprout },
  ];

  return (
    <footer className="mobile-nav-container" role="contentinfo">
      {/* 6 Tabs Bottom Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`mobile-nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => onTabSelect(tab.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <div style={{ position: 'relative' }}>
                <Icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 1.8} 
                  fill={isActive && tab.solid ? 'currentColor' : 'none'} 
                />
                {tab.badge ? (
                  <span className="mobile-nav-badge">{tab.badge}</span>
                ) : null}
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Home Indicator Bar */}
      <div className="mobile-home-indicator" aria-hidden="true">
        <div className="gesture-bar" />
      </div>
    </footer>
  );
}
