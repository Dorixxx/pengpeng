import React from 'react';
import { GridSlot } from '../types';
import { TurtleIcon } from './TurtleIcon';

interface GridProps {
  grid: GridSlot[];
}

export const Grid: React.FC<GridProps> = ({ grid }) => {
  return (
    <div className="w-full max-w-xl aspect-square grid grid-cols-3 grid-rows-3 gap-1.5 md:gap-3 p-1.5 md:p-3 bg-gray-800/50 rounded-xl border border-gray-700 shadow-2xl backdrop-blur-sm mx-auto">
      {grid.map((slot, index) => (
        <div
          key={index}
          className={`
            relative flex items-center justify-center rounded-lg border-2 
            transition-colors duration-300 overflow-hidden w-full h-full min-w-0 min-h-0
            ${slot ? 'bg-gray-700/50 border-gray-600 border-solid' : 'bg-gray-800 border-gray-700 border-dashed'}
          `}
        >
           <span className="absolute top-1 left-1.5 text-[10px] md:text-xs text-gray-600 font-bold z-10">{index + 1}</span>
          {slot ? (
            <div className="w-full h-full flex items-center justify-center">
                <TurtleIcon color={slot.color} className="w-[55%] h-[55%]" />
            </div>
          ) : (
             <div className="w-2 h-2 rounded-full bg-gray-700/30" />
          )}
        </div>
      ))}
    </div>
  );
};
