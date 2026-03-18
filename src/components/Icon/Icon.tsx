import React from 'react';

export type IconName = 'profile' | 'tools' | 'dashboard' | 'blueprint' | 'shield' | 'lock' | 'cpu' | 'status' | 'arrow-right' | 'log' | 'diag' | 'close' | 'menu';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'profile':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
          <circle cx="8" cy="5.5" r="2.5" />
          <path d="M2.5 13.5C2.5 11 5 9 8 9s5.5 2 5.5 4.5" />
        </svg>
      );
    case 'tools':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
          <path d="M10.5 2.5a3 3 0 11-1 5.8L5 12.5a1.5 1.5 0 01-2-2l4.2-4.5A3 3 0 0110.5 2.5z" />
        </svg>
      );
    case 'dashboard':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
          <path d="M1 11 Q4 5 8 5 Q12 5 15 11" />
          <line x1="1" y1="11" x2="15" y2="11" />
          <line x1="5" y1="11" x2="5" y2="13" />
          <line x1="11" y1="11" x2="11" y2="13" />
          <line x1="1" y1="13" x2="15" y2="13" />
        </svg>
      );
    case 'blueprint':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
          <rect x="2" y="2" width="12" height="12" rx="1.5" />
          <line x1="2" y1="6" x2="14" y2="6" />
          <line x1="8" y1="6" x2="8" y2="14" />
          <line x1="5" y1="2" x2="5" y2="6" />
          <line x1="11" y1="6" x2="11" y2="10" />
          <line x1="8" y1="10" x2="14" y2="10" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 16 16" {...props}>
          <path d="M8 1.5a6.5 6.5 0 100 13A6.5 6.5 0 008 1.5z" />
          <path d="M8 4.5v3.5l2.5 2.5" />
        </svg>
      );
    case 'lock':
      return (
        <svg viewBox="0 0 16 16" {...props}>
          <path d="M8 1.5c-3.5 0-5 2-5 4 0 1.5.8 2.8 2 3.5V11h6V9c1.2-.7 2-2 2-3.5 0-2-1.5-4-5-4z" />
          <path d="M6 11v2a2 2 0 004 0v-2" />
        </svg>
      );
    case 'cpu':
      return (
        <svg viewBox="0 0 16 16" {...props}>
          <path d="M2 12L5 7l3 3 3-5 3 5" />
        </svg>
      );
    case 'status':
      return (
        <svg viewBox="0 0 16 16" {...props}>
          <circle cx="8" cy="8" r="2.5" />
          <path d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.5 3.5l.85.85M11.65 11.65l.85.85M3.5 12.5l.85-.85M11.65 4.35l.85-.85" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg viewBox="0 0 12 12" {...props}>
          <path d="M2 6h8M6 2l4 4-4 4" />
        </svg>
      );
    case 'log':
      return (
        <svg viewBox="0 0 14 14" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
          <rect x="1" y="2" width="12" height="10" rx="1.5" />
          <path d="M3.5 5.5l2 2-2 2M7.5 9.5h3" />
        </svg>
      );
    case 'diag':
      return (
        <svg viewBox="0 0 14 14" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
          <path d="M1 10L4 6l3 3 3-5 3 4" />
        </svg>
      );
    case 'close':
      return (
        <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
          <path d="M3.5 9h11M9.5 4l5 5-5 5" />
        </svg>
      );
    case 'menu':
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
          <path d="M3 8h10M8 3l5 5-5 5" />
        </svg>
      );
    default:
      return null;
  }
};
