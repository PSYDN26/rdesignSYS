import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  User, 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileCheck, 
  Printer, 
  Clock 
} from 'lucide-react';

export default function ProfileProgressSidebar({ 
  currentStep, 
  onSelectStep, 
  completedSteps = [1, 2, 3, 4], 
  totalSteps = 5,
  lastSaved = 'Just now'
}) {
  const steps = [
    { num: 1, title: 'Personal Information', icon: User, fields: 'Full Name, Birth, Address' },
    { num: 2, title: 'Family Background', icon: Users, fields: 'Parents, Income & Guardian' },
    { num: 3, title: 'Educational Background', icon: GraduationCap, fields: 'Schools, SHS Strand, GWA' },
    { num: 4, title: 'Program & Enrollment', icon: BookOpen, fields: 'HEI Name, Degree & Year' },
    { num: 5, title: 'Photo & Certification', icon: FileCheck, fields: '2x2 Photo & Signature' },
  ];

  // Calculate percentage
  const percentage = Math.round((completedSteps.length / totalSteps) * 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <aside className="prod-todo-rail" style={{ width: '300px', background: '#ffffff', borderLeft: 'none' }} aria-label="Profile Completion and Navigation">
      
      {/* Circle Progress Percentage Card (Profile Completion header removed) */}
      <div style={{ 
        background: '#fafafa', 
        border: '1px solid #e5e7eb', 
        borderRadius: 12, 
        padding: '16px 14px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        marginBottom: 16
      }}>
        {/* SVG Circular Meter */}
        <div style={{ position: 'relative', width: 104, height: 104 }}>
          <svg width="104" height="104" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Ring */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated Progress Ring - Retains Amber Accent */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="#F98809"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>

          {/* Center Content: Percentage & Count */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            <span style={{ 
              fontSize: 22, 
              fontWeight: 900, 
              color: '#111827', 
              letterSpacing: '-0.5px',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1
            }}>
              {percentage}%
            </span>
            <span style={{ 
              fontSize: 10, 
              fontWeight: 600, 
              color: '#64748b',
              marginTop: 3
            }}>
              {completedSteps.length} of {totalSteps} done
            </span>
          </div>
        </div>

        {/* Real-time Save Status Pill */}
        <div style={{ 
          marginTop: 10, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 5, 
          fontSize: 10.5, 
          color: '#64748b' 
        }}>
          <Clock size={11} color="#94a3b8" />
          <span>Saved: <strong>{lastSaved}</strong></span>
        </div>
      </div>

      {/* DOCUMENT SECTIONS */}
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ 
          fontSize: 11, 
          fontWeight: 700, 
          letterSpacing: '0.04em', 
          color: '#475569', 
          textTransform: 'uppercase' 
        }}>
          Document Sections
        </span>
      </div>

      {/* Stepper Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflowY: 'auto' }}>
        {steps.map((s) => {
          const isActive = currentStep === s.num;
          const isDone = completedSteps.includes(s.num);

          return (
            <button
              key={s.num}
              type="button"
              onClick={() => onSelectStep(s.num)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 8,
                background: isActive ? '#042B4E' : '#ffffff',
                color: isActive ? '#ffffff' : '#4b5563',
                border: isActive ? 'none' : '1px solid #e5e7eb',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 4px 12px rgba(4, 43, 78, 0.22)' : 'none',
                cursor: 'pointer'
              }}
            >
              {/* Status Icon */}
              <div style={{ marginTop: 2 }}>
                {isDone ? (
                  <CheckCircle2 size={16} color={isActive ? '#F98809' : 'var(--amber)'} strokeWidth={2.4} />
                ) : (
                  <Circle size={16} color={isActive ? 'rgba(255, 255, 255, 0.6)' : '#d1d5db'} strokeWidth={2} />
                )}
              </div>

              {/* Title & Field Hint */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: 12, 
                  fontWeight: isActive ? 700 : 600, 
                  color: isActive ? '#ffffff' : '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>{s.num}. {s.title}</span>
                </div>
                <div style={{ 
                  fontSize: 10, 
                  color: isActive ? 'rgba(255, 255, 255, 0.8)' : '#64748b', 
                  marginTop: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {s.fields}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Print Action (CHED & DepEd line removed) */}
      <div style={{ paddingTop: 14, borderTop: '1px solid #e5e7eb', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 9999,
            background: '#f8fafc',
            border: '1px solid #d1d5db',
            color: '#111827',
            fontSize: 11.5,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'all 0.15s ease',
            cursor: 'pointer'
          }}
        >
          <Printer size={13} />
          <span>Print / Export PDF</span>
        </button>
      </div>

    </aside>
  );
}
