
import React, { useEffect, useRef, useState } from 'react';
import { LogEntry } from '../types';
import { ChevronDown, ChevronUp, ScrollText, ArrowDown } from 'lucide-react';

interface GameLogProps {
  logs: LogEntry[];
}

export const GameLog: React.FC<GameLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [hasNewLogs, setHasNewLogs] = useState(false);

  // 监听滚动事件，判断用户是否在查看历史消息
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    
    // 如果距离底部超过 50px，认为用户向上滚动了
    const isUp = scrollHeight - scrollTop - clientHeight > 50;
    setIsUserScrolledUp(isUp);
    
    // 如果回到底部，清除新消息提示
    if (!isUp) {
        setHasNewLogs(false);
    }
  };

  // 当日志更新时的自动滚动逻辑
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      if (!isUserScrolledUp) {
        // 如果用户没在看历史，自动滚动到底部
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      } else {
        // 如果用户在看历史，标记有新消息
        setHasNewLogs(true);
      }
    }
  }, [logs, isOpen, isUserScrolledUp]);

  // 手动滚动到底部
  const scrollToBottom = () => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        setIsUserScrolledUp(false);
        setHasNewLogs(false);
    }
  };

  return (
    <div className={`
      bg-black/60 rounded-xl border border-gray-800 overflow-hidden flex flex-col relative transition-all duration-300 shadow-xl backdrop-blur-md
      ${isOpen ? 'h-64 md:h-80' : 'h-10'}
    `}>
      {/* Header / Toggle Bar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 flex items-center justify-between px-3 bg-gray-900/90 hover:bg-gray-800/90 transition-colors z-20 border-b border-gray-700/50 shrink-0"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
           <ScrollText className="w-3 h-3 text-indigo-400" /> 
           直播记录 
           <span className="bg-gray-800 px-1.5 rounded text-[10px] text-gray-500">{logs.length}</span>
        </div>
        <div className="flex items-center gap-2">
            {/* 收起/展开提示 */}
            <span className="text-[10px] text-gray-500 font-normal">
                {isOpen ? '点击收起' : '点击展开'}
            </span>
            {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Content Area */}
      <div className={`flex-1 relative min-h-0 ${!isOpen ? 'hidden' : 'block'}`}>
          {/* Top Fade Mask */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
          
          <div 
            className="h-full overflow-y-auto space-y-1.5 scrollbar-hide p-3 pb-8" 
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {logs.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-600 text-xs italic">
                等待直播开始...
              </div>
            )}
            {logs.map((log) => (
              <div 
                key={log.id} 
                className={`
                  text-xs px-2 py-1.5 rounded animate-pop origin-left leading-relaxed break-words
                  ${log.type === 'bonus' ? 'bg-yellow-900/30 text-yellow-200 border border-yellow-500/20' : ''}
                  ${log.type === 'wish' ? 'bg-pink-900/30 text-pink-200 border border-pink-500/20' : ''}
                  ${log.type === 'match' ? 'bg-indigo-900/30 text-indigo-200 border border-indigo-500/20' : ''}
                  ${log.type === 'info' ? 'text-gray-400 hover:bg-gray-800/50' : ''}
                `}
              >
                {log.message}
              </div>
            ))}
          </div>

          {/* New Message Indicator / Scroll to Bottom Button */}
          {isUserScrolledUp && (
              <div className="absolute bottom-3 right-3 z-20">
                  <button 
                    onClick={scrollToBottom}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg text-xs font-bold transition-all
                        ${hasNewLogs ? 'bg-indigo-600 text-white animate-bounce' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                    `}
                  >
                    {hasNewLogs ? '有新消息' : '回到底部'}
                    <ArrowDown className="w-3 h-3" />
                  </button>
              </div>
          )}

          {/* Bottom Fade Mask */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/90 to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};
