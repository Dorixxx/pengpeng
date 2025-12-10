import React, { useEffect, useState } from 'react';
import { SettlementResult } from '../types';
import { Sparkles, Trophy, CheckCircle2, PartyPopper } from 'lucide-react';

interface SettlementModalProps {
  result: SettlementResult | null;
  visible: boolean;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({ result, visible }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show && !visible) return null;
  if (!result) return null;

  const hasBonus = result.bonusPacks > 0;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${visible ? 'bg-black/70 backdrop-blur-sm opacity-100' : 'bg-black/0 opacity-0 pointer-events-none'}`}
    >
      <div 
        className={`bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 border-2 border-indigo-400/50 rounded-2xl shadow-2xl p-8 max-w-sm w-full transform transition-all duration-500 ${visible ? 'scale-100 translate-y-0' : 'scale-50 translate-y-10'}`}
      >
        <div className="text-center space-y-4">
          
          {/* Header Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40 animate-bounce">
             {result.isFullHouse ? (
                 <PartyPopper className="w-10 h-10 text-white" />
             ) : hasBonus ? (
                 <Trophy className="w-10 h-10 text-white" />
             ) : (
                 <CheckCircle2 className="w-10 h-10 text-white" />
             )}
          </div>

          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">
            {result.isFullHouse ? '全家福！' : result.isClearance ? '清台奖励！' : hasBonus ? '恭喜中奖！' : '本轮结算'}
          </h2>

          <div className="space-y-2 py-4">
            {result.matches.length > 0 ? (
                result.matches.map((m, i) => (
                    <div key={i} className="text-indigo-200 font-medium text-lg flex items-center justify-center gap-2 animate-pop" style={{animationDelay: `${i * 0.1}s`}}>
                        <Sparkles className="w-4 h-4 text-yellow-400" /> {m}
                    </div>
                ))
            ) : (
                <div className="text-gray-400 italic">本轮无对对碰组合，全部打包！</div>
            )}
          </div>

          {hasBonus && (
             <div className="bg-white/10 rounded-xl p-4 border border-white/10 animate-pulse">
                <div className="text-sm text-indigo-300 uppercase tracking-wider font-bold">获得奖励</div>
                <div className="text-4xl font-black text-yellow-400 drop-shadow-sm">+{result.bonusPacks} <span className="text-xl">包</span></div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};