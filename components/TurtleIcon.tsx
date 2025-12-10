import React from 'react';
import { TurtleColor } from '../types';
import { COLOR_MAP } from '../constants';

interface TurtleIconProps {
  color: TurtleColor;
  className?: string;
}

export const TurtleIcon: React.FC<TurtleIconProps> = ({ color, className = "" }) => {
  const styles = COLOR_MAP[color];
  
  // Custom mapping for SVG fill colors based on tailwind classes isn't direct, 
  // so we use hex/rgba approximations or logic to map Tailwind back to styles.
  // For simplicity in this SVG, we will use inline styles generated from the props or a simple map.
  
  const getFillColor = (c: TurtleColor) => {
    switch (c) {
      case TurtleColor.RED: return '#ef4444';
      case TurtleColor.BLUE: return '#3b82f6';
      case TurtleColor.GREEN: return '#22c55e';
      case TurtleColor.YELLOW: return '#facc15';
      case TurtleColor.PURPLE: return '#a855f7';
      case TurtleColor.ORANGE: return '#f97316';
      case TurtleColor.PINK: return '#f472b6';
      case TurtleColor.CYAN: return '#22d3ee';
      case TurtleColor.BROWN: return '#b45309'; // Amber-700
      case TurtleColor.WHITE: return '#ffffff';
      default: return '#9ca3af';
    }
  };

  const getStrokeColor = (c: TurtleColor) => {
      // Darker version
      return c === TurtleColor.WHITE ? '#d1d5db' : 'rgba(0,0,0,0.2)';
  }

  const fill = getFillColor(color);
  const stroke = getStrokeColor(color);

  return (
    <div className={`relative ${className} animate-pop`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Legs */}
        <ellipse cx="20" cy="30" rx="10" ry="12" fill={fill} stroke={stroke} strokeWidth="2" transform="rotate(-30 20 30)" />
        <ellipse cx="80" cy="30" rx="10" ry="12" fill={fill} stroke={stroke} strokeWidth="2" transform="rotate(30 80 30)" />
        <ellipse cx="20" cy="80" rx="10" ry="12" fill={fill} stroke={stroke} strokeWidth="2" transform="rotate(-150 20 80)" />
        <ellipse cx="80" cy="80" rx="10" ry="12" fill={fill} stroke={stroke} strokeWidth="2" transform="rotate(150 80 80)" />
        
        {/* Tail */}
        <path d="M50 95L45 85H55L50 95Z" fill={fill} stroke={stroke} strokeWidth="2" />

        {/* Head */}
        <circle cx="50" cy="20" r="14" fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx="45" cy="18" r="2" fill="black" />
        <circle cx="55" cy="18" r="2" fill="black" />
        
        {/* Shell */}
        <path
          d="M50 30 C 20 30, 15 60, 20 80 C 25 90, 75 90, 80 80 C 85 60, 80 30, 50 30 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="3"
        />
        {/* Shell Pattern */}
        <path d="M50 30 V 88" stroke={stroke} strokeWidth="2" strokeOpacity="0.3" strokeDasharray="4 2" />
        <path d="M20 55 H 80" stroke={stroke} strokeWidth="2" strokeOpacity="0.3" strokeDasharray="4 2" />
      </svg>
    </div>
  );
};