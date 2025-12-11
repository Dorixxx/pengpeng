import { TurtleColor } from './types';

export const COLORS: TurtleColor[] = [
  TurtleColor.RED,
  TurtleColor.BLUE,
  TurtleColor.GREEN,
  TurtleColor.YELLOW,
  TurtleColor.PURPLE,
  TurtleColor.ORANGE,
  TurtleColor.PINK,
  TurtleColor.CYAN,
  TurtleColor.BROWN,
  TurtleColor.WHITE
];

// Highlight now stores separate color classes to allow partial borders
// Colors optimized for visibility on dark backgrounds (#1a1a1a) and distinctness
export const COLOR_MAP: Record<TurtleColor, { bg: string; border: string; text: string; highlightBorder: string; highlightShadow: string; highlightBg: string }> = {
  [TurtleColor.RED]: { 
    bg: 'bg-red-500', 
    border: 'border-red-700', 
    text: 'text-red-100',
    highlightBorder: 'border-red-400',
    highlightShadow: 'shadow-red-500/50',
    highlightBg: 'bg-red-500'
  },
  [TurtleColor.BLUE]: { 
    bg: 'bg-blue-500', 
    border: 'border-blue-700', 
    text: 'text-blue-100',
    highlightBorder: 'border-blue-400',
    highlightShadow: 'shadow-blue-500/50',
    highlightBg: 'bg-blue-500'
  },
  [TurtleColor.GREEN]: { 
    bg: 'bg-green-500', 
    border: 'border-green-700', 
    text: 'text-green-100',
    highlightBorder: 'border-green-400',
    highlightShadow: 'shadow-green-500/50',
    highlightBg: 'bg-green-500'
  },
  [TurtleColor.YELLOW]: { 
    bg: 'bg-yellow-500', 
    border: 'border-yellow-700', 
    text: 'text-yellow-100',
    highlightBorder: 'border-yellow-300',
    highlightShadow: 'shadow-yellow-500/50',
    highlightBg: 'bg-yellow-500'
  },
  [TurtleColor.PURPLE]: { 
    bg: 'bg-violet-500', 
    border: 'border-violet-700', 
    text: 'text-violet-100',
    highlightBorder: 'border-violet-400',
    highlightShadow: 'shadow-violet-500/50',
    highlightBg: 'bg-violet-500'
  },
  [TurtleColor.ORANGE]: { 
    bg: 'bg-orange-500', 
    border: 'border-orange-700', 
    text: 'text-orange-100',
    highlightBorder: 'border-orange-400',
    highlightShadow: 'shadow-orange-500/50',
    highlightBg: 'bg-orange-500'
  },
  [TurtleColor.PINK]: { 
    bg: 'bg-pink-500', 
    border: 'border-pink-700', 
    text: 'text-pink-100',
    highlightBorder: 'border-pink-400',
    highlightShadow: 'shadow-pink-500/50',
    highlightBg: 'bg-pink-500'
  },
  [TurtleColor.CYAN]: { 
    bg: 'bg-cyan-500', 
    border: 'border-cyan-700', 
    text: 'text-cyan-100',
    highlightBorder: 'border-cyan-400',
    highlightShadow: 'shadow-cyan-500/50',
    highlightBg: 'bg-cyan-500'
  },
  [TurtleColor.BROWN]: { 
    bg: 'bg-amber-600', 
    border: 'border-amber-800', 
    text: 'text-amber-100',
    highlightBorder: 'border-amber-400',
    highlightShadow: 'shadow-amber-600/50',
    highlightBg: 'bg-amber-600'
  },
  [TurtleColor.WHITE]: { 
    bg: 'bg-gray-100', 
    border: 'border-gray-400', 
    text: 'text-gray-900',
    highlightBorder: 'border-white',
    highlightShadow: 'shadow-white/50',
    highlightBg: 'bg-gray-200'
  },
};

export const COLOR_LABELS: Record<TurtleColor, string> = {
  [TurtleColor.RED]: '宝石红',
  [TurtleColor.BLUE]: '海洋蓝',
  [TurtleColor.GREEN]: '森林绿',
  [TurtleColor.YELLOW]: '流光金',
  [TurtleColor.PURPLE]: '紫罗兰',
  [TurtleColor.ORANGE]: '落日橙',
  [TurtleColor.PINK]: '火龙果',
  [TurtleColor.CYAN]: '孔雀青',
  [TurtleColor.BROWN]: '焦糖棕',
  [TurtleColor.WHITE]: '珍珠白',
};

// Pricing
export const TURTLE_PRICE = 10; // Cost to buy one
export const TURTLE_SELL_PRICE = 10; // Value when selling back (profit comes from bonuses)

// Initial state for grid
export const EMPTY_GRID = Array(9).fill(null);