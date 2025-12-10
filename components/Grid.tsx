import React from 'react';
import { GridSlot } from '../types';
import { TurtleIcon } from './TurtleIcon';
import { COLOR_MAP } from '../constants';

interface GridProps {
  grid: GridSlot[];
  highlightedIndices?: number[];
}

export const Grid: React.FC<GridProps> = ({ grid, highlightedIndices = [] }) => {
  return (
    <div className="w-full max-w-xl aspect-square grid grid-cols-3 grid-rows-3 gap-1.5 md:gap-3 p-1.5 md:p-3 bg-gray-800/50 rounded-xl border border-gray-700 shadow-2xl backdrop-blur-sm mx-auto">
      {grid.map((slot, index) => {
        const isHighlighted = highlightedIndices.includes(index);
        
        // Dynamic styles based on the turtle color in the slot
        const highlightStyles = slot ? COLOR_MAP[slot.color]?.highlight : '';

        return (
          <div
            key={index}
            className={`
              relative flex items-center justify-center rounded-lg border-2 
              w-full h-full min-w-0 min-h-0 transition-transform duration-200
              ${isHighlighted 
                ? 'z-10 scale-[1.05] border-transparent' 
                : (slot ? 'bg-gray-700/50 border-gray-600 border-solid overflow-hidden' : 'bg-gray-800 border-gray-700 border-dashed overflow-hidden')
              }
            `}
          >
             {/* Highlight Background/Border Overlay - Flashes independently */}
             {isHighlighted && (
                <div className={`absolute -inset-1.5 bg-gray-700/80 rounded-xl border-[6px] ring-4 ring-offset-0 ${highlightStyles} animate-flash -z-10`}></div>
             )}

             <span className={`absolute top-1 left-1.5 text-[10px] md:text-xs font-bold z-20 ${isHighlighted ? 'text-white drop-shadow-md' : 'text-gray-600'}`}>{index + 1}</span>
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