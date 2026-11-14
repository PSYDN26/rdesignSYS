import React from 'react';
import { ArrowUpRight, Video, ChevronRight } from 'lucide-react';

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
    <aside className="prod-todo-rail" aria-label="Upcoming schedule and to-do list">
      {/* Header */}
      <div className="todo-header-row">
        <h2 className="todo-heading">To-do list</h2>
        <button type="button" className="todo-view-more" title="View all to-do items">
          <span>More</span>
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* Timeline divider */}
      <div className="todo-timeline-divider" role="separator">
        <span>Next 24 hours</span>
      </div>

      {/* Lesson Item Card */}
      <article className="lesson-entry-card" aria-label={`Scheduled lesson: ${lesson.title}`}>
        {/* Lesson Video Monitor Icon */}
        <div className="lesson-icon-tile" aria-hidden="true">
          <Video size={17} strokeWidth={2} />
        </div>

        {/* Lesson Information */}
        <div className="lesson-detail-col">
          <h3 className="lesson-card-title" title={lesson.title}>{lesson.title}</h3>
          
          <div className="lesson-card-time">
            <span>{lesson.time}</span>
            <span style={{ display: 'block', color: 'var(--muted)', fontSize: '10.5px' }}>{lesson.teacher}</span>
          </div>

          <div className="lesson-card-tag" role="link" tabIndex={0}>
            <span>{lesson.type}</span>
            <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </div>

          <div className="lesson-card-status">
            <span className="status-present-text">Present {lesson.present}</span>
            <span className="status-started-text">Started {lesson.startedAgo}</span>
          </div>
        </div>

        {/* Enter Lesson Button */}
        <button 
          type="button" 
          className="btn-enter-room"
          onClick={() => onEnterLesson(lesson)}
          aria-label={`Enter ${lesson.title}`}
        >
          Enter
        </button>
      </article>
    </aside>
  );
}
