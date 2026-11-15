import React from 'react';
import BrandLogo from './BrandLogo';
import crestEmblem from '../assets/SCMBT_Crest.png';
import { 
  LayoutGrid, 
  ClipboardCheck, 
  Building2, 
  Users, 
  GraduationCap, 
  Wallet, 
  TrendingUp, 
  SlidersHorizontal,
  Anchor,
  HelpCircle,
  Settings,
  LogOut
} from 'lucide-react';

export default function Sidebar({ 
  activeTab = 'profile', 
  onTabSelect, 
  todoCount = 1,
  isCollapsed = false,
  onToggleCollapse
}) {
  const mainNavItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutGrid },
    { id: 'todo', label: 'Tasks', icon: ClipboardCheck, badge: todoCount },
    { id: 'campus', label: 'Campus', icon: Building2 },
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
  ];

  return (
    <aside 
      className={`prod-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`} 
      aria-label="Main Application Navigation"
    >
      {/* =========================================================
          STATE A: EXPANDED WIDE SIDEBAR
          ========================================================= */}
      <div className={`sidebar-expanded-content ${isCollapsed ? 'hidden-fade' : 'visible-fade'}`}>
        {/* Header with Centered Logo (Click logo directly to collapse) */}
        <div className="sidebar-brand-wrapper">
          <button 
            type="button" 
            onClick={onToggleCollapse} 
            className="brand-logo-toggle-btn"
            title="Click logo to collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <BrandLogo style={{ height: '44px', width: 'auto' }} />
          </button>
        </div>

        {/* Navigation List - 1 Word Item Names */}
        <nav className="sidebar-nav-container">
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
                    title={item.label}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} />
                    <span className="truncate">{item.label}</span>
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

        {/* Utility Links & Signout Action at Bottom - 1 Word Names */}
        <div className="sidebar-bottom-actions">
          <button type="button" className="prod-nav-btn" title="Support">
            <HelpCircle size={17} strokeWidth={1.8} />
            <span>Support</span>
          </button>
          <button type="button" className="prod-nav-btn" title="Settings">
            <Settings size={17} strokeWidth={1.8} />
            <span>Settings</span>
          </button>
          <button 
            type="button" 
            className="prod-nav-btn signout-btn" 
            title="Signout"
            onClick={() => {
              if (window.confirm('Are you sure you want to sign out?')) {
                alert('Signed out successfully.');
              }
            }}
          >
            <LogOut size={17} strokeWidth={1.8} />
            <span>Signout</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          STATE B: COLLAPSED CAPSULE SIDEBAR
          ========================================================= */}
      <div className={`sidebar-collapsed-content ${isCollapsed ? 'visible-fade' : 'hidden-fade'}`}>
        {/* Top: Large Centered Maritime Crest Emblem (Click crest directly to expand) */}
        <div className="collapsed-crest-wrapper" title="Southwestern College of Maritime, Business and Technology">
          <button 
            type="button" 
            onClick={onToggleCollapse} 
            className="crest-btn" 
            title="Click crest to expand sidebar"
            aria-label="Expand sidebar"
          >
            <img 
              src={crestEmblem} 
              alt="SCMBT Maritime College Crest Emblem" 
              className="collapsed-crest-img"
            />
          </button>
        </div>

        {/* Middle: Floating White Capsule with Navigation Icons */}
        <div className="floating-nav-capsule">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`capsule-icon-btn ${isActive ? 'active' : ''}`}
                onClick={() => onTabSelect(item.id)}
                title={item.label}
                aria-label={item.label}
              >
                <Icon size={19} strokeWidth={isActive ? 2.2 : 1.75} />
              </button>
            );
          })}
        </div>

        {/* Bottom: Floating Circular Button with Anchor Icon */}
        <div className="collapsed-bottom-wrapper">
          <button 
            type="button" 
            className="floating-anchor-btn"
            title="Maritime Portal (Click to expand)"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
          >
            <Anchor size={20} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </aside>
  );
}
