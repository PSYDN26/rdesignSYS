import React, { useState } from 'react';
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
import crestImg from '../assets/SCMBT_Crest.png';
import './CircleBottomNav.css';

/**
 * CircleBottomNav
 * 5-Item Circle CTA Bottom Navigation Bar for SCMBT Portal
 * Sequence: [Tasks] [Campus] [Crest (Home)] [Profile] [More]
 */
export default function CircleBottomNav({
  activeTab = 'profile',
  onTabSelect,
  todoBadge = 1,
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const mainTabs = [
    { id: 'todo', label: 'Tasks', icon: ClipboardCheck, badge: todoBadge },
    { id: 'campus', label: 'Campus', icon: Building2 },
    // Center is Crest (Home)
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
        className="circle-bottom-nav-root" 
        role="navigation" 
        aria-label="Mobile Bottom Navigation"
      >
        <div className="circle-nav-container">
          {/* Layer 1: SVG Organic Curved Cradle Backdrop */}
          <svg 
            className="circle-nav-backdrop-svg"
            viewBox="0 0 375 78" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* 
              Organic Cradle Formula:
              - Left horizontal baseline: y=16
              - Smooth concave fillet curve scooping up: C (130, 16) -> (155, 0)
              - Crest apex over center circle: (187.5, 0)
              - Smooth concave fillet curve dropping back: C (220, 0) -> (245, 16)
              - Right horizontal baseline: y=16
            */}
            <path 
              d="
                M 0 16
                H 125
                C 145 16, 162 0, 187.5 0
                C 213 0, 230 16, 250 16
                H 375
                V 78
                H 0
                Z
              "
            />
          </svg>

          {/* Layer 2: 5 Interactive Nav Slots */}
          <div className="circle-nav-items-grid">
            {/* Slot 1: Tasks (with amber badge) */}
            <button
              type="button"
              className={`circle-nav-tab ${activeTab === 'todo' ? 'active' : ''}`}
              onClick={() => handleTabClick(mainTabs[0])}
              aria-current={activeTab === 'todo' ? 'page' : undefined}
              title="Tasks"
            >
              <div className="circle-nav-icon-wrap">
                <ClipboardCheck size={20} strokeWidth={activeTab === 'todo' ? 2.4 : 1.8} />
                {todoBadge ? (
                  <span className="circle-nav-badge">{todoBadge}</span>
                ) : null}
              </div>
              <span>Tasks</span>
            </button>

            {/* Slot 2: Campus */}
            <button
              type="button"
              className={`circle-nav-tab ${activeTab === 'campus' ? 'active' : ''}`}
              onClick={() => handleTabClick(mainTabs[1])}
              aria-current={activeTab === 'campus' ? 'page' : undefined}
              title="Campus"
            >
              <div className="circle-nav-icon-wrap">
                <Building2 size={20} strokeWidth={activeTab === 'campus' ? 2.4 : 1.8} />
              </div>
              <span>Campus</span>
            </button>

            {/* Slot 3 (Center): Elevated Circle CTA (Crest as Home) */}
            <button
              type="button"
              className={`circle-nav-center-cta ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => onTabSelect && onTabSelect('home')}
              title="Home"
              aria-label="Home"
              aria-current={activeTab === 'home' ? 'page' : undefined}
            >
              <div className="circle-nav-cta-disc">
                <img 
                  src={crestImg} 
                  alt="SCMBT Crest" 
                  className="circle-nav-crest-img" 
                />
              </div>
              <span className="circle-nav-center-label">Home</span>
            </button>

            {/* Slot 4: Profile */}
            <button
              type="button"
              className={`circle-nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabClick(mainTabs[2])}
              aria-current={activeTab === 'profile' ? 'page' : undefined}
              title="Profile"
            >
              <div className="circle-nav-icon-wrap">
                <Users size={20} strokeWidth={activeTab === 'profile' ? 2.4 : 1.8} />
              </div>
              <span>Profile</span>
            </button>

            {/* Slot 5: More */}
            <button
              type="button"
              className={`circle-nav-tab ${isDrawerOpen ? 'active' : ''}`}
              onClick={() => handleTabClick(mainTabs[3])}
              title="More options"
              aria-label="More"
            >
              <div className="circle-nav-icon-wrap">
                <MoreHorizontal size={20} strokeWidth={1.8} />
              </div>
              <span>More</span>
            </button>
          </div>
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
