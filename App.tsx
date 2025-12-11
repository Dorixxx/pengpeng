import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, TurtleColor, GridSlot, LogEntry, Turtle, SettlementResult, ToastItem } from './types';
import { COLORS, EMPTY_GRID, COLOR_LABELS, TURTLE_PRICE, TURTLE_SELL_PRICE } from './constants';
import { Grid } from './components/Grid';
import { Controls } from './components/Controls';
import { GameLog } from './components/GameLog';
import { ToastOverlay } from './components/ToastOverlay';
import { Package, Gift } from 'lucide-react';

const BASE_PLACE_DELAY_MS = 200; // Base speed of placing turtles
const ANIMATION_BASE_DURATION_MS = 1200; // Must match CSS animation duration (1.2s)
const STORAGE_KEY = 'TURTLE_GAME_SAVE_DATA_V1';

export default function App() {
  // Global User State
  const [balance, setBalance] = useState(1000);

  // Game Configuration State
  const [buyQuantity, setBuyQuantity] = useState(10);
  const [wishColor, setWishColor] = useState<TurtleColor | null>(null);
  const [speed, setSpeed] = useState(1); // 1x default
  
  // UI State
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Flag to prevent saving before loading

  // Core Game State
  const [gameState, setGameState] = useState<GameState>({
    inventory: [],
    grid: [...EMPTY_GRID],
    packsRemaining: 0,
    totalOpened: 0,
    status: 'IDLE',
    wishColor: null,
    logs: [],
    lastAction: null,
  });

  const isProcessingRef = useRef(false);

  // Helper to add toasts
  const addToast = useCallback((message: string, type: ToastItem['type']) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto remove after 3 seconds (unaffected by game speed to keep UI readable)
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Helper to add logs
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setGameState(prev => ({
      ...prev,
      logs: [...prev.logs, { id: Date.now() + Math.random(), message, type }]
    }));
  }, []);

  // --- Persistence: LOAD ---
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        if (parsed.balance !== undefined) setBalance(parsed.balance);
        if (parsed.buyQuantity) setBuyQuantity(parsed.buyQuantity);
        if (parsed.wishColor !== undefined) setWishColor(parsed.wishColor);
        if (parsed.speed) setSpeed(parsed.speed);
        
        if (parsed.gameState) {
          // Restore game state
          setGameState(parsed.gameState);
        }
        
        addToast('欢迎回来，游戏进度已恢复', 'info');
      }
    } catch (e) {
      console.error("Failed to load save data", e);
    } finally {
      setIsDataLoaded(true);
    }
  }, [addToast]);

  // --- Persistence: SAVE ---
  useEffect(() => {
    // Only save if data has been initially loaded to avoid overwriting save with defaults
    if (!isDataLoaded) return;

    try {
      const dataToSave = {
        balance,
        buyQuantity,
        wishColor,
        speed,
        gameState: {
          ...gameState,
          // Optimization: Keep only the last 100 logs to prevent storage bloat
          logs: gameState.logs.slice(-100)
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Failed to save game data", e);
    }
  }, [balance, buyQuantity, wishColor, speed, gameState, isDataLoaded]);


  // Start Game Handler
  const handleStart = (quantity: number) => {
    if (gameState.status === 'PLAYING' || gameState.status === 'SETTLING') return;
    
    const cost = quantity * TURTLE_PRICE;
    if (balance < cost) {
        addToast("余额不足！请充值或减少购买数量。", 'info');
        return;
    }

    setBalance(prev => prev - cost);

    setGameState({
      inventory: [],
      grid: Array(9).fill(null),
      packsRemaining: quantity,
      totalOpened: 0,
      status: 'PLAYING',
      wishColor: wishColor,
      logs: [{ id: Date.now(), message: `支付 ¥${cost}，购买 ${quantity} 只乌龟。许愿：${wishColor ? COLOR_LABELS[wishColor] : '无'}`, type: 'info' }],
      lastAction: 'Start',
    });
  };

  const handleSellAndReset = () => {
    const totalValue = gameState.inventory.length * TURTLE_SELL_PRICE;
    setBalance(prev => prev + totalValue);
    
    setGameState(prev => ({
      ...prev,
      status: 'IDLE',
      logs: [],
      packsRemaining: 0,
      grid: Array(9).fill(null),
      inventory: [],
      totalOpened: 0,
    }));
    
    addToast(`回收成功！获得 ¥${totalValue.toFixed(2)}`, 'bonus');
  };

  const handleHardReset = () => {
    if (window.confirm("确定要重新开始吗？\n\n这将清除所有的金币、库存和历史记录，恢复到初始状态。")) {
      // Clear storage
      localStorage.removeItem(STORAGE_KEY);
      
      // Reset all states
      setBalance(1000);
      setBuyQuantity(10);
      setWishColor(null);
      setSpeed(1);
      setGameState({
        inventory: [],
        grid: [...EMPTY_GRID],
        packsRemaining: 0,
        totalOpened: 0,
        status: 'IDLE',
        wishColor: null,
        logs: [],
        lastAction: null,
      });
      
      addToast("存档已重置，游戏重新开始", 'info');
    }
  };

  // --- Logic: Settlement Algorithm ---
  const calculateSettlement = (grid: GridSlot[]): { result: SettlementResult, newGrid: GridSlot[], removedTurtles: Turtle[], matchIndices: number[] } => {
    const activeTurtles = grid.filter(t => t !== null) as Turtle[];
    const removedIndices = new Set<number>();
    const matches: string[] = [];
    let bonus = 0;

    // 1. Check Full House (9 Unique Colors)
    const uniqueColors = new Set(activeTurtles.map(t => t.color));
    const isFullHouse = activeTurtles.length === 9 && uniqueColors.size === 9;

    if (isFullHouse) {
        bonus += 5;
        matches.push("全家福 (9色不重样)");
        grid.forEach((_, i) => removedIndices.add(i));
    } else {
        // 2. Check Lines (3 in a row)
        const lines = [
            [0,1,2], [3,4,5], [6,7,8], // Rows
            [0,3,6], [1,4,7], [2,5,8], // Cols
            [0,4,8], [2,4,6]           // Diags
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            if (grid[a] && grid[b] && grid[c] && 
                grid[a]!.color === grid[b]!.color && 
                grid[a]!.color === grid[c]!.color) {
                    matches.push(`三连 (${COLOR_LABELS[grid[a]!.color]})`);
                    bonus += 5;
                    removedIndices.add(a);
                    removedIndices.add(b);
                    removedIndices.add(c);
            }
        }

        // 3. Check Pairs
        const colorMap = new Map<TurtleColor, number[]>();
        grid.forEach((t, i) => {
            if (t && !removedIndices.has(i)) {
                 if (!colorMap.has(t.color)) colorMap.set(t.color, []);
                 colorMap.get(t.color)!.push(i);
            }
        });

        colorMap.forEach((indices, color) => {
            const pairsCount = Math.floor(indices.length / 2);
            if (pairsCount > 0) {
                bonus += pairsCount;
                matches.push(`对对碰 x${pairsCount} (${COLOR_LABELS[color]})`);
                for (let k = 0; k < pairsCount * 2; k++) {
                    removedIndices.add(indices[k]);
                }
            }
        });
    }

    // 4. Check Clearance
    const isClearance = activeTurtles.length > 0 && removedIndices.size === activeTurtles.length;
    if (isClearance && !isFullHouse) {
        bonus += 5;
        matches.push("清台奖励");
    }

    const newGrid = grid.map((slot, i) => removedIndices.has(i) ? null : slot);
    const removedTurtles = grid.filter((_, i) => removedIndices.has(i)) as Turtle[];

    return {
        result: {
            bonusPacks: bonus,
            matches,
            totalCleared: removedIndices.size,
            isFullHouse,
            isClearance
        },
        newGrid,
        removedTurtles,
        matchIndices: Array.from(removedIndices)
    };
  };


  // --- Game Loop Effect ---
  useEffect(() => {
    if (!isDataLoaded) return; // Wait for data to load before running game loop
    if (gameState.status === 'FINISHED') return;
    if (isProcessingRef.current) return;

    // Helper to scale delay by speed
    const getDelay = (ms: number) => ms / speed;

    // PHASE 1: PLACING
    if (gameState.status === 'PLAYING') {
        const isFull = gameState.grid.every(s => s !== null);
        const isOutOfPacks = gameState.packsRemaining <= 0;

        if (isFull || (isOutOfPacks && gameState.grid.some(s => s !== null))) {
            setGameState(prev => ({ ...prev, status: 'SETTLING' }));
            return;
        }

        if (isOutOfPacks && gameState.grid.every(s => s === null)) {
            setGameState(prev => ({ ...prev, status: 'FINISHED' }));
            addLog("所有盲袋已拆完！请结算余额。", 'info');
            return;
        }

        isProcessingRef.current = true;
        setTimeout(() => {
            const newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
            const newTurtle: Turtle = { id: Math.random().toString(36).substr(2, 9), color: newColor };
            
            setGameState(prev => {
                const emptyIdx = prev.grid.findIndex(s => s === null);
                if (emptyIdx === -1) return prev;

                const newGrid = [...prev.grid];
                newGrid[emptyIdx] = newTurtle;
                
                let wishBonus = 0;
                let hitWish = false;
                const msgs: LogEntry[] = [...prev.logs];
                msgs.push({ id: Date.now(), message: `拆出：${COLOR_LABELS[newColor]}`, type: 'info' });
                
                if (prev.wishColor === newColor) {
                    wishBonus = 1;
                    hitWish = true;
                    msgs.push({ id: Date.now() + 1, message: `✨ 许愿成功！${COLOR_LABELS[newColor]} (+1包)`, type: 'wish' });
                }

                return {
                    ...prev,
                    grid: newGrid,
                    packsRemaining: prev.packsRemaining - 1 + wishBonus,
                    totalOpened: prev.totalOpened + 1,
                    logs: msgs
                };
            });
            
            if (gameState.wishColor === newColor) {
                 addToast(`✨ 许愿成功！${COLOR_LABELS[newColor]}`, 'wish');
            }

            isProcessingRef.current = false;
        }, getDelay(BASE_PLACE_DELAY_MS));
    }

    // PHASE 2: SETTLING
    if (gameState.status === 'SETTLING') {
        isProcessingRef.current = true;
        
        // 1. Calculate Results
        const { result, newGrid, removedTurtles, matchIndices } = calculateSettlement(gameState.grid);

        // Highlight matching cells immediately
        if (matchIndices.length > 0) {
            setHighlightedIndices(matchIndices);
        }

        // 2. Trigger Toasts (Staggered)
        // We attempt to fit toasts within the animation window, but prioritizing the animation end for clearance.
        let currentToastDelay = 0;
        
        const hasMatches = result.matches.length > 0 || result.bonusPacks > 0;

        if (!hasMatches) {
             addToast("本轮无组合", 'info');
        } else {
            if (result.isFullHouse) {
                 addToast("🎉 全家福！(9色不重样)", 'bonus');
                 currentToastDelay += getDelay(500);
            } else if (result.isClearance) {
                 addToast("✨ 清台奖励！", 'bonus');
                 currentToastDelay += getDelay(500);
            }

            result.matches.forEach(m => {
                setTimeout(() => addToast(m, 'match'), currentToastDelay);
                currentToastDelay += getDelay(400);
            });

            if (result.bonusPacks > 0) {
                 setTimeout(() => addToast(`🎁 奖励 +${result.bonusPacks} 包`, 'bonus'), currentToastDelay + getDelay(400));
            }
        }

        // 3. Apply Changes exactly when animation finishes
        // If there were no matches, we just wait a standard small delay to proceed.
        // If matches, we wait exactly for the animation duration.
        const settlementWaitTime = matchIndices.length > 0 
            ? getDelay(ANIMATION_BASE_DURATION_MS) 
            : getDelay(1000); 

        setTimeout(() => {
            setGameState(prev => {
                const msgs = [...prev.logs];
                
                result.matches.forEach(m => msgs.push({ id: Date.now() + Math.random(), message: `结算：${m}`, type: 'match' }));
                if (result.bonusPacks > 0) msgs.push({ id: Date.now() + Math.random(), message: `获得奖励：${result.bonusPacks}包`, type: 'bonus' });

                const finalInventory = [...prev.inventory, ...removedTurtles];
                const currentPacks = prev.packsRemaining + result.bonusPacks;
                
                let nextStatus: GameState['status'] = 'PLAYING';
                
                // Check if Game Over
                if (currentPacks <= 0) {
                    const isGridEmpty = newGrid.every(s => s === null);
                    if (isGridEmpty || removedTurtles.length === 0) {
                        nextStatus = 'FINISHED';
                        msgs.push({ id: Date.now() + 999, message: "游戏结束！", type: 'info' });
                    }
                }
                
                // If finishing, collect remaining turtles
                let gridToSave = newGrid;
                let inventoryToSave = finalInventory;
                
                if (nextStatus === 'FINISHED') {
                    const remaining = newGrid.filter(t => t !== null) as Turtle[];
                    if (remaining.length > 0) {
                        inventoryToSave = [...inventoryToSave, ...remaining];
                        gridToSave = Array(9).fill(null);
                        msgs.push({ id: Date.now() + 1000, message: `回收剩余 ${remaining.length} 只乌龟`, type: 'info' });
                    }
                }

                return {
                    ...prev,
                    grid: gridToSave,
                    inventory: inventoryToSave,
                    packsRemaining: currentPacks,
                    logs: msgs,
                    status: nextStatus
                };
            });
            // Clear highlights immediately when animation finishes to sync with turtle removal
            setHighlightedIndices([]);
            isProcessingRef.current = false;
        }, settlementWaitTime);
    }
  }, [gameState.status, gameState.packsRemaining, gameState.grid, gameState.wishColor, gameState.inventory.length, addLog, addToast, speed, isDataLoaded]);

  // Don't render full game until data check is done to prevent flash of empty state
  // Optional: could render a loading spinner here, but strictly not necessary for local storage speed
  if (!isDataLoaded) return null;

  return (
    <div className="min-h-screen bg-[#121212] text-white font-fredoka flex flex-col md:flex-row max-w-6xl mx-auto overflow-hidden">
       {/* Background Effects */}
       <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[100px] rounded-full" />
       </div>

       {/* Toast Layer */}
       <ToastOverlay toasts={toasts} />

       {/* Main Content Area */}
       <div className="flex-1 flex flex-col p-4 md:p-6 relative z-10 gap-6">
          <header className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                     <Package className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
                    乌龟对对碰
                  </h1>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700/50">
                  <div className="flex items-center gap-2">
                     <Package className="w-4 h-4 text-indigo-400" />
                     <span>剩 {gameState.packsRemaining} 包</span>
                  </div>
                  <div className="w-px h-4 bg-gray-700" />
                  <div className="flex items-center gap-2">
                     <Gift className="w-4 h-4 text-yellow-400" />
                     <span>已拆 {gameState.totalOpened}</span>
                  </div>
              </div>
          </header>

          <div className="flex-1 flex items-center justify-center min-h-[400px]">
               <Grid grid={gameState.grid} highlightedIndices={highlightedIndices} speed={speed} />
          </div>
          
          <div className="md:hidden">
             <GameLog logs={gameState.logs} />
          </div>
       </div>

       {/* Sidebar / Controls */}
       <div className="w-full md:w-96 bg-gray-900/80 border-t md:border-l border-gray-800 p-4 md:p-6 flex flex-col gap-6 backdrop-blur-md z-20 overflow-y-auto">
           
           <div className="hidden md:block">
               <GameLog logs={gameState.logs} />
           </div>

           <div className="flex-1">
               <Controls 
                  wishColor={wishColor}
                  setWishColor={setWishColor}
                  status={gameState.status}
                  onStart={handleStart}
                  onSellAndReset={handleSellAndReset}
                  buyQuantity={buyQuantity}
                  setBuyQuantity={setBuyQuantity}
                  balance={balance}
                  inventoryCount={gameState.inventory.length}
                  speed={speed}
                  setSpeed={setSpeed}
                  onReset={handleHardReset}
               />
           </div>
           
           <div className="text-center text-xs text-gray-600 font-medium">
               模拟仅供娱乐 • 概率透明 • 拒绝赌博
           </div>
       </div>
    </div>
  );
}