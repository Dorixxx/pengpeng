import React from 'react';
import { GridSlot, TurtleColor } from '../types';
import { TurtleIcon } from './TurtleIcon';
import { COLOR_MAP } from '../constants';

interface GridProps {
  grid: GridSlot[];
  highlightedIndices?: number[];
  speed?: number;
}

export const Grid: React.FC<GridProps> = ({ grid, highlightedIndices = [], speed = 1 }) => {
  
  const getCellData = (index: number) => {
      const slot = grid[index];
      const isHighlighted = highlightedIndices.includes(index);
      return { slot, isHighlighted, color: slot?.color };
  };

  // Base duration for the flash-twice animation is 1.2s as defined in CSS.
  // We adjust it based on the game speed.
  const animationDuration = `${1.2 / speed}s`;

  return (
    <div className="w-full max-w-xl aspect-square grid grid-cols-3 grid-rows-3 gap-1.5 md:gap-3 p-1.5 md:p-3 bg-gray-800/50 rounded-xl border border-gray-700 shadow-2xl backdrop-blur-sm mx-auto">
      {grid.map((slot, index) => {
        const { isHighlighted, color } = getCellData(index);
        
        // Calculate neighbors for border merging
        const row = Math.floor(index / 3);
        const col = index % 3;

        const checkNeighbor = (r: number, c: number) => {
            if (r < 0 || r > 2 || c < 0 || c > 2) return false;
            const neighborIdx = r * 3 + c;
            const neighbor = getCellData(neighborIdx);
            // Connect if neighbor is highlighted AND same color
            return neighbor.isHighlighted && neighbor.color === color;
        };

        const connectTop = isHighlighted && checkNeighbor(row - 1, col);
        const connectBottom = isHighlighted && checkNeighbor(row + 1, col);
        const connectLeft = isHighlighted && checkNeighbor(row, col - 1);
        const connectRight = isHighlighted && checkNeighbor(row, col + 1);

        const highlightConfig = color ? COLOR_MAP[color] : null;

        return (
          <div
            key={index}
            className={`
              relative flex items-center justify-center rounded-lg border-2 
              w-full h-full min-w-0 min-h-0
              ${isHighlighted 
                ? 'z-10 border-transparent bg-gray-700/50' 
                : (slot ? 'bg-gray-700/50 border-gray-600 border-solid overflow-hidden' : 'bg-gray-800 border-gray-700 border-dashed overflow-hidden')
              }
            `}
          >
             {/* Highlight Overlay - Smart Merging */}
             {isHighlighted && highlightConfig && (
                <div 
                    className={`
                        absolute animate-flash-twice z-[-10]
                        border-[5px] md:border-[6px] ${highlightConfig.highlightBorder}
                        ${highlightConfig.highlightShadow} shadow-[0_0_15px_rgba(0,0,0,0.3)]
                    `}
                    style={{
                        animationDuration: animationDuration,
                        // Expand into gap if connected (gap-1.5 is 6px, half 3px; gap-3 is 12px, half 6px)
                        // We use a safe overlap (4px mobile, 8px desktop) to visually merge.
                        top: connectTop ? '-8px' : '0',
                        bottom: connectBottom ? '-8px' : '0',
                        left: connectLeft ? '-8px' : '0',
                        right: connectRight ? '-8px' : '0',
                        
                        // Remove borders on connected sides
                        borderTopWidth: connectTop ? '0' : undefined,
                        borderBottomWidth: connectBottom ? '0' : undefined,
                        borderLeftWidth: connectLeft ? '0' : undefined,
                        borderRightWidth: connectRight ? '0' : undefined,

                        // Remove rounding on connected corners
                        borderTopLeftRadius: (connectTop || connectLeft) ? '0' : '0.75rem',
                        borderTopRightRadius: (connectTop || connectRight) ? '0' : '0.75rem',
                        borderBottomLeftRadius: (connectBottom || connectLeft) ? '0' : '0.75rem',
                        borderBottomRightRadius: (connectBottom || connectRight) ? '0' : '0.75rem',
                    }}
                ></div>
             )}

             <span className={`absolute top-1 left-1.5 text-[10px] md:text-xs font-bold z-20 ${isHighlighted ? 'text-white/90 drop-shadow-md' : 'text-gray-600'}`}>{index + 1}</span>
            {slot ? (
              <div className={`w-full h-full flex items-center justify-center z-10`}>
                  <TurtleIcon color={slot.color} className="w-[55%] h-[55%]" />
              </div>
            ) : (
               <div className="w-2 h-2 rounded-full bg-gray-700/30" />
            )}
          </div>
        );
      })}
    </div>
  );
};