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

export const COLOR_MAP: Record<TurtleColor, { bg: string; border: string; text: string; highlight: string }> = {
  [TurtleColor.RED]: { 
    bg: 'bg-red-500', 
    border: 'border-red-700', 
    text: 'text-red-100',
    highlight: 'ring-red-500 border-red-300 shadow-[0_0_35px_rgba(239,68,68,1)]'
  },
  [TurtleColor.BLUE]: { 
    bg: 'bg-blue-500', 
    border: 'border-blue-700', 
    text: 'text-blue-100',
    highlight: 'ring-blue-500 border-blue-300 shadow-[0_0_35px_rgba(59,130,246,1)]'
  },
  [TurtleColor.GREEN]: { 
    bg: 'bg-green-500', 
    border: 'border-green-700', 
    text: 'text-green-100',
    highlight: 'ring-green-500 border-green-300 shadow-[0_0_35px_rgba(34,197,94,1)]'
  },
  [TurtleColor.YELLOW]: { 
    bg: 'bg-yellow-400', 
    border: 'border-yellow-600', 
    text: 'text-yellow-900',
    highlight: 'ring-yellow-400 border-yellow-200 shadow-[0_0_35px_rgba(250,204,21,1)]'
  },
  [TurtleColor.PURPLE]: { 
    bg: 'bg-purple-500', 
    border: 'border-purple-700', 
    text: 'text-purple-100',
    highlight: 'ring-purple-500 border-purple-300 shadow-[0_0_35px_rgba(168,85,247,1)]'
  },
  [TurtleColor.ORANGE]: { 
    bg: 'bg-orange-500', 
    border: 'border-orange-700', 
    text: 'text-orange-100',
    highlight: 'ring-orange-500 border-orange-300 shadow-[0_0_35px_rgba(249,115,22,1)]'
  },
  [TurtleColor.PINK]: { 
    bg: 'bg-pink-400', 
    border: 'border-pink-600', 
    text: 'text-pink-100',
    highlight: 'ring-pink-400 border-pink-200 shadow-[0_0_35px_rgba(244,114,182,1)]'
  },
  [TurtleColor.CYAN]: { 
    bg: 'bg-cyan-400', 
    border: 'border-cyan-600', 
    text: 'text-cyan-900',
    highlight: 'ring-cyan-400 border-cyan-200 shadow-[0_0_35px_rgba(34,211,238,1)]'
  },
  [TurtleColor.BROWN]: { 
    bg: 'bg-amber-700', 
    border: 'border-amber-900', 
    text: 'text-amber-100',
    highlight: 'ring-amber-600 border-amber-400 shadow-[0_0_35px_rgba(217,119,6,1)]'
  },
  [TurtleColor.WHITE]: { 
    bg: 'bg-white', 
    border: 'border-gray-300', 
    text: 'text-gray-800',
    highlight: 'ring-white border-white shadow-[0_0_35px_rgba(255,255,255,1)]'
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