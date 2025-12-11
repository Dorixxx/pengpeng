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
export const COLOR_MAP: Record<TurtleColor, { bg: string; border: string; text: string; highlightBorder: string; highlightShadow: string; highlightBg: string }> = {
  [TurtleColor.RED]: { 
    bg: 'bg-red-500', 
    border: 'border-red-700', 
    text: 'text-red-100',
    highlightBorder: 'border-red-300',
    highlightShadow: 'shadow-red-500/50',
    highlightBg: 'bg-red-500'
  },
  [TurtleColor.BLUE]: { 
    bg: 'bg-blue-500', 
    border: 'border-blue-700', 
    text: 'text-blue-100',
    highlightBorder: 'border-blue-300',
    highlightShadow: 'shadow-blue-500/50',
    highlightBg: 'bg-blue-500'
  },
  [TurtleColor.GREEN]: { 
    bg: 'bg-green-500', 
    border: 'border-green-700', 
    text: 'text-green-100',
    highlightBorder: 'border-green-300',
    highlightShadow: 'shadow-green-500/50',
    highlightBg: 'bg-green-500'
  },
  [TurtleColor.YELLOW]: { 
    bg: 'bg-yellow-400', 
    border: 'border-yellow-600', 
    text: 'text-yellow-900',
    highlightBorder: 'border-yellow-100',
    highlightShadow: 'shadow-yellow-400/50',
    highlightBg: 'bg-yellow-400'
  },
  [TurtleColor.PURPLE]: { 
    bg: 'bg-purple-500', 
    border: 'border-purple-700', 
    text: 'text-purple-100',
    highlightBorder: 'border-purple-300',
    highlightShadow: 'shadow-purple-500/50',
    highlightBg: 'bg-purple-500'
  },
  [TurtleColor.ORANGE]: { 
    bg: 'bg-orange-500', 
    border: 'border-orange-700', 
    text: 'text-orange-100',
    highlightBorder: 'border-orange-300',
    highlightShadow: 'shadow-orange-500/50',
    highlightBg: 'bg-orange-500'
  },
  [TurtleColor.PINK]: { 
    bg: 'bg-pink-400', 
    border: 'border-pink-600', 
    text: 'text-pink-100',
    highlightBorder: 'border-pink-200',
    highlightShadow: 'shadow-pink-400/50',
    highlightBg: 'bg-pink-400'
  },
  [TurtleColor.CYAN]: { 
    bg: 'bg-cyan-400', 
    border: 'border-cyan-600', 
    text: 'text-cyan-900',
    highlightBorder: 'border-cyan-200',
    highlightShadow: 'shadow-cyan-400/50',
    highlightBg: 'bg-cyan-400'
  },
  [TurtleColor.BROWN]: { 
    bg: 'bg-amber-700', 
    border: 'border-amber-900', 
    text: 'text-amber-100',
    highlightBorder: 'border-amber-400',
    highlightShadow: 'shadow-amber-600/50',
    highlightBg: 'bg-amber-600'
  },
  [TurtleColor.WHITE]: { 
    bg: 'bg-white', 
    border: 'border-gray-300', 
    text: 'text-gray-800',
    highlightBorder: 'border-white',
    highlightShadow: 'shadow-white/50',
    highlightBg: 'bg-gray-200'
  },
};

export const COLOR_LABELS: Record<TurtleColor, string> = {
  [TurtleColor.RED]: '宝石红',
  [TurtleColor.BLUE]: '海洋蓝',
  [TurtleColor.GREEN]: '森林绿',
  [TurtleColor.YELLOW]: '柠檬黄',
  [TurtleColor.PURPLE]: '皇家紫',
  [TurtleColor.ORANGE]: '落日橙',
  [TurtleColor.PINK]: '糖果粉',
  [TurtleColor.CYAN]: '天空青',
  [TurtleColor.BROWN]: '焦糖棕',
  [TurtleColor.WHITE]: '云朵白',
};

// Pricing
export const TURTLE_PRICE = 10; // Cost to buy one
export const TURTLE_SELL_PRICE = 10; // Value when selling back (profit comes from bonuses)

// Initial state for grid
export const EMPTY_GRID = Array(9).fill(null);