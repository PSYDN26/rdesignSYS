import React, { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import TodoList from './components/TodoList';
import MobileBottomNav from './components/MobileBottomNav';
import CreateClassModal from './components/CreateClassModal';
import EnterClassModal from './components/EnterClassModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
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
      {/* 1. Production Web Application Header */}
      <TopBar
        lessonCount={1}
        user={{ name: '006a.user...', tier: 'Free', avatar: '01' }}
        onSearchClick={() => alert('Search classes & resources')}
        onCreateClassClick={() => setIsCreateModalOpen(true)}
        unreadCount={1}
      />

      {/* 2. Full-Viewport Edge-to-Edge Workspace */}
      <div className="prod-workspace-layout">
        {/* Left Navigation Sidebar (Desktop) */}
        <Sidebar
          activeTab={activeTab}
          onTabSelect={setActiveTab}
          todoCount={1}
        />

        {/* Center Main Content (Responsive across all screens) */}
        <MainContent
          classes={classes}
          onCreateClassClick={() => setIsCreateModalOpen(true)}
          filter={filter}
          setFilter={setFilter}
        />

        {/* Right Rail: To-do List (Desktop) */}
        <TodoList
          lesson={currentLesson}
          onEnterLesson={handleEnterLesson}
        />
      </div>

      {/* 3. Mobile Native Bottom Navigation Bar (< 768px) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabSelect={setActiveTab}
        todoBadge={1}
      />

      {/* 4. Interactive Modals */}
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
