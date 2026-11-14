import React from 'react';
import { ArrowUpRight, Video, ChevronRight, Clock } from 'lucide-react';

export default function TodoList({ onEnterLesson, lesson = {
  id: 'lucy-1400',
  title: '111426 1400 Lucy',
  time: 'Today 14:00 Start (40min)',
  teacher: '006a.user.cl...',
  type: 'Public Lesson',
  present: '0/2',
  startedAgo: '< 1min',
} }) {
  return (
    <aside className="desktop-todo-sidebar" aria-label="To-do list sidebar">
      {/* Header */}
      <div className="todo-header">
        <h2 className="todo-title">To-do list</h2>
        <button type="button" className="todo-more-link" title="View all to-do items">
          <span>More</span>
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* Time frame divider */}
      <div className="todo-time-divider" role="separator">
        <span>Next 24 hours</span>
      </div>

      {/* Lesson Item Card */}
      <article className="lesson-card" aria-label={`Scheduled lesson: ${lesson.title}`}>
        {/* Lesson Video Monitor Icon */}
        <div className="lesson-icon-box" aria-hidden="true">
          <Video size={17} strokeWidth={2} />
        </div>

        {/* Lesson Information */}
        <div className="lesson-info-col">
          <h3 className="lesson-name" title={lesson.title}>{lesson.title}</h3>
          
          <div className="lesson-time-sub">
            <span>{lesson.time}</span>
            <span>{lesson.teacher}</span>
          </div>

          <div className="lesson-tag-link" role="link" tabIndex={0}>
            <span>{lesson.type}</span>
            <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </div>

          <div className="lesson-status-row">
            <span className="status-present">Present {lesson.present}</span>
            <span className="status-started">Started {lesson.startedAgo}</span>
          </div>
        </div>

        {/* Enter Lesson Button */}
        <button 
          type="button" 
          className="btn-enter-lesson"
          onClick={() => onEnterLesson(lesson)}
          aria-label={`Enter ${lesson.title}`}
        >
          Enter
        </button>
      </article>
    </aside>
  );
}
