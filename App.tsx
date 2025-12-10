import React, { useState, useEffect } from 'react';
import { GameType, GameState } from './types';
import { initAudio } from './utils/audio';
import { SimonGame } from './components/SimonGame';
import { MemoryGame } from './components/MemoryGame';
import { Button } from './components/Button';
import { getCoachingTip } from './services/geminiService';
import { Brain, Zap, ArrowLeft, Play, Activity } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [activeGame, setActiveGame] = useState<GameType>(GameType.NONE);
  const [lastScore, setLastScore] = useState(0);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  const startGame = (type: GameType) => {
    initAudio();
    setActiveGame(type);
    setGameState(GameState.PLAYING);
    setAiTip(null);
  };

  const handleGameOver = async (score: number) => {
    setLastScore(score);
    setGameState(GameState.GAME_OVER);
    setIsLoadingTip(true);
    
    // Fetch AI Tip
    const tip = await getCoachingTip(activeGame, score);
    setAiTip(tip);
    setIsLoadingTip(false);
  };

  const returnToMenu = () => {
    setGameState(GameState.MENU);
    setActiveGame(GameType.NONE);
  };

  // -- Render Screens --

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full mb-4 ring-1 ring-indigo-500/50">
          <Brain className="w-12 h-12 text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300 mb-4 tracking-tight">
          NeuroPrime
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
          Quick cognitive activation exercises to prime your working memory and initiation.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button
          onClick={() => startGame(GameType.SIMON)}
          className="group relative flex flex-col items-start p-8 bg-slate-800/50 hover:bg-slate-800 rounded-3xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 text-left"
        >
          <div className="p-3 bg-emerald-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
            <Zap className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Simon Says</h3>
          <p className="text-slate-400">Boost sequential working memory. Repeat the growing pattern of lights and sounds.</p>
          <div className="mt-6 flex items-center text-emerald-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
            Start Sequence <Play className="w-4 h-4 ml-2 fill-current" />
          </div>
        </button>

        <button
          onClick={() => startGame(GameType.MEMORY)}
          className="group relative flex flex-col items-start p-8 bg-slate-800/50 hover:bg-slate-800 rounded-3xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 text-left"
        >
          <div className="p-3 bg-rose-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
            <Activity className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Memory Match</h3>
          <p className="text-slate-400">Enhance visual recall and focus. Find all pairs before the 60-second timer runs out.</p>
          <div className="mt-6 flex items-center text-rose-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
            Start Matching <Play className="w-4 h-4 ml-2 fill-current" />
          </div>
        </button>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="min-h-screen flex flex-col p-4">
      <div className="flex justify-between items-center w-full max-w-4xl mx-auto py-4">
        <button 
          onClick={returnToMenu}
          className="flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quit
        </button>
        <div className="text-slate-500 font-medium text-sm">
          {activeGame === GameType.SIMON ? 'SEQUENCE MEMORY' : 'VISUAL MEMORY'}
        </div>
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center">
        {activeGame === GameType.SIMON && <SimonGame onGameOver={handleGameOver} />}
        {activeGame === GameType.MEMORY && <MemoryGame onGameOver={handleGameOver} />}
      </main>
    </div>
  );

  const renderGameOver = () => (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-800/80 border border-slate-700 p-8 rounded-3xl shadow-2xl text-center animate-in zoom-in-95 duration-300">
        <h2 className="text-3xl font-bold text-white mb-2">Warm-up Complete!</h2>
        
        <div className="my-8 py-6 bg-slate-900/50 rounded-2xl border border-slate-700/50">
          <p className="text-slate-400 text-sm uppercase tracking-wider mb-1">Session Score</p>
          <p className="text-5xl font-mono font-bold text-indigo-400">{lastScore}</p>
        </div>

        <div className="mb-8">
          <h3 className="flex items-center justify-center text-indigo-300 font-semibold mb-3">
            <Brain className="w-5 h-5 mr-2" />
            Neural Analysis
          </h3>
          <div className="min-h-[80px] flex items-center justify-center">
            {isLoadingTip ? (
              <div className="flex flex-col items-center animate-pulse text-slate-500">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce mb-2"></div>
                Analyzing performance...
              </div>
            ) : (
              <p className="text-slate-200 italic leading-relaxed">
                "{aiTip}"
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={() => startGame(activeGame)} variant="primary" size="lg" className="w-full">
            Play Again
          </Button>
          <Button onClick={returnToMenu} variant="secondary" size="lg" className="w-full">
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900 min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-slate-100 selection:bg-indigo-500/30">
      {gameState === GameState.MENU && renderMenu()}
      {gameState === GameState.PLAYING && renderGame()}
      {gameState === GameState.GAME_OVER && renderGameOver()}
    </div>
  );
}
