import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import TodoList from './components/TodoList';
import MobileHeader from './components/MobileHeader';
import MobileBottomNav from './components/MobileBottomNav';
import CreateClassModal from './components/CreateClassModal';
import EnterClassModal from './components/EnterClassModal';
import ViewSwitcher from './components/ViewSwitcher';

export default function App() {
  // Mode: 'desktop' | 'mobile' | 'responsive'
  const [mode, setMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('home');
  const [filter, setFilter] = useState('all');
  const [classes, setClasses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEnterModalOpen, setIsEnterModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Lesson data matching image.png
  const [currentLesson, setCurrentLesson] = useState({
    id: 'lucy-1400',
    title: '111426 1400 Lucy',
    time: 'Today 14:00 Start (40min)',
    teacher: '006a.user.cl...',
    type: 'Public Lesson',
    present: '0/2',
    startedAgo: '< 1min',
  });

  // Track window resize for responsive mode
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddClass = (newClass) => {
    setClasses((prev) => [newClass, ...prev]);
  };

  const handleEnterLesson = (lesson) => {
    setCurrentLesson(lesson);
    setIsEnterModalOpen(true);
  };

  const isMobileViewport = mode === 'mobile' || (mode === 'responsive' && windowWidth < 900);

  return (
    <div className="app-container">
      {/* Floating View Switcher for Boilerplate Demonstration */}
      <ViewSwitcher mode={mode} setMode={setMode} />

      {/* Main Workspace Canvas */}
      <div className="workspace-canvas">
        {isMobileViewport ? (
          /* ===================================================
             MOBILE VIEW (Replicating image_2.png)
             =================================================== */
          <div className={mode === 'responsive' ? 'responsive-app-view' : 'phone-mockup-frame'}>
            {/* Top Phone Island / Notch in mockup mode */}
            {mode === 'mobile' && <div className="phone-notch" />}

            {/* Mobile Status Bar & Header */}
            <MobileHeader
              user={{ avatar: '01', tier: 'Free' }}
              filter={filter}
              onSearchClick={() => alert('Search classes & resources')}
              onCreateClassClick={() => setIsCreateModalOpen(true)}
              currentTime="2:09"
            />

            {/* Mobile Body Content */}
            <div className="mobile-body-content">
              {activeTab === 'home' ? (
                <div className="create-class-card-area">
                  <div 
                    className="mobile-dashed-card"
                    onClick={() => setIsCreateModalOpen(true)}
                    role="button"
                    tabIndex={0}
                    aria-label="Create a class"
                  >
                    <div className="plus-circle-icon-wrap">
                      <span style={{ fontSize: '26px', lineHeight: 1 }}>+</span>
                    </div>
                    <h2 className="card-title-text" style={{ fontSize: '16px', marginBottom: 6 }}>
                      Create a class
                    </h2>
                    <p className="card-desc-text" style={{ fontSize: '13px' }}>
                      Invite members to teach &amp; learn together
                    </p>
                  </div>

                  {/* Render any created classes */}
                  {classes.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                      {classes.map((cls) => (
                        <div key={cls.id} className="active-class-card">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ 
                              fontSize: '11px', 
                              fontWeight: 600, 
                              color: '#00c06d', 
                              background: '#e6f9f0', 
                              padding: '2px 8px', 
                              borderRadius: '9999px' 
                            }}>
                              {cls.status || 'Active'}
                            </span>
                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>{cls.time}</span>
                          </div>
                          <div>
                            <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '4px 0 2px' }}>
                              {cls.name}
                            </h4>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>{cls.subject}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Show To-Do Card also in mobile if there is a pending lesson */}
                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f2f5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#11141a' }}>To-do list</span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Next 24 hours</span>
                    </div>
                    <div className="active-class-card" style={{ padding: 12, background: '#fcfdfe' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ fontSize: '13.5px', fontWeight: 600 }}>{currentLesson.title}</h4>
                          <p style={{ fontSize: '11px', color: '#6b7280' }}>{currentLesson.time}</p>
                          <span style={{ fontSize: '11px', color: '#00c06d', fontWeight: 600 }}>Present {currentLesson.present}</span>
                        </div>
                        <button
                          type="button"
                          className="btn-enter-lesson"
                          onClick={() => handleEnterLesson(currentLesson)}
                        >
                          Enter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: 8, textTransform: 'capitalize' }}>
                    {activeTab} View
                  </h3>
                  <p style={{ fontSize: '13px' }}>
                    This section ({activeTab}) is ready for your template custom logic!
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <MobileBottomNav
              activeTab={activeTab}
              onTabSelect={setActiveTab}
              todoBadge={1}
            />
          </div>
        ) : (
          /* ===================================================
             DESKTOP VIEW (Replicating image.png)
             =================================================== */
          <div className="desktop-window">
            {/* Window Top Bar (Search, 1 lesson capsule, Window Controls) */}
            <TopBar
              lessonCount={1}
              onSearchClick={() => alert('Search classes & resources')}
              onSyncClick={() => alert('Synced latest class data')}
            />

            {/* Desktop Window Body */}
            <div className="desktop-body">
              {/* Left Sidebar */}
              <Sidebar
                activeTab={activeTab}
                onTabSelect={setActiveTab}
                todoCount={1}
                user={{ name: '006a.user...', tier: 'Free', avatar: '0' }}
              />

              {/* Center Main Content Area */}
              <MainContent
                classes={classes}
                onCreateClassClick={() => setIsCreateModalOpen(true)}
                filter={filter}
                setFilter={setFilter}
              />

              {/* Right Sidebar: To-do List */}
              <TodoList
                lesson={currentLesson}
                onEnterLesson={handleEnterLesson}
              />
            </div>
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddClass={handleAddClass}
      />

      <EnterClassModal
        isOpen={isEnterModalOpen}
        onClose={() => setIsEnterModalOpen(false)}
        lesson={currentLesson}
      />
    </div>
  );
}
