import React from 'react';
import { TurtleColor } from '../types';
import { COLORS, COLOR_LABELS, COLOR_MAP, TURTLE_PRICE, TURTLE_SELL_PRICE } from '../constants';
import { TurtleIcon } from './TurtleIcon';
import { Sparkles, Play, Coins, Banknote, ShoppingBag } from 'lucide-react';

interface ControlsProps {
  wishColor: TurtleColor | null;
  setWishColor: (c: TurtleColor) => void;
  status: 'IDLE' | 'PLAYING' | 'SETTLING' | 'FINISHED';
  onStart: (count: number) => void;
  onSellAndReset: () => void;
  buyQuantity: number;
  setBuyQuantity: (n: number) => void;
  balance: number;
  inventoryCount: number;
}

export const Controls: React.FC<ControlsProps> = ({
  wishColor,
  setWishColor,
  status,
  onStart,
  onSellAndReset,
  buyQuantity,
  setBuyQuantity,
  balance,
  inventoryCount
}) => {
  
  const isPlaying = status === 'PLAYING' || status === 'SETTLING';
  const totalCost = buyQuantity * TURTLE_PRICE;
  const canAfford = balance >= totalCost;
  const potentialSellValue = inventoryCount * TURTLE_SELL_PRICE;

  const handleMaxBuy = () => {
    const max = Math.floor(balance / TURTLE_PRICE);
    setBuyQuantity(max > 0 ? max : 1);
  };

  const adjustQuantity = (delta: number) => {
      const newVal = buyQuantity + delta;
      if (newVal >= 1) setBuyQuantity(newVal);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto">
      
      {/* Wallet / Balance Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-xl p-4 border border-emerald-700 shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-2 text-emerald-100">
                <Banknote className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">当前余额</span>
            </div>
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
                ¥ {balance.toFixed(2)}
            </div>
        </div>
        <div className="absolute -right-4 -bottom-8 opacity-10 rotate-12">
            <Coins className="w-32 h-32 text-emerald-400" />
        </div>
      </div>

      {/* Buy Controls */}
      <div className={`space-y-3 transition-opacity duration-300 ${status !== 'IDLE' ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex justify-between items-end">
             <label className="text-gray-400 text-sm font-semibold uppercase tracking-wider">1. 购买数量 (单价 ¥{TURTLE_PRICE})</label>
             <span className={`text-sm font-bold ${canAfford ? 'text-indigo-400' : 'text-red-400'}`}>
                总价: ¥{totalCost}
             </span>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={() => adjustQuantity(-1)}
             className="w-12 bg-gray-700 hover:bg-gray-600 rounded-lg text-xl font-bold transition-colors"
           >-</button>
           <div className="flex-1 relative">
                <input 
                    type="number" 
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-gray-800 border-2 border-gray-600 rounded-lg py-3 px-4 text-center font-bold text-white focus:border-indigo-500 outline-none"
                />
           </div>
           <button 
             onClick={() => adjustQuantity(1)}
             className="w-12 bg-gray-700 hover:bg-gray-600 rounded-lg text-xl font-bold transition-colors"
           >+</button>
           <button 
             onClick={handleMaxBuy}
             className="px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors"
           >
             Max
           </button>
        </div>
        
        <div className="flex gap-2 justify-between">
           {[1, 5, 10, 50].map(num => (
               <button 
                key={num}
                onClick={() => setBuyQuantity(num)}
                className="flex-1 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs font-medium text-gray-400 border border-gray-700"
               >
                {num}只
               </button>
           ))}
        </div>
      </div>

      {/* Wish Selection */}
      <div className={`space-y-2 transition-opacity duration-300 ${status !== 'IDLE' && !isPlaying ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex justify-between items-center">
            <label className="text-gray-400 text-sm font-semibold uppercase tracking-wider">2. 许愿颜色 (中奖+1)</label>
            {wishColor && <span className={`text-xs px-2 py-0.5 rounded bg-gray-700 ${COLOR_MAP[wishColor].text}`}>{COLOR_LABELS[wishColor]}</span>}
        </div>
        
        <div className="grid grid-cols-5 gap-2 justify-items-center">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setWishColor(color)}
              disabled={isPlaying}
              className={`
                w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center
                transition-transform
                ${wishColor === color 
                  ? `scale-110 ring-2 ring-offset-2 ring-offset-gray-900 ring-white ${COLOR_MAP[color].border} ${COLOR_MAP[color].bg}` 
                  : 'bg-gray-800 border-gray-700 opacity-60 hover:opacity-100 hover:scale-105'}
                 ${isPlaying ? 'cursor-not-allowed' : ''}
              `}
              title={COLOR_LABELS[color]}
            >
              <TurtleIcon color={color} className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      {status === 'FINISHED' ? (
         <button
         onClick={onSellAndReset}
         className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-yellow-900/20 transition-all flex items-center justify-center gap-2 group border-2 border-yellow-400/20"
       >
         <Coins className="w-6 h-6 animate-bounce" />
         <div>
            <div className="leading-none">一键回收</div>
            <div className="text-xs font-normal opacity-90 mt-1">获得 ¥{potentialSellValue} 余额</div>
         </div>
       </button>
      ) : (
        <button
            onClick={() => onStart(buyQuantity)}
            disabled={isPlaying || !wishColor || !canAfford || buyQuantity < 1}
            className={`
            w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2
            ${isPlaying || !wishColor || !canAfford || buyQuantity < 1
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30 hover:scale-[1.02] border border-indigo-500/50'}
            `}
        >
            {isPlaying ? (
                <>
                 <Sparkles className="w-5 h-5 animate-spin" /> {status === 'SETTLING' ? '结算中...' : '正在拆包...'}
                </>
            ) : !canAfford ? (
                <>余额不足</>
            ) : (
                <>
                 <ShoppingBag className="w-5 h-5" /> 支付 ¥{totalCost} 并开始
                </>
            )}
        </button>
      )}
    </div>
  );
};