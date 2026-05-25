import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Compass, 
  Map, 
  Move, 
  Timer, 
  BookOpen, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  Award
} from "lucide-react";
import { audioEngine } from "./AudioEngine";

interface GameTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameTutorial({ isOpen, onClose }: GameTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to MapMaster",
      subtitle: "The Ultimate Spatial Geography Lab",
      icon: <Compass className="text-indigo-600 animate-spin-slow" size={40} />,
      badge: "Onboarding 🚀",
      description: "Welcome! MapMaster is an interactive jigsaw learning simulation. Match geographic regions, master regional details, and test your knowledge with Professor Atlas—your AI tutor. Let's take a 60-second tour!",
      color: "from-indigo-500/10 to-purple-500/10 border-indigo-150",
      content: (
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-2">
          <div className="flex gap-2 mb-3">
            <span className="text-xs bg-indigo-55 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-100">🇮🇳 India Maps</span>
            <span className="text-xs bg-purple-55 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-100">🇺🇸 USA Maps</span>
          </div>
          <p className="text-xs text-slate-500 text-center max-w-sm">
            Drag, snap, study, and play customized regional interactive quizzes! Perfect for student and geometry enthusiasts alike.
          </p>
        </div>
      )
    },
    {
      title: "Choose Your Domain",
      subtitle: "Toggle Between Nations Effortlessly",
      icon: <Map className="text-emerald-600" size={40} />,
      badge: "Map Controls 🗺️",
      description: "Use the country selector in the header bar to hot-swap between high-definition cartographic maps containing interactive regional pieces.",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-150",
      content: (
        <div className="w-full max-w-sm mx-auto bg-slate-50 rounded-2xl p-4 border border-slate-100 mt-2 flex flex-col gap-2.5">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase text-center block">Try It Mentally</span>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm justify-around">
            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-150/50 flex items-center gap-1">
              <span>🇮🇳 India</span>
            </div>
            <div className="px-3 py-1 text-slate-400 text-xs font-medium rounded-lg flex items-center gap-1">
              <span>🇺🇸 United States</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 text-center italic">
            "Swap at any point during your learning journey to explore another hemisphere!"
          </p>
        </div>
      )
    },
    {
      title: "Drag & Lock Mechanics",
      subtitle: "Snap Pieces Onto the Canvas",
      icon: <Move className="text-amber-500 animate-bounce" size={40} />,
      badge: "Physics Controls 🧩",
      description: "At the bottom of the board, interactive puzzle state fragments are generated. Pick up a piece, hover it onto its slot, and release to lock it with a satisfying chime!",
      color: "from-amber-500/10 to-orange-500/10 border-amber-150",
      content: (
        <div className="w-full max-w-sm mx-auto bg-slate-50 rounded-2xl p-4 border border-slate-100 mt-2 flex flex-col gap-3">
          <div className="flex justify-around items-center">
            {/* Mock puzzle dragging */}
            <div className="p-3 bg-amber-100 border border-amber-300 text-amber-950 rounded-xl text-xs font-bold shadow-sm animate-pulse">
              Drag State Piece
            </div>
            <div className="text-slate-300 text-xl font-bold font-mono">➜</div>
            <div className="p-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md relative">
              Snapped Grid
              <span className="absolute -top-1.5 -right-1 bg-green-400 border border-white text-[8px] px-1 py-0.2 rounded-full animate-bounce">
                ✓
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            Can't place it? Use the <b>[H]</b> key or <b>Toggle Silhouette Hint</b> to view the target shapes dynamically!
          </p>
        </div>
      )
    },
    {
      title: "Difficulty & Challenges",
      subtitle: "Easy, Medium, or Hyper-Focused Hard Modes",
      icon: <Timer className="text-rose-600" size={40} />,
      badge: "Game Modes ⚡",
      description: "Dial up the stakes! Toggle between layout modes tailored for both relaxed study and intense test setups:",
      color: "from-rose-500/10 to-red-500/10 border-rose-150",
      content: (
        <div className="w-full max-w-sm mx-auto flex flex-col gap-2 mt-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-white rounded-xl border border-slate-200 text-center text-[10px]">
              <span className="font-bold text-slate-700 block">Easy</span>
              <span className="text-slate-400 text-[9px]">4 Big Macro Regions</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 text-center text-[10px]">
              <span className="font-bold text-indigo-700 block">Medium</span>
              <span className="text-slate-400 text-[9px]">8 Mid Regions</span>
            </div>
            <div className="p-2 bg-rose-50 border border-rose-100 rounded-xl text-center text-[10px]">
              <span className="font-extrabold text-rose-600 block">Hard 🔥</span>
              <span className="text-red-500 text-[9px]">Granular States + 90s Limit!</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 text-center mt-1">
            Hard Mode adds intense time pressure and hides target hints for real geographer aces!
          </p>
        </div>
      )
    },
    {
      title: "Interactive AI Chat Tutor",
      subtitle: "Let Professor Atlas Deep-Dive With You",
      icon: <Sparkles className="text-indigo-600" size={40} />,
      badge: "AI Features 🤖",
      description: "Need trivia insights, historic origins, climate descriptions, or specialized regional quizzes? Chat with Professor Atlas. The AI dynamically crafts answers and interactive checks based on your currently selected state!",
      color: "from-indigo-500/10 to-sky-500/10 border-indigo-150",
      content: (
        <div className="w-full max-w-sm mx-auto bg-slate-900 text-slate-200 rounded-2xl p-3 border border-indigo-950 mt-1 flex flex-col gap-2">
          <div className="flex items-center gap-2 border-b border-indigo-950 pb-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
              PA
            </div>
            <span className="text-[11px] font-mono text-indigo-300 font-bold">Professor Atlas AI Chat</span>
          </div>
          <div className="bg-slate-800 p-2 rounded-xl text-[10px] text-slate-350 italic">
            "Ask me anything relative to Punjab, Texas, or California! Let's generate a geography quiz!"
          </div>
          <div className="flex justify-end">
            <span className="bg-indigo-600 text-[9px] font-bold text-white px-2.5 py-1 rounded-full">
              Generate Custom Quiz
            </span>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    audioEngine.playClick();
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    audioEngine.playClick();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleJump = (index: number) => {
    audioEngine.playClick();
    setCurrentStep(index);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="game-tutorial-container-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden flex flex-col gap-4"
        >
          {/* Close button */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            id="close-tutorial-button"
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="Close onboarding guide"
          >
            <X size={18} />
          </button>

          {/* Badge & Progressive indicator */}
          <div className="flex items-center justify-between mt-1">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-indigo-100/50">
              {steps[currentStep].badge}
            </span>
            <span className="text-xs font-mono text-slate-450 font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          {/* Visual card theme wrapper */}
          <div className={`p-5 rounded-2xl bg-gradient-to-br ${steps[currentStep].color} border flex items-start gap-4 transition-all duration-300`}>
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
              {steps[currentStep].icon}
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">
                {steps[currentStep].subtitle}
              </span>
              <h3 className="text-lg font-black text-slate-905 tracking-tight mt-0.5">
                {steps[currentStep].title}
              </h3>
            </div>
          </div>

          {/* Description words */}
          <p className="text-[13px] text-slate-600 leading-relaxed font-normal min-h-[56px]">
            {steps[currentStep].description}
          </p>

          {/* Interactive illustration box */}
          <div className="w-full">
            {steps[currentStep].content}
          </div>

          {/* Progress bullet coordinates */}
          <div className="flex justify-center gap-1.5 mt-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => handleJump(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === i ? "w-6 bg-indigo-600 shadow-sm" : "w-2 bg-slate-200 hover:bg-slate-350"
                }`}
                aria-label={`Jump to tutorial slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Bottom Control Bar */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-1">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              id="back-tutorial-nav"
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                currentStep === 0 
                  ? "text-slate-300 cursor-not-allowed" 
                  : "text-slate-600 hover:bg-slate-100 cursor-pointer"
              }`}
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onClose();
                }}
                id="finish-tutorial-nav"
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs tracking-wider uppercase px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Assemble Map!</span>
                <CheckCircle size={15} />
              </button>
            ) : (
              <button
                onClick={handleNext}
                id="next-tutorial-nav"
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all hover:translate-x-0.5 active:scale-95 cursor-pointer shadow-sm"
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
