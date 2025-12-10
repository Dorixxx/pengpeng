
import React, { useEffect, useRef, useState } from 'react';
import { LogEntry } from '../types';
import { ChevronDown, ChevronUp, ScrollText } from 'lucide-react';

interface GameLogProps {
  logs: LogEntry[];
}

export const GameLog: React.FC<GameLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  return (
    <div className={`
      bg-black/40 rounded-xl border border-gray-800 overflow-hidden flex flex-col relative transition-all duration-300
      ${isOpen ? 'h-48 md:h-64' : 'h-10'}
    `}>
      {/* Header / Toggle Bar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 flex items-center justify-between px-3 bg-gray-900/80 hover:bg-gray-800/80 transition-colors z-20 border-b border-gray-800/50"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
           <ScrollText className="w-3 h-3" /> 直播记录 ({logs.length})
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronUp className="w-4 h-4 text-gray-500" />}
      </button>

      {/* Content */}
      <div className={`flex-1 relative ${!isOpen ? 'hidden' : 'block'}`}>
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-900/90 to-transparent z-10 pointer-events-none" />
          <div className="h-full overflow-y-auto space-y-1.5 scrollbar-hide p-3" ref={scrollRef}>
            {logs.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-600 text-xs italic">
                等待直播开始...
              </div>
            )}
            {logs.map((log) => (
              <div 
                key={log.id} 
                className={`
                  text-xs px-2 py-1.5 rounded animate-pop origin-left
                  ${log.type === 'bonus' ? 'bg-yellow-500/10 text-yellow-200 border border-yellow-500/20' : ''}
                  ${log.type === 'wish' ? 'bg-pink-500/10 text-pink-200 border border-pink-500/20' : ''}
                  ${log.type === 'match' ? 'bg-indigo-500/10 text-indigo-200 border border-indigo-500/20' : ''}
                  ${log.type === 'info' ? 'text-gray-400' : ''}
                `}
              >
                {log.message}
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-900/90 to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};
