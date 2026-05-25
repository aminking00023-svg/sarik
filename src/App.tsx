import { useState, useEffect } from "react";
import { mapsData, getDifficultyMap } from "./data/maps";
import { PuzzleMap } from "./components/PuzzleMap";
import { TriviaTutor } from "./components/TriviaTutor";
import { GameTutorial } from "./components/GameTutorial";
import { StatePiece } from "./types";
import { audioEngine } from "./components/AudioEngine";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Volume2, VolumeX, ShieldCheck, Award, Timer, RotateCcw, Sparkles, AlertCircle, Info, BookOpen, Map, HelpCircle } from "lucide-react";

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<"india" | "usa">("india");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [placedStateIds, setPlacedStateIds] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<StatePiece | null>(null);
  const [highlightedStateId, setHighlightedStateId] = useState<string | null>(null);

  // Score, Timer, & Fact states
  const [score, setScore] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(90); // 90 second limit for Hard Mode
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerExpired, setTimerExpired] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  // Automatically trigger map tutorial onboarding guides on first-ever load
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("mapmaster_onboard_v1");
    if (!hasSeenOnboarding) {
      setIsTutorialOpen(true);
      localStorage.setItem("mapmaster_onboard_v1", "true");
    }
  }, []);
  const [unlockedFact, setUnlockedFact] = useState<{
    name: string;
    abbr: string;
    capital: string;
    fact: string;
    color: string;
  } | null>(null);

  const activeMap = getDifficultyMap(selectedCountry, difficulty);

  // Tick the timer / countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && !gameCompleted && !timerExpired) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        if (difficulty === "hard") {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setTimerExpired(true);
              setTimerActive(false);
              audioEngine.playErrorBuzz();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameCompleted, timerExpired, difficulty]);

  // Start timer upon spawning first piece
  useEffect(() => {
    if (placedStateIds.length === 1 && !timerActive && !timerExpired) {
      setTimerActive(true);
    }
  }, [placedStateIds, timerActive, timerExpired]);

  // Watch for game completion
  useEffect(() => {
    if (placedStateIds.length > 0 && placedStateIds.length === activeMap.pieces.length) {
      setGameCompleted(true);
      setTimerActive(false);
      audioEngine.playVictoryChime();
    }
  }, [placedStateIds, activeMap]);

  // Handle snapping correct state
  const handleStatePlaced = (stateId: string) => {
    const piece = activeMap.pieces.find((p) => p.id === stateId);
    
    setPlacedStateIds((prev) => {
      if (prev.includes(stateId)) return prev;
      const updated = [...prev, stateId];
      // Increment score: easy gives 100 PTS, medium gives 150 PTS, hard gives 250 PTS per region
      const increment = difficulty === "easy" ? 100 : difficulty === "medium" ? 150 : 250;
      setScore((s) => s + increment);
      return updated;
    });

    if (piece) {
      // Trigger instant show-case of the regional fact unlocked
      setUnlockedFact({
        name: piece.name,
        abbr: piece.abbr,
        capital: piece.capital,
        fact: piece.funFactAhead || "A rich and historical region to explore and study, with friendly local culture.",
        color: piece.color,
      });

      // Update selections to prompt Gemini API fetch
      setSelectedState(piece);
      setHighlightedStateId(piece.id);
    }
  };

  // Switch country maps
  const handleSwitchCountry = (country: "india" | "usa") => {
    audioEngine.playClick();
    setSelectedCountry(country);
    setPlacedStateIds([]);
    setSelectedState(null);
    setHighlightedStateId(null);
    setScore(0);
    setSeconds(0);
    setTimeLeft(90);
    setTimerExpired(false);
    setTimerActive(false);
    setGameCompleted(false);
    setUnlockedFact(null);
  };

  // Change difficulty
  const handleSwitchDifficulty = (diff: "easy" | "medium" | "hard") => {
    audioEngine.playClick();
    setDifficulty(diff);
    handleResetForDifficulty(diff);
  };

  const handleReset = () => {
    handleResetForDifficulty(difficulty);
  };

  // Reset game session
  const handleResetForDifficulty = (currentDiff: "easy" | "medium" | "hard") => {
    audioEngine.playClick();
    setPlacedStateIds([]);
    setSelectedState(null);
    setHighlightedStateId(null);
    setScore(0);
    setSeconds(0);
    setTimeLeft(90);
    setTimerExpired(false);
    setTimerActive(false);
    setGameCompleted(false);
    setUnlockedFact(null);
  };

  // Toggle dynamic audio synthesizer volume state
  const handleToggleMute = () => {
    const nextMuted = audioEngine.toggleMute();
    setIsMuted(nextMuted);
  };

  // Quick select dynamic highlights to preview map region highlights
  const handleSelectStateInfo = (piece: StatePiece) => {
    setSelectedState(piece);
    setHighlightedStateId(piece.id);
  };

  // Formatted timer text
  const formatTime = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none antialiased">
      {/* 1. Global Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-indigo-650 rounded-lg flex items-center justify-center text-white">
              <Compass className="animate-spin-slow" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black uppercase tracking-wider text-slate-800 font-mono">
                  MapMaster Simulator
                </h1>
                <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-indigo-100">
                  Learning Lab
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Geography Learning Lab</p>
            </div>
          </div>

          {/* Level selectors & Country options */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            
            {/* Country Selector Switch */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex shadow-inner">
              <button
                onClick={() => handleSwitchCountry("india")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCountry === "india"
                    ? "bg-indigo-600 text-white font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>🇮🇳 India</span>
              </button>
              <button
                onClick={() => handleSwitchCountry("usa")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCountry === "usa"
                    ? "bg-indigo-600 text-white font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>🇺🇸 United States</span>
              </button>
            </div>

            {/* Difficulty selectors */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex shadow-inner gap-0.5">
              <button
                onClick={() => handleSwitchDifficulty("easy")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  difficulty === "easy"
                    ? "bg-white text-slate-800 border border-slate-200/50 shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => handleSwitchDifficulty("medium")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  difficulty === "medium"
                    ? "bg-white text-indigo-700 border border-slate-200/50 shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => handleSwitchDifficulty("hard")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  difficulty === "hard"
                    ? "bg-white text-rose-600 border border-rose-100 shadow-sm font-bold animate-pulse"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Hard 🔥
              </button>
            </div>

            {/* Audio Toggle button */}
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl transition-all border ${
                isMuted
                  ? "bg-slate-100 border-slate-200 text-rose-600 hover:text-rose-700"
                  : "bg-slate-800 border-slate-750 text-white hover:bg-slate-700"
              }`}
              title="Toggle Game Sound SFX"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Educational HUD and Status Banners */}
      <section className="bg-white border-b border-slate-200 py-3.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* User Score & Help indicator */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100">
              <Award className="text-amber-500 shrink-0" size={16} />
              <div className="text-xs">
                <span className="text-slate-400 block text-[9px] font-mono leading-none font-bold uppercase">Scoreboard</span>
                <span className="font-bold text-slate-800 font-mono text-sm leading-none">{score} PTS</span>
              </div>
            </div>

            {difficulty === "hard" ? (
              <div className="flex items-center gap-2 bg-red-50 border border-red-150 px-3.5 py-1.5 rounded-xl animate-pulse">
                <Timer className="text-rose-600 shrink-0 animate-spin-slow" size={16} />
                <div className="text-xs">
                  <span className="text-red-550 block text-[9px] font-mono leading-none font-bold uppercase">Time Limit</span>
                  <span className="font-extrabold text-rose-600 font-mono text-sm leading-none">{timeLeft}s Left</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100">
                <Timer className="text-indigo-600 shrink-0" size={16} />
                <div className="text-xs">
                  <span className="text-slate-400 block text-[9px] font-mono leading-none font-bold uppercase">Time Elapsed</span>
                  <span className="font-bold text-slate-800 font-mono text-sm leading-none">{formatTime(seconds)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines info */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-[11px] text-slate-550 max-w-sm text-center sm:text-left">
            <Info size={14} className="text-indigo-600 shrink-0" />
            <span>
              {difficulty === "easy"
                ? "Easy: Big regions, outlines, and label guides. Score 100 PTS per piece."
                : difficulty === "medium"
                ? "Medium: Mid-sized regions with outlines, no label guides! Score 150 PTS per piece."
                : "Hard: Small regions, bare layout, with strict 90-second limit! Score 250 PTS per piece."}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Tutorial Walkthrough Onboarding btn */}
            <button
              onClick={() => {
                audioEngine.playClick();
                setIsTutorialOpen(true);
              }}
              id="tutorial-toggle-hud"
              className="px-4 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-indigo-200/50 shadow-sm cursor-pointer"
            >
              <HelpCircle size={13} />
              <span>How to Play</span>
            </button>

            {/* Level resets button */}
            <button
              onClick={handleReset}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-slate-200 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Main Workspace Deck (Puzzle Board + AI Tutor) */}
      <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-6 w-full flex flex-col gap-6 relative">
        
        {/* Real-time Unlocked Fact Display Banner */}
        <AnimatePresence>
          {unlockedFact && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="bg-indigo-900 text-white rounded-2xl p-4 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 border border-indigo-750/85 mb-2 overflow-hidden relative"
            >
              {/* Sparkle subtle back-lights */}
              <div className="absolute top-0 right-0 pointer-events-none opacity-20">
                <Sparkles className="text-indigo-400 w-24 h-24 rotate-12 -mr-6 -mt-6" />
              </div>

              <div className="flex items-center gap-3.5 relative z-10 w-full md:w-auto">
                <div className="w-11 h-11 rounded-xl bg-indigo-50/10 border border-indigo-500/35 flex items-center justify-center shrink-0 animate-pulse text-indigo-300">
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-amber-400 text-slate-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider font-mono">
                      State Fact Unlocked!
                    </span>
                    <span className="font-mono text-indigo-200 text-xs">
                      {unlockedFact.abbr} &middot; Capital: {unlockedFact.capital}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white mt-0.5">
                    {unlockedFact.name}
                  </h4>
                  <p className="text-sm text-indigo-100 mt-1 max-w-3xl font-medium leading-relaxed">
                    {unlockedFact.fact}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto justify-end relative z-10 border-t md:border-t-0 pt-3 md:pt-0 border-indigo-805">
                <button
                  onClick={() => setUnlockedFact(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-white text-xs font-bold transition-all border border-indigo-700/60 cursor-pointer text-center whitespace-nowrap"
                >
                  Got it, Keep Playing!
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Playthrough Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full flex-1">
          
          {/* Puzzle board area (Spans remaining bounds) */}
          <div className="lg:col-span-8 flex flex-col h-full justify-between">
            <PuzzleMap
              mapData={activeMap}
              difficulty={difficulty}
              placedStateIds={placedStateIds}
              onStatePlaced={handleStatePlaced}
              onSelectStateInfo={handleSelectStateInfo}
              highlightedStateId={highlightedStateId}
            />
          </div>

          {/* Geography Coach Sidebar (Spans 4 grid points) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <TriviaTutor
              selectedState={selectedState}
              country={selectedCountry}
              completedStates={placedStateIds}
            />
          </div>
        </div>

        {/* 4. Complete Map Celebration Banner Modal */}
        <AnimatePresence>
          {gameCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 max-w-xl w-full text-center shadow-2xl relative overflow-hidden"
              >
                {/* Visual sparkles */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-sky-500 animate-pulse"></div>

                <div className="w-20 h-20 bg-green-55/10 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                  <Award className="animate-bounce" size={44} />
                </div>

                <span className="text-xs font-mono text-indigo-600 uppercase tracking-widest font-black block mb-1">
                  Puzzle Masterpiece
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
                  Excellent Assembly!
                </h2>
                <h3 className="text-sm text-slate-500 mt-2 mb-6">
                  You successfully solved the geography map puzzle of{" "}
                  <span className="text-indigo-600 font-bold">{activeMap.name}</span>.
                </h3>

                {/* Score Stats Summary Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-around gap-4 mb-8">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Final Score</span>
                    <span className="text-xl font-bold font-mono text-indigo-600">{score} PTS</span>
                  </div>
                  <div className="border-r border-slate-200"></div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">{difficulty === "hard" ? "Base Limit" : "Time Completed"}</span>
                    <span className="text-xl font-bold font-mono text-indigo-600">{difficulty === "hard" ? "Hard Countdowned" : formatTime(seconds)}</span>
                  </div>
                  <div className="border-r border-slate-200"></div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Regions Placed</span>
                    <span className="text-xl font-bold font-mono text-indigo-600">{placedStateIds.length} Zones</span>
                  </div>
                </div>

                {/* Educational insight callout */}
                <div className="p-4 bg-indigo-50 text-indigo-900 border border-indigo-100/60 text-xs rounded-xl flex items-start gap-3 text-left mb-8 leading-relaxed">
                  <BookOpen className="shrink-0 mt-0.5 text-indigo-650" size={16} />
                  <span>
                    Did you know? Reviewing geography maps helps build strong spatial memory and enhances global cultural appreciation! Toggle countries at the top to challenge yourself on a new map!
                  </span>
                </div>

                {/* Interactive reset triggers */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      setSelectedCountry(selectedCountry === "india" ? "usa" : "india");
                      handleReset();
                    }}
                    className="flex-1 py-3 rounded-xl bg-indigo-605 bg-indigo-605 text-white bg-indigo-600 hover:bg-indigo-700 text-xs font-extrabold transition-all hover:scale-[1.02] active:scale-[0.98] tracking-wider uppercase cursor-pointer shadow-sm"
                  >
                    Challenge Other Country
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                  >
                    Replay Level
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Complete Map Time-Out Banner / Modal */}
        <AnimatePresence>
          {timerExpired && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
              >
                {/* Visual emergency strip */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-rose-600 animate-pulse"></div>

                <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-600">
                  <AlertCircle className="animate-bounce" size={32} />
                </div>

                <span className="text-xs font-mono text-rose-600 uppercase tracking-widest font-black block mb-1">
                  Time Pressure Expired
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 leading-tight">
                  Simulator Time Out!
                </h2>
                <h3 className="text-xs text-slate-500 mt-2 mb-6">
                  Hard Mode requires extreme spatial reasoning! The 90-second countdown ran out before full assembly.
                </h3>

                {/* Score Stats Summary Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-around gap-4 mb-8">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Score Achieved</span>
                    <span className="text-lg font-bold font-mono text-rose-600">{score} PTS</span>
                  </div>
                  <div className="border-r border-slate-200"></div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Zones Assembled</span>
                    <span className="text-lg font-bold font-mono text-slate-800">{placedStateIds.length} / {activeMap.pieces.length}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleReset()}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all tracking-wider uppercase cursor-pointer shadow-md hover:scale-[1.01]"
                  >
                    Retry Hard Mode
                  </button>
                  <button
                    onClick={() => handleSwitchDifficulty("medium")}
                    className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                  >
                    Switch to Medium Mode
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Interactive Tutorial Onboarding System */}
        <GameTutorial 
          isOpen={isTutorialOpen} 
          onClose={() => setIsTutorialOpen(false)} 
        />
      </main>

      {/* Footer system details */}
      <footer className="bg-slate-800 py-4 px-6 text-slate-100 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Simulator Ready</span>
            </div>
            <span className="text-slate-600 text-xs">|</span>
            <span className="text-[10px] font-medium text-slate-300 uppercase">Session ID: 4920-XLT-MAP</span>
          </div>
          <div className="text-[10px] font-medium text-slate-300 italic">
            Press <b>[H]</b> for dynamic hints &middot; Pure WebAudio Synthesis &middot; &copy; Learning Lab
          </div>
        </div>
      </footer>
    </div>
  );
}
