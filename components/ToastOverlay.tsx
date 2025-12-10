
import React from 'react';
import { ToastItem } from '../types';
import { Sparkles, Gift, PartyPopper, Info } from 'lucide-react';

interface ToastOverlayProps {
  toasts: ToastItem[];
}

export const ToastOverlay: React.FC<ToastOverlayProps> = ({ toasts }) => {
  return (
    <div className="fixed inset-x-0 top-2 md:top-6 flex flex-col items-center md:items-end md:right-6 md:left-auto pointer-events-none z-[100] gap-1.5 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            animate-pop px-3 py-1 rounded-full shadow-lg backdrop-blur-sm border flex items-center gap-1.5 font-bold text-xs min-w-fit transition-all
            ${toast.type === 'bonus' ? 'bg-yellow-900/80 border-yellow-400/40 text-yellow-300' : ''}
            ${toast.type === 'match' ? 'bg-indigo-900/80 border-indigo-400/40 text-indigo-200' : ''}
            ${toast.type === 'wish' ? 'bg-pink-900/80 border-pink-400/40 text-pink-200' : ''}
            ${toast.type === 'info' ? 'bg-gray-800/80 border-gray-500/40 text-gray-300' : ''}
          `}
        >
          {toast.type === 'bonus' && <Gift className="w-3 h-3 animate-bounce text-yellow-400" />}
          {toast.type === 'match' && <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />}
          {toast.type === 'wish' && <PartyPopper className="w-3 h-3 text-pink-400 animate-pulse" />}
          {toast.type === 'info' && <Info className="w-3 h-3 text-gray-400" />}
          <span className="drop-shadow-md whitespace-nowrap leading-none pt-0.5">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
