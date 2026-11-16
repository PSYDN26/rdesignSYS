import React, { useState } from 'react';
import { 
  LayoutGrid, 
  ClipboardCheck, 
  Users, 
  MoreHorizontal,
  Building2,
  GraduationCap,
  Wallet,
  TrendingUp,
  SlidersHorizontal,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';
import crestImg from '../assets/SCMBT_Crest.png';

export default function MobileBottomNav({ 
  activeTab = 'profile', 
  onTabSelect, 
  todoBadge = 1 
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { id: 'todo', label: 'Tasks', icon: ClipboardCheck, badge: todoBadge },
    { id: 'campus', label: 'Campus', icon: Building2 },
    // Center is Crest (Home)
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'more', label: 'More', icon: MoreHorizontal, isAction: true },
  ];

  const moreItems = [
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'signout', label: 'Signout', icon: LogOut, isDanger: true },
  ];

  const handleTabClick = (tab) => {
    if (tab.isAction) {
      setIsMoreOpen(true);
    } else {
      if (onTabSelect) onTabSelect(tab.id);
    }
  };

  const handleMoreSelect = (itemId) => {
    setIsMoreOpen(false);
    if (itemId === 'signout') {
      alert('Signed out successfully.');
    } else if (onTabSelect) {
      onTabSelect(itemId);
    }
  };

  return (
    <>
      <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
        {/* Item 1: Tasks (with amber badge) */}
        <button
          type="button"
          className={`mobile-tab-btn ${activeTab === 'todo' ? 'active' : ''}`}
          onClick={() => handleTabClick(mainTabs[0])}
          aria-current={activeTab === 'todo' ? 'page' : undefined}
          title="Tasks"
        >
          <div style={{ position: 'relative' }}>
            <ClipboardCheck size={19} strokeWidth={activeTab === 'todo' ? 2.5 : 1.8} />
            {todoBadge ? (
              <span className="mobile-badge-pill">{todoBadge}</span>
            ) : null}
          </div>
          <span>Tasks</span>
        </button>

        {/* Item 2: Campus */}
        <button
          type="button"
          className={`mobile-tab-btn ${activeTab === 'campus' ? 'active' : ''}`}
          onClick={() => handleTabClick(mainTabs[1])}
          aria-current={activeTab === 'campus' ? 'page' : undefined}
          title="Campus"
        >
          <Building2 size={19} strokeWidth={activeTab === 'campus' ? 2.5 : 1.8} />
          <span>Campus</span>
        </button>

        {/* Center: Crest as Home */}
        <button
          type="button"
          className={`mobile-crest-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => onTabSelect && onTabSelect('home')}
          title="Home"
          aria-label="Home"
          aria-current={activeTab === 'home' ? 'page' : undefined}
        >
          <div className="mobile-crest-circle">
            <img src={crestImg} alt="SCMBT Crest" className="mobile-crest-img" />
          </div>
          <span className="mobile-crest-label">Home</span>
        </button>

        {/* Item 3: Profile */}
        <button
          type="button"
          className={`mobile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabClick(mainTabs[2])}
          aria-current={activeTab === 'profile' ? 'page' : undefined}
          title="Profile"
        >
          <Users size={19} strokeWidth={activeTab === 'profile' ? 2.5 : 1.8} />
          <span>Profile</span>
        </button>

        {/* More icon */}
        <button
          type="button"
          className={`mobile-tab-btn ${isMoreOpen ? 'active' : ''}`}
          onClick={() => handleTabClick(mainTabs[3])}
          title="More options"
          aria-label="More"
        >
          <MoreHorizontal size={20} strokeWidth={1.8} />
          <span>More</span>
        </button>
      </nav>

      {/* More Options Bottom Sheet */}
      {isMoreOpen && (
        <div className="mobile-more-backdrop" onClick={() => setIsMoreOpen(false)}>
          <div className="mobile-more-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-more-header">
              <span className="mobile-more-title">More Navigation</span>
              <button 
                type="button" 
                className="mobile-more-close" 
                onClick={() => setIsMoreOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mobile-more-grid">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`mobile-more-item ${isSelected ? 'active' : ''} ${item.isDanger ? 'danger' : ''}`}
                    onClick={() => handleMoreSelect(item.id)}
                  >
                    <div className="mobile-more-icon-box">
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
