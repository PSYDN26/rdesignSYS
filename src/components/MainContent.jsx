import React, { useState } from 'react';
import { Plus, ChevronDown, Check, Users, Clock, BookOpen } from 'lucide-react';

export default function MainContent({ 
  classes = [], 
  onCreateClassClick, 
  filter, 
  setFilter 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'my_classes', label: 'My Classes' },
    { id: 'public', label: 'Public Lessons' },
    { id: 'archived', label: 'Archived' },
  ];

  const currentLabel = filterOptions.find(o => o.id === filter)?.label || 'All';

  return (
    <main className="desktop-main-content" role="main" aria-label="Main class schedule and creation">
      {/* Subheader controls row */}
      <div className="main-content-header">
        {/* Dropdown Selector */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            className="filter-dropdown-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            <span>{currentLabel}</span>
            <ChevronDown size={16} strokeWidth={2.4} />
          </button>

          {dropdownOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 6,
                background: '#ffffff',
                boxShadow: 'var(--shadow-dropdown)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                padding: '6px',
                zIndex: 50,
                minWidth: '160px',
              }}
              role="listbox"
            >
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: opt.id === filter ? 600 : 400,
                    color: opt.id === filter ? '#111827' : '#4b5563',
                    background: opt.id === filter ? '#f3f4f6' : 'transparent',
                  }}
                  onClick={() => {
                    setFilter(opt.id);
                    setDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={opt.id === filter}
                >
                  <span>{opt.label}</span>
                  {opt.id === filter && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* + New Class Button */}
        <button 
          type="button" 
          className="btn-new-class"
          onClick={onCreateClassClick}
          aria-label="Create new class"
        >
          <Plus size={16} strokeWidth={2.6} />
          <span>New Class</span>
        </button>
      </div>

      {/* Main Container Area */}
      <div className="create-class-card-area">
        {/* Dotted / Dashed Card matching screenshot */}
        <div 
          className="dashed-create-card"
          onClick={onCreateClassClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onCreateClassClick()}
          aria-label="Create a class"
        >
          <div className="plus-circle-icon-wrap" aria-hidden="true">
            <Plus size={22} strokeWidth={2.2} />
          </div>
          <h2 className="card-title-text">Create a class</h2>
          <p className="card-desc-text">Invite members to teach &amp; learn together</p>
        </div>

        {/* Render any created classes */}
        {classes.length > 0 && (
          <div className="classes-grid">
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
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{cls.time || '14:00'}</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                    {cls.name}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{cls.subject || 'General Discussion'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '11px', color: '#9ca3af', paddingTop: 6, borderTop: '1px solid #f3f4f6' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={12} /> {cls.students || 0} enrolled
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <BookOpen size={12} /> {cls.code || 'CLS-101'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
