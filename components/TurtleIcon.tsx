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
  // Updated to match the "Vibrant & Distinct" palette in constants.ts
  
  const getFillColor = (c: TurtleColor) => {
    switch (c) {
      case TurtleColor.RED: return '#ef4444';    // Red-500
      case TurtleColor.BLUE: return '#3b82f6';   // Blue-500
      case TurtleColor.GREEN: return '#22c55e';  // Green-500
      case TurtleColor.YELLOW: return '#eab308'; // Yellow-500 (Golden, distinct from White)
      case TurtleColor.PURPLE: return '#8b5cf6'; // Violet-500 (Distinct from Pink)
      case TurtleColor.ORANGE: return '#f97316'; // Orange-500
      case TurtleColor.PINK: return '#ec4899';   // Pink-500 (Hot Pink)
      case TurtleColor.CYAN: return '#06b6d4';   // Cyan-500 (Teal-ish, distinct from Blue)
      case TurtleColor.BROWN: return '#d97706';  // Amber-600 (Caramel/Gold-Brown, distinct from Orange)
      case TurtleColor.WHITE: return '#f3f4f6';  // Gray-100 (Pearl White)
      default: return '#9ca3af';
    }
  };

  const getStrokeColor = (c: TurtleColor) => {
      // For white/light turtles, use a darker stroke to define features against the body
      if (c === TurtleColor.WHITE) return '#4b5563'; // Gray-600
      if (c === TurtleColor.YELLOW) return '#854d0e'; // Yellow-800
      // For others, use a subtle dark transparent stroke
      return 'rgba(0,0,0,0.3)';
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
        <path d="M50 30 V 88" stroke={stroke} strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 2" />
        <path d="M20 55 H 80" stroke={stroke} strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 2" />
      </svg>
    </div>
  );
};