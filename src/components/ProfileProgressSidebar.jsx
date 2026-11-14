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
  ShieldCheck, 
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
    { num: 1, title: 'Personal Information', icon: User, fields: 'PSA Name, Birth, Address' },
    { num: 2, title: 'Family Background', icon: Users, fields: 'Parents, Income & Guardian' },
    { num: 3, title: 'Educational Background', icon: GraduationCap, fields: 'Schools, SHS Strand, GWA' },
    { num: 4, title: 'Program & Enrollment', icon: BookOpen, fields: 'HEI Name, Degree & Year' },
    { num: 5, title: 'Photo & Certification', icon: FileCheck, fields: '2x2 Photo & Signature' },
  ];

  // Calculate percentage
  const percentage = Math.round((completedSteps.length / totalSteps) * 100);
  
  // Circle geometry
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <aside className="prod-todo-rail" style={{ width: '310px', background: '#ffffff' }} aria-label="Profile Completion and Navigation">
      
      {/* Sidebar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Profile Completion
        </h2>
        <span style={{ 
          fontSize: 11, 
          fontWeight: 700, 
          color: percentage === 100 ? '#00c06d' : '#2563eb', 
          background: percentage === 100 ? '#e6f9f0' : '#eff6ff', 
          padding: '2px 8px', 
          borderRadius: 9999 
        }}>
          {percentage === 100 ? 'Complete' : 'In Progress'}
        </span>
      </div>

      {/* Circle Progress Percentage Card (Unslop: High Contrast, Tabular Nums, Concentric Inner Radii) */}
      <div style={{ 
        background: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        borderRadius: 14, 
        padding: '20px 16px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        marginBottom: 20
      }}>
        {/* SVG Circular Meter */}
        <div style={{ position: 'relative', width: 110, height: 110 }}>
          <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Ring */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke="#00c06d"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.4s ease' }}
            />
          </svg>

          {/* Centered Percentage Label */}
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
              fontWeight: 800, 
              color: '#0f172a', 
              letterSpacing: '-0.5px',
              fontVariantNumeric: 'tabular-nums' 
            }}>
              {percentage}%
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b' }}>
              {completedSteps.length} of {totalSteps} done
            </span>
          </div>
        </div>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
            Philippine Standard Biodata
          </div>
          <div style={{ fontSize: 10.5, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', marginTop: 3 }}>
            <Clock size={11} /> Saved: {lastSaved}
          </div>
        </div>
      </div>

      {/* Vertical Section Tabs */}
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: '#94a3b8' }}>
          Document Sections
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {steps.map((s) => {
          const isActive = currentStep === s.num;
          const isDone = completedSteps.includes(s.num);
          const Icon = s.icon;

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
                padding: '10px 12px',
                borderRadius: 10,
                background: isActive ? '#0f172a' : '#ffffff',
                color: isActive ? '#ffffff' : '#334155',
                border: isActive ? '1px solid #0f172a' : '1px solid #f1f5f9',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {/* Status Icon */}
              <div style={{ marginTop: 2 }}>
                {isDone ? (
                  <CheckCircle2 size={16} color={isActive ? '#00c06d' : '#00c06d'} strokeWidth={2.4} />
                ) : (
                  <Circle size={16} color={isActive ? '#94a3b8' : '#cbd5e1'} strokeWidth={2} />
                )}
              </div>

              {/* Title & Field Hint */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: 12.5, 
                  fontWeight: isActive ? 700 : 600, 
                  color: isActive ? '#ffffff' : '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>{s.num}. {s.title}</span>
                </div>
                <div style={{ 
                  fontSize: 10.5, 
                  color: isActive ? '#94a3b8' : '#64748b', 
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

      {/* Bottom Institutional Seal & Print Action */}
      <div style={{ paddingTop: 16, borderTop: '1px solid #f1f5f9', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          type="button"
          onClick={() => window.print()}
          style={{
            width: '100%',
            padding: '9px 14px',
            borderRadius: 9999,
            background: '#ffffff',
            border: '1px solid #dcdfe6',
            color: '#1e293b',
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'all 0.15s ease'
          }}
        >
          <Printer size={14} />
          <span>Print / Export PDF</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: 10.5, color: '#64748b' }}>
          <ShieldCheck size={13} color="#00c06d" />
          <span>CHED &amp; DepEd Format Compliant</span>
        </div>
      </div>

    </aside>
  );
}
