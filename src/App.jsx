import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import TodoList from './components/TodoList';
import ProfileProgressSidebar from './components/ProfileProgressSidebar';
import CircleBottomNav from './components/CircleBottomNav';
import CreateClassModal from './components/CreateClassModal';
import EnterClassModal from './components/EnterClassModal';
import StudentProfileForm from './components/StudentProfileForm';
import GuidanceExamBank from './components/GuidanceExamBank';

export default function App() {
  // Navigation & View state - Default to Page 1: Guidance Exam Bank
  const [activeTab, setActiveTab] = useState('exam-bank');
  const [profileStep, setProfileStep] = useState(1);
  const [filter, setFilter] = useState('all');
  const [classes, setClasses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEnterModalOpen, setIsEnterModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Lesson data matching the design
  const [currentLesson, setCurrentLesson] = useState({
    id: 'lucy-1400',
    title: '111426 1400 Lucy',
    time: 'Today 14:00 Start (40min)',
    teacher: '006a.user.cl...',
    type: 'Public Lesson',
    present: '0/2',
    startedAgo: '< 1min',
  });

  const handleAddClass = (newClass) => {
    setClasses((prev) => [newClass, ...prev]);
  };

  const handleEnterLesson = (lesson) => {
    setCurrentLesson(lesson);
    setIsEnterModalOpen(true);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'exam-bank':
        return 'Exam Bank & Setup';
      case 'applicant-exam':
        return 'Entrance Examination';
      case 'referral-slip':
        return 'Guidance Referral Slip';
      case 'aptitude-results':
        return 'RPM Aptitude Encoding';
      case 'legacy-migration':
        return 'Legacy Exam Migration';
      case 'faculty-roster':
        return 'Class Roster Sheet';
      case 'profile':
        return 'Student Profile';
      case 'home':
        return 'Dashboard';
      default:
        return 'SCMBT Portal';
    }
  };

  const getUserBadge = () => {
    if (activeTab === 'exam-bank' || activeTab === 'aptitude-results') {
      return { name: 'M. Santos, RPM', tier: 'Guidance', avatar: '01' };
    }
    if (activeTab === 'legacy-migration') {
      return { name: 'Dr. C. Villanueva', tier: 'Exec VP', avatar: '01' };
    }
    if (activeTab === 'faculty-roster') {
      return { name: 'Capt. E. Morales', tier: 'Faculty', avatar: '01' };
    }
    return { name: 'Juan Dela Cruz', tier: 'Applicant', avatar: '01' };
  };

  return (
    <div className="app-grey-page-wrapper">
      {/* 1 Main Container on Grey Page */}
      <div className="prod-app-shell">
        {/* Column 1: Leftmost Full-Height Navigation Sidebar (Collapsible into Floating Capsule) */}
        <Sidebar
          activeTab={activeTab}
          onTabSelect={setActiveTab}
          todoCount={1}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Main Workspace Stage (TopBar + Content Stage) */}
        <div className="prod-stage-wrapper">
          {/* Top Header Bar with dynamic container capsule title */}
          <TopBar
            title={getPageTitle()}
            lessonCount={1}
            user={getUserBadge()}
            onSearchClick={() => alert('Search admissions and exam records')}
            onCreateClassClick={() => setIsCreateModalOpen(true)}
            unreadCount={1}
          />

          {/* Go/No-Go Gate Workflow Header Bar */}
          <div className="workflow-gate-banner" role="navigation" aria-label="Admissions Workflow Gates">
            <div className="gate-banner-label">
              <span className="gate-label-badge">Go / No-Go Plan</span>
              <span className="gate-label-text">Freshman Admissions &amp; Aptitude Testing Workflow</span>
            </div>

            <div className="gate-steps-scroll">
              <button
                type="button"
                className={`gate-step-btn ${activeTab === 'exam-bank' ? 'active current' : 'done'}`}
                onClick={() => setActiveTab('exam-bank')}
              >
                <span className="step-num">1</span>
                <span className="step-name">Guidance: Exam Bank</span>
                <span className="step-gate-tag current">Review Underway</span>
              </button>

              <button
                type="button"
                className={`gate-step-btn ${activeTab === 'applicant-exam' ? 'active' : 'locked'}`}
                onClick={() => setActiveTab('applicant-exam')}
                title="Gate 2: Unlocks upon Gate 1 Go confirmation"
              >
                <span className="step-num">2</span>
                <span className="step-name">Applicant: Exam Runner</span>
                <span className="step-gate-tag">Gate 2</span>
              </button>

              <button
                type="button"
                className={`gate-step-btn ${activeTab === 'referral-slip' ? 'active' : 'locked'}`}
                onClick={() => setActiveTab('referral-slip')}
                title="Gate 3: Unlocks upon Gate 2 Go confirmation"
              >
                <span className="step-num">3</span>
                <span className="step-name">Applicant: Referral Slip</span>
                <span className="step-gate-tag">Gate 3</span>
              </button>

              <button
                type="button"
                className={`gate-step-btn ${activeTab === 'aptitude-results' ? 'active' : 'locked'}`}
                onClick={() => setActiveTab('aptitude-results')}
                title="Gate 4: Unlocks upon Gate 3 Go confirmation"
              >
                <span className="step-num">4</span>
                <span className="step-name">RPM: Aptitude Encoding</span>
                <span className="step-gate-tag">Gate 4</span>
              </button>

              <button
                type="button"
                className={`gate-step-btn ${activeTab === 'legacy-migration' ? 'active' : 'locked'}`}
                onClick={() => setActiveTab('legacy-migration')}
                title="Gate 5: Unlocks upon Gate 4 Go confirmation"
              >
                <span className="step-num">5</span>
                <span className="step-name">Guidance &amp; EVP: Migration</span>
                <span className="step-gate-tag">Gate 5</span>
              </button>

              <button
                type="button"
                className={`gate-step-btn ${activeTab === 'faculty-roster' ? 'active' : 'locked'}`}
                onClick={() => setActiveTab('faculty-roster')}
                title="Gate 6: Unlocks upon Gate 5 Go confirmation"
              >
                <span className="step-num">6</span>
                <span className="step-name">Faculty: Roster Sheet</span>
                <span className="step-gate-tag">Gate 6</span>
              </button>
            </div>
          </div>

          {/* VIEW SWITCHER */}
          {activeTab === 'exam-bank' ? (
            <div className="prod-fullwidth-workspace">
              <GuidanceExamBank />
            </div>
          ) : activeTab === 'profile' ? (
            <div className="prod-touching-workspace">
              <div className="prod-center-column">
                <StudentProfileForm 
                  currentStep={profileStep}
                  onStepChange={setProfileStep}
                  onSaveSuccess={() => setActiveTab('home')}
                />
              </div>
              <ProfileProgressSidebar
                currentStep={profileStep}
                onSelectStep={setProfileStep}
                completedSteps={[1, 2, 3, 4]}
                totalSteps={5}
                lastSaved="Just now"
              />
            </div>
          ) : (
            <div className="prod-touching-workspace">
              <div className="prod-center-column">
                <MainContent
                  classes={classes}
                  onCreateClassClick={() => setIsCreateModalOpen(true)}
                  filter={filter}
                  setFilter={setFilter}
                />
              </div>
              <TodoList
                lesson={currentLesson}
                onEnterLesson={handleEnterLesson}
              />
            </div>
          )}
        </div>

        {/* Mobile Native Bottom Navigation Bar (< 768px) */}
        <CircleBottomNav
          activeTab={activeTab}
          onTabSelect={setActiveTab}
          todoBadge={1}
        />

        {/* Dialog Modals */}
        <CreateClassModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateClass={handleAddClass}
        />

        <EnterClassModal
          isOpen={isEnterModalOpen}
          onClose={() => setIsEnterModalOpen(false)}
          lesson={currentLesson}
        />
      </div>
    </div>
  );
}
