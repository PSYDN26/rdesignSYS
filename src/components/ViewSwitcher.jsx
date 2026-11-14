import React from 'react';
import { Monitor, Smartphone, Sparkles, Layers } from 'lucide-react';

export default function ViewSwitcher({ mode, setMode }) {
  return (
    <div className="view-switcher-bar" role="navigation" aria-label="Boilerplate View Switcher">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 8, paddingRight: 4 }}>
        <Sparkles size={14} color="#00c06d" />
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#f3f4f6', letterSpacing: '-0.2px' }}>
          TEMPLATE MODE:
        </span>
      </div>

      <button
        type="button"
        className={`switcher-btn ${mode === 'desktop' ? 'active' : ''}`}
        onClick={() => setMode('desktop')}
        title="View Desktop Layout (image.png)"
      >
        <Monitor size={14} />
        <span>Desktop</span>
      </button>

      <button
        type="button"
        className={`switcher-btn ${mode === 'mobile' ? 'active' : ''}`}
        onClick={() => setMode('mobile')}
        title="View Mobile Layout (image_2.png)"
      >
        <Smartphone size={14} />
        <span>Mobile</span>
      </button>

      <div className="switcher-divider" />

      <button
        type="button"
        className={`switcher-btn ${mode === 'responsive' ? 'active' : ''}`}
        onClick={() => setMode('responsive')}
        title="Fluid Responsive Mode (Auto-adapts to your window width)"
      >
        <Layers size={14} />
        <span>Responsive</span>
      </button>
    </div>
  );
}
