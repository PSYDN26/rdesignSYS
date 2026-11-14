import React from 'react';
import logoSvg from '../assets/scmbt_logo.svg';

export default function BrandLogo({ className = 'scmbt-brand-logo', style = {} }) {
  return (
    <img 
      src={logoSvg} 
      alt="SCMBT Maritime Training Logo" 
      className={className} 
      style={{ display: 'block', height: '42px', width: 'auto', ...style }} 
    />
  );
}
