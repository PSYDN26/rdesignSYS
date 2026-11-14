import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import TodoList from './components/TodoList';
import ProfileProgressSidebar from './components/ProfileProgressSidebar';
import MobileBottomNav from './components/MobileBottomNav';
import CreateClassModal from './components/CreateClassModal';
import EnterClassModal from './components/EnterClassModal';
import StudentProfileForm from './components/StudentProfileForm';

export default function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileStep, setProfileStep] = useState(1);
  const [filter, setFilter] = useState('all');
  const [classes, setClasses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEnterModalOpen, setIsEnterModalOpen] = useState(false);

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

  return (
    <div className="prod-app-shell">
      {/* Column 1: Leftmost Full-Height Navigation Sidebar with SCMBT Logo */}
      <Sidebar
        activeTab={activeTab}
        onTabSelect={setActiveTab}
        todoCount={1}
        user={{ name: '006a.user...', tier: 'Free', avatar: '01' }}
      />

      {/* Main Workspace Stage (TopBar + 2 Edge-to-Edge Touching Columns) */}
      <div className="prod-stage-wrapper">
        {/* Top Header Bar (Centered search capsule + right profile & notifications) */}
        <TopBar
          lessonCount={1}
          user={{ name: '006a.user...', tier: 'Free', avatar: '01' }}
          onSearchClick={() => alert('Search classes & documents')}
          onCreateClassClick={() => setIsCreateModalOpen(true)}
          unreadCount={1}
        />

        {/* 2 Edge-to-Edge Touching Content Columns */}
        <div className="prod-touching-workspace">
          
          {/* Column 2: Center Content Area (Touching Column 1 and Column 3) */}
          <div className="prod-center-column">
            {activeTab === 'profile' ? (
              <StudentProfileForm 
                currentStep={profileStep}
                onStepChange={setProfileStep}
                onSaveSuccess={() => setActiveTab('home')}
              />
            ) : (
              <MainContent
                classes={classes}
                onCreateClassClick={() => setIsCreateModalOpen(true)}
                filter={filter}
                setFilter={setFilter}
              />
            )}
          </div>

          {/* Column 3: Right Sidebar (Touching Column 2 with shared 1px hairline border) */}
          {activeTab === 'profile' ? (
            <ProfileProgressSidebar
              currentStep={profileStep}
              onSelectStep={setProfileStep}
              completedSteps={[1, 2, 3, 4]}
              totalSteps={5}
              lastSaved="Just now"
            />
          ) : (
            <TodoList
              lesson={currentLesson}
              onEnterLesson={handleEnterLesson}
            />
          )}

        </div>
      </div>

      {/* Mobile Native Bottom Navigation Bar (< 768px) */}
      <MobileBottomNav
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
  );
}
