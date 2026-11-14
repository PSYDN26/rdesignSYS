import React from 'react';
import { 
  Home, 
  MessageSquare, 
  CheckSquare, 
  Calendar, 
  HardDrive, 
  Presentation, 
  Cast,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabSelect, todoCount = 1 }) {
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'todo', label: 'To Do', icon: CheckSquare, badge: todoCount },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'drive', label: 'Drive', icon: HardDrive },
    { id: 'blackboard', label: 'Blackboard', icon: Presentation },
    { id: 'mirroring', label: 'Mirroring', icon: Cast },
  ];

  return (
    <aside className="prod-sidebar" aria-label="Main Application Navigation">
      <nav>
        <ul className="prod-nav-list">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`prod-nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onTabSelect(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="prod-nav-badge">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Utility Links at Bottom */}
      <div style={{ paddingTop: 16, borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button type="button" className="prod-nav-btn" title="Help & Support">
          <HelpCircle size={18} strokeWidth={2} />
          <span>Support</span>
        </button>
        <button type="button" className="prod-nav-btn" title="Settings">
          <Settings size={18} strokeWidth={2} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
