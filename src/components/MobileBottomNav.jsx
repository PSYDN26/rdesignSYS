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
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onTabSelect(tab.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <div style={{ position: 'relative' }}>
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 1.8} 
                fill={isActive && tab.solid ? 'currentColor' : 'none'} 
              />
              {tab.badge ? (
                <span className="mobile-badge-pill">{tab.badge}</span>
              ) : null}
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
