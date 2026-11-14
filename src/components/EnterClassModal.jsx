import React, { useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, ScreenShare, MessageSquare, Hand, PhoneOff, Users } from 'lucide-react';

export default function EnterClassModal({ isOpen, onClose, lesson }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="lesson-modal-title">
      <div className="classroom-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ borderBottomColor: '#262c36', background: '#11141a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ 
              width: 10, 
              height: 10, 
              borderRadius: '50%', 
              background: '#00c06d', 
              display: 'inline-block' 
            }} />
            <h2 id="lesson-modal-title" style={{ color: '#ffffff', fontSize: '15px', fontWeight: 600 }}>
              {lesson?.title || '111426 1400 Lucy'}
            </h2>
            <span style={{ fontSize: '12px', color: '#959ba7', background: '#1f242d', padding: '2px 8px', borderRadius: '4px' }}>
              Live Class
            </span>
          </div>
          <button 
            type="button" 
            style={{ color: '#959ba7', background: 'transparent' }} 
            onClick={onClose}
            aria-label="Close classroom preview"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video / Blackboard Screen */}
        <div className="classroom-screen">
          <div style={{
            position: 'absolute',
            inset: 20,
            background: '#161920',
            borderRadius: 12,
            border: '1px solid #2b303c',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center'
          }}>
            <div style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              background: '#232936',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00c06d',
              marginBottom: 14,
              fontSize: 22,
              fontWeight: 700
            }}>
              L
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: 6 }}>
              Lucy's Interactive Blackboard
            </h3>
            <p style={{ fontSize: '13px', color: '#949ba8', maxWidth: 360 }}>
              Connecting audio and video stream... You are now participating as <strong style={{ color: '#ffffff' }}>006a.user</strong>
            </p>

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <span style={{ fontSize: '12px', background: '#1f2533', padding: '4px 10px', borderRadius: 20, color: '#00c06d' }}>
                ● Present: 1/2
              </span>
              <span style={{ fontSize: '12px', background: '#1f2533', padding: '4px 10px', borderRadius: 20, color: '#949ba8' }}>
                Duration: 40 min
              </span>
            </div>
          </div>
        </div>

        {/* Classroom Controls Toolbar */}
        <div className="classroom-toolbar">
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setMicOn(!micOn)}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: micOn ? '#232936' : '#ff4d4f',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>

            <button
              type="button"
              onClick={() => setCamOn(!camOn)}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: camOn ? '#232936' : '#ff4d4f',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={camOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {camOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>

            <button
              type="button"
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#232936',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Share Screen"
            >
              <ScreenShare size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setHandRaised(!handRaised)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                background: handRaised ? '#e6f9f0' : '#232936',
                color: handRaised ? '#00c06d' : '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Hand size={14} />
              <span>{handRaised ? 'Hand Raised' : 'Raise Hand'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                background: '#ff4d4f',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <PhoneOff size={14} />
              <span>Leave</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
