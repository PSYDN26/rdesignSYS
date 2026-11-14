import React from 'react';
import BrandLogo from './BrandLogo';
import { 
  Home, 
  UserCheck,
  MessageSquare, 
  CheckSquare, 
  Calendar, 
  HardDrive, 
  Presentation, 
  Cast,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  onTabSelect, 
  todoCount = 1,
  user = { name: '006a.user...', tier: 'Free', avatar: '01' }
}) {
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile (PDS)', icon: UserCheck },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'todo', label: 'To Do', icon: CheckSquare, badge: todoCount },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'drive', label: 'Drive', icon: HardDrive },
    { id: 'blackboard', label: 'Blackboard', icon: Presentation },
    { id: 'mirroring', label: 'Mirroring', icon: Cast },
  ];

  return (
    <aside className="prod-sidebar" aria-label="Main Application Navigation">
      {/* SCMBT Maritime Brand Vector Logo */}
      <div className="sidebar-brand-wrapper">
        <BrandLogo style={{ height: '44px', width: 'auto' }} />
      </div>

      <nav style={{ flex: 1, overflowY: 'auto' }}>
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

      {/* Utility Links & User Account Pill at Bottom */}
      <div style={{ paddingTop: 12, borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button type="button" className="prod-nav-btn" title="Help & Support">
          <HelpCircle size={17} strokeWidth={2} />
          <span>Support</span>
        </button>
        <button type="button" className="prod-nav-btn" title="Settings">
          <Settings size={17} strokeWidth={2} />
          <span>Settings</span>
        </button>

        {/* User Account Trigger Pill */}
        <div className="user-account-badge" style={{ marginTop: 6, width: '100%', justifyContent: 'flex-start' }} title={`Signed in as ${user.name}`}>
          <div className="avatar-disc">
            <span>{user.avatar}</span>
            <span className="avatar-online-dot" />
          </div>
          <span className="user-badge-name" style={{ fontSize: '11px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
          <span className="user-badge-tier">{user.tier}</span>
        </div>
      </div>
    </aside>
  );
}
