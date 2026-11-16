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
 * Wide, Smooth Circular CTA Notch matching the reference design:
 * - Mobile viewport baseline: 390px (responsive via ResizeObserver)
 * - Navigation height: 86px
 * - Circular CTA diameter: 76px (with 50px SCMBT ship emblem)
 * - Notch width: 140px (wide, flowing U-shaped cradle)
 * - Notch depth: 40px (gentle rounded nadir, zero V-pointiness)
 * - CTA overlap above top edge: 40px (disc top at -40px)
 * - Visual gap: ~6-8px consistent concentric clearance
 * - Cubic Bézier easing: smooth C1 horizontal transitions at shoulders & nadir
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

  // Geometry: Wide, smooth U-shaped cradle with horizontal tangents
  const height = 86;
  const cx = navWidth / 2;
  const halfNotch = 70; // 140px total notch opening
  const notchDepth = 40;
  const cornerR = 16;

  const leftStart = Math.max(cornerR, cx - halfNotch);
  const leftCp1 = cx - 47.6; // Shoulder departure control point
  const leftCp2 = cx - 35.0; // Nadir arrival control point
  const rightCp1 = cx + 35.0; // Nadir departure control point
  const rightCp2 = cx + 47.6; // Shoulder arrival control point
  const rightEnd = Math.min(navWidth - cornerR, cx + halfNotch);
  const rightCorner = navWidth - cornerR;

  const svgPath = `
    M 0 ${cornerR}
    Q 0 0 ${cornerR} 0
    H ${leftStart.toFixed(1)}
    C ${leftCp1.toFixed(1)} 0, ${leftCp2.toFixed(1)} ${notchDepth}, ${cx.toFixed(1)} ${notchDepth}
    C ${rightCp1.toFixed(1)} ${notchDepth}, ${rightCp2.toFixed(1)} 0, ${rightEnd.toFixed(1)} 0
    H ${rightCorner.toFixed(1)}
    Q ${navWidth} 0 ${navWidth} ${cornerR}
    V ${height}
    H 0
    Z
  `;

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
        className="circle-bottom-nav-root" 
        role="navigation" 
        aria-label="Mobile Bottom Navigation"
      >
        <div className="circle-nav-container" ref={containerRef}>
          {/* Layer 1: Pixel-Perfect SVG Wide U-Cradle Backdrop (Dark Navy #042B4E) */}
          <svg 
            className="circle-nav-backdrop-svg"
            viewBox={`0 0 ${navWidth} ${height}`}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path 
              d={svgPath}
              className="circle-nav-path"
            />
          </svg>

          {/* Layer 2: 5 Interactive Nav Slots (Exact 20% / 7cm each) */}
          <div className="circle-nav-items-grid">
            {/* Slot 1: Tasks (Col 1: 0 - 7cm) */}
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

            {/* Slot 2: Campus (Col 2: 7 - 14cm) */}
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

            {/* Slot 3 (Center): Elevated Circle Donut CTA (Col 3: 14 - 21cm, Center 17.5cm) */}
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
                  src={shipMenuImg} 
                  alt="SCMBT Ship Home" 
                  className="circle-nav-ship-img" 
                />
              </div>
              <span className="circle-nav-center-label">Home</span>
            </button>

            {/* Slot 4: Profile (Col 4: 21 - 28cm) */}
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

            {/* Slot 5: More (Col 5: 28 - 35cm) */}
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
