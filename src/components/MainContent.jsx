import React, { useState } from 'react';
import { Plus, ChevronDown, Check, Users, BookOpen } from 'lucide-react';

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
    <main className="prod-main-content" role="main" aria-label="Class Management">
      {/* Content Header & Action Toolbar */}
      <div className="content-toolbar">
        {/* Category Filter Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            className="category-dropdown-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            <span>{currentLabel}</span>
            <ChevronDown size={17} strokeWidth={2.4} />
          </button>

          {dropdownOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 6,
                background: '#ffffff',
                boxShadow: 'var(--shadow-md)',
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
                    color: opt.id === filter ? 'var(--blue)' : 'var(--muted)',
                    background: opt.id === filter ? 'var(--blue-tint)' : 'transparent',
                  }}
                  onClick={() => {
                    setFilter(opt.id);
                    setDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={opt.id === filter}
                >
                  <span>{opt.label}</span>
                  {opt.id === filter && <Check size={14} color="var(--amber)" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Primary Action: + New Class */}
        <button 
          type="button" 
          className="btn-primary-action"
          onClick={onCreateClassClick}
          aria-label="Create new class"
        >
          <Plus size={16} strokeWidth={2.6} />
          <span>New Class</span>
        </button>
      </div>

      {/* Main Class Creation / Schedule Space */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Signature Dashed / Dotted Empty State Card */}
        <div 
          className="dashed-create-container"
          onClick={onCreateClassClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onCreateClassClick()}
          aria-label="Create a class"
        >
          <div className="create-icon-bubble" aria-hidden="true">
            <Plus size={22} strokeWidth={2.2} />
          </div>
          <h2 className="create-title">Create a class</h2>
          <p className="create-subtitle">Invite members to teach &amp; learn together</p>
        </div>

        {/* Render Created Classes Grid */}
        {classes.length > 0 && (
          <div className="classes-grid-layout">
            {classes.map((cls) => (
              <div key={cls.id} className="class-card-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    color: '#00c06d', 
                    background: '#e6f9f0', 
                    padding: '2px 8px', 
                    borderRadius: '9999px' 
                  }}>
                    {cls.status || 'Active'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{cls.time}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                    {cls.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{cls.subject || 'General Study'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '11px', color: '#94a3b8', paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
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
