import React, { useState } from 'react';
import { X, Plus, BookOpen, Clock, Users } from 'lucide-react';

export default function CreateClassModal({ isOpen, onClose, onAddClass }) {
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('English Literature');
  const [time, setTime] = useState('15:00 - 15:45');
  const [type, setType] = useState('Public Lesson');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!className.trim()) return;

    onAddClass({
      id: `class-${Date.now()}`,
      name: className,
      subject,
      time,
      type,
      students: 1,
      code: `CLS-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Scheduled',
    });

    setClassName('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="create-class-title">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="create-class-title" className="modal-title">Create a new class</h2>
          <button type="button" className="capsule-icon-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="input-classname" className="form-label">Class Name</label>
              <input
                id="input-classname"
                type="text"
                className="form-input"
                placeholder="e.g. Advanced Math 101, Lucy Reading Room"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="input-subject" className="form-label">Subject / Topic</label>
              <select
                id="input-subject"
                className="form-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="English Literature">English Literature</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics & Science">Physics &amp; Science</option>
                <option value="Programming & CS">Programming &amp; CS</option>
                <option value="Art & Design">Art &amp; Design</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input-time" className="form-label">Scheduled Time</label>
              <input
                id="input-time"
                type="text"
                className="form-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="input-type" className="form-label">Lesson Visibility</label>
              <select
                id="input-type"
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Public Lesson">Public Lesson (Anyone with link)</option>
                <option value="Private Class">Private Class (Invite only)</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-modal">
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
