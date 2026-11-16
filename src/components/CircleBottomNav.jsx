import React, { useState, useRef, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Building2, 
  Users, 
  MoreHorizontal,
  GraduationCap,
  Wallet,
  TrendingUp,
  SlidersHorizontal,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';
import shipMenuImg from '../assets/scmbt-ship-menu.png';
import './CircleBottomNav.css';

/**
 * CircleBottomNav
 * Sizing and layout matching circle-cta-fullwidth-mobile-preview.html:
 * - Height: 78px (+ safe-area-inset-bottom)
 * - Full-bleed viewport dock: width 100%, max-width none
 * - SVG Formula: w = navWidth, c = w/2, s = 61, d = 42
 *   `M 9 0 H ${c-s} C ${c-35} 0 ${c-36} ${d} ${c} ${d} C ${c+36} ${d} ${c+35} 0 ${c+s} 0 H ${w-9} Q ${w} 0 ${w} 9 V 78 H 0 V 9 Q 0 0 9 0 Z`
 * - Center CTA button: 68px x 68px, top: -34px, 4px border
 * - Label: top 54px, 11.5px / 14px line-height
 * - SCMBT tokens: #042B4E Dark Navy, #F98809 Amber, white disc with ship emblem
 */
export default function CircleBottomNav({
  activeTab = 'profile',
  onTabSelect,
  todoBadge = 1,
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const containerRef = useRef(null);
  const [navWidth, setNavWidth] = useState(390);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setNavWidth(Math.round(rect.width));
        }
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Exact formula from circle-cta-fullwidth-mobile-preview.html
  const height = 78;
  const c = navWidth / 2;
  const s = 61;
  const d = 42;
  const svgPath = `M 9 0 H ${c - s} C ${c - 35} 0 ${c - 36} ${d} ${c} ${d} C ${c + 36} ${d} ${c + 35} 0 ${c + s} 0 H ${navWidth - 9} Q ${navWidth} 0 ${navWidth} 9 V ${height} H 0 V 9 Q 0 0 9 0 Z`;

  const mainTabs = [
    { id: 'todo', label: 'Tasks', icon: ClipboardCheck, badge: todoBadge },
    { id: 'campus', label: 'Campus', icon: Building2 },
    // Center is SCMBT Ship (Home)
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'more', label: 'More', icon: MoreHorizontal, isAction: true },
  ];

  const secondaryTabs = [
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'signout', label: 'Signout', icon: LogOut, isDanger: true },
  ];

  const handleTabClick = (tab) => {
    if (tab.isAction) {
      setIsDrawerOpen(true);
    } else {
      if (onTabSelect) onTabSelect(tab.id);
    }
  };

  const handleSecondarySelect = (tabId) => {
    setIsDrawerOpen(false);
    if (tabId === 'signout') {
      alert('Signed out successfully.');
    } else if (onTabSelect) {
      onTabSelect(tabId);
    }
  };

  return (
    <>
      <nav 
        className="circle-bottom-nav" 
        role="navigation" 
        aria-label="Bottom navigation"
        ref={containerRef}
      >
        <svg 
          className="circle-bottom-nav__background"
          viewBox={`0 0 ${navWidth} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <path d={svgPath} />
        </svg>

        <div className="circle-bottom-nav__tabs">
          {/* Tab 1: Tasks */}
          <button
            type="button"
            className={`circle-bottom-nav__tab ${activeTab === 'todo' ? 'is-active' : ''}`}
            onClick={() => handleTabClick(mainTabs[0])}
            aria-label="Tasks"
            aria-current={activeTab === 'todo' ? 'page' : undefined}
          >
            <span className="circle-bottom-nav__icon">
              <ClipboardCheck size={20} strokeWidth={activeTab === 'todo' ? 2.4 : 1.8} />
              {todoBadge ? (
                <span className="circle-bottom-nav__badge">{todoBadge}</span>
              ) : null}
            </span>
            <span className="circle-bottom-nav__label">Tasks</span>
          </button>

          {/* Tab 2: Campus */}
          <button
            type="button"
            className={`circle-bottom-nav__tab ${activeTab === 'campus' ? 'is-active' : ''}`}
            onClick={() => handleTabClick(mainTabs[1])}
            aria-label="Campus"
            aria-current={activeTab === 'campus' ? 'page' : undefined}
          >
            <span className="circle-bottom-nav__icon">
              <Building2 size={20} strokeWidth={activeTab === 'campus' ? 2.4 : 1.8} />
            </span>
            <span className="circle-bottom-nav__label">Campus</span>
          </button>

          {/* Center Tab: SCMBT Ship (Home) */}
          <button
            type="button"
            className={`circle-bottom-nav__tab circle-bottom-nav__tab--center ${activeTab === 'home' ? 'is-active' : ''}`}
            onClick={() => onTabSelect && onTabSelect('home')}
            aria-label="Home"
            aria-current={activeTab === 'home' ? 'page' : undefined}
          >
            <span className="circle-bottom-nav__center-button">
              <img 
                src={shipMenuImg} 
                alt="SCMBT Ship Home" 
                className="circle-bottom-nav__ship-img" 
              />
            </span>
            <span className="circle-bottom-nav__label">Home</span>
          </button>

          {/* Tab 4: Profile */}
          <button
            type="button"
            className={`circle-bottom-nav__tab ${activeTab === 'profile' ? 'is-active' : ''}`}
            onClick={() => handleTabClick(mainTabs[2])}
            aria-label="Profile"
            aria-current={activeTab === 'profile' ? 'page' : undefined}
          >
            <span className="circle-bottom-nav__icon">
              <Users size={20} strokeWidth={activeTab === 'profile' ? 2.4 : 1.8} />
            </span>
            <span className="circle-bottom-nav__label">Profile</span>
          </button>

          {/* Tab 5: More */}
          <button
            type="button"
            className={`circle-bottom-nav__tab ${isDrawerOpen ? 'is-active' : ''}`}
            onClick={() => handleTabClick(mainTabs[3])}
            aria-label="More"
          >
            <span className="circle-bottom-nav__icon">
              <MoreHorizontal size={20} strokeWidth={1.8} />
            </span>
            <span className="circle-bottom-nav__label">More</span>
          </button>
        </div>
      </nav>

      {/* Slide-Up Drawer for Secondary Navigation */}
      {isDrawerOpen && (
        <div 
          className="circle-nav-drawer-backdrop" 
          onClick={() => setIsDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="circle-nav-drawer-sheet" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="circle-nav-drawer-header">
              <span className="circle-nav-drawer-title">Portal Navigation</span>
              <button 
                type="button" 
                className="circle-nav-drawer-close" 
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="circle-nav-drawer-grid">
              {secondaryTabs.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`circle-nav-drawer-item ${isSelected ? 'active' : ''} ${item.isDanger ? 'danger' : ''}`}
                    onClick={() => handleSecondarySelect(item.id)}
                  >
                    <div className="circle-nav-drawer-icon-box">
                      <Icon size={18} />
                    </div>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
