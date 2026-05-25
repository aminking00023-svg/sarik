import React, { useState, useRef, useEffect } from "react";
import { MapData, StatePiece } from "../types";
import { audioEngine } from "./AudioEngine";
import { Sparkles, CheckCircle, HelpCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

interface PuzzleMapProps {
  mapData: MapData;
  difficulty: "easy" | "medium" | "hard";
  placedStateIds: string[];
  onStatePlaced: (stateId: string) => void;
  onSelectStateInfo: (state: StatePiece) => void;
  highlightedStateId: string | null;
}

interface DraggingState {
  pieceId: string;
  startX: number;
  startY: number;
  offsetX: number; // Current accumulated offset X
  offsetY: number; // Current accumulated offset Y
  isDragging: boolean;
}

export const PuzzleMap: React.FC<PuzzleMapProps> = ({
  mapData,
  difficulty,
  placedStateIds,
  onStatePlaced,
  onSelectStateInfo,
  highlightedStateId,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [piecesOffsets, setPiecesOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [dragState, setDragState] = useState<DraggingState | null>(null);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [activePieceInTray, setActivePieceInTray] = useState<string | null>(null);
  const [hintActive, setHintActive] = useState<boolean>(false);

  // Initialize grid starting offsets for unplaced pieces on the bottom shelf
  useEffect(() => {
    const initialOffsets: Record<string, { x: number; y: number }> = {};
    const unplacedPieces = mapData.pieces.filter((p) => !placedStateIds.includes(p.id));

    // Grid settings for the physical puzzle shelf at the bottom
    const cols = 6;
    const colWidth = 92;
    const rowHeight = 70;
    const startX = 70;
    const startY = 595;

    mapData.pieces.forEach((piece) => {
      if (placedStateIds.includes(piece.id)) {
        initialOffsets[piece.id] = { x: 0, y: 0 };
      }
    });

    unplacedPieces.forEach((piece, index) => {
      if (dragState && dragState.pieceId === piece.id) {
        // Preserve position of currently dragged elements
        initialOffsets[piece.id] = piecesOffsets[piece.id] || { x: 0, y: 0 };
      } else {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const shelfX = startX + col * colWidth;
        const shelfY = startY + row * rowHeight;
        
        // Offset relative to the piece's native coordinates
        const offsetX = shelfX - piece.centerX;
        const offsetY = shelfY - piece.centerY;
        initialOffsets[piece.id] = { x: offsetX, y: offsetY };
      }
    });

    setPiecesOffsets(initialOffsets);
  }, [mapData, difficulty, placedStateIds]);

  const triggerSparkles = (x: number, y: number, colorClass: string) => {
    let colorHex = "#fbbf24"; // default gold
    if (colorClass.includes("teal")) colorHex = "#14b8a6";
    if (colorClass.includes("emerald")) colorHex = "#10b981";
    if (colorClass.includes("blue")) colorHex = "#3b82f6";
    if (colorClass.includes("rose")) colorHex = "#f43f5e";
    if (colorClass.includes("purple")) colorHex = "#a855f7";

    const newSparkles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 80,
      y: y + (Math.random() - 0.5) * 80,
      color: colorHex,
    }));
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.find((ns) => ns.id === s.id)));
    }, 1200);
  };

  // Convert client cursor coords to internal SVG viewBox coords
  const getSVGCoords = (clientX: number, clientY: number): { x: number; y: number } | null => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const viewBoxWidth = 600;
    const viewBoxHeight = 735;

    const x = ((clientX - rect.left) / rect.width) * viewBoxWidth;
    const y = ((clientY - rect.top) / rect.height) * viewBoxHeight;
    return { x, y };
  };

  // Start drag handler
  const handleDragStart = (
    pieceId: string,
    clientX: number,
    clientY: number,
    event: React.MouseEvent | React.TouchEvent
  ) => {
    if (placedStateIds.includes(pieceId)) {
      // Already correct, click to view trivia facts
      const piece = mapData.pieces.find((p) => p.id === pieceId);
      if (piece) {
        audioEngine.playClick();
        onSelectStateInfo(piece);
      }
      return;
    }

    event.stopPropagation();
    const coords = getSVGCoords(clientX, clientY);
    if (!coords) return;

    audioEngine.playDragStart();
    const currentOffset = piecesOffsets[pieceId] || { x: 0, y: 0 };

    setDragState({
      pieceId,
      startX: coords.x,
      startY: coords.y,
      offsetX: currentOffset.x,
      offsetY: currentOffset.y,
      isDragging: true,
    });
    setActivePieceInTray(pieceId);
  };

  // Move drag handler
  const handleDragMove = (clientX: number, clientY: number, event: React.MouseEvent | React.TouchEvent) => {
    if (!dragState || !dragState.isDragging) return;
    if (event.cancelable) event.preventDefault();

    const coords = getSVGCoords(clientX, clientY);
    if (!coords) return;

    const deltaX = coords.x - dragState.startX;
    const deltaY = coords.y - dragState.startY;

    setPiecesOffsets((prev) => ({
      ...prev,
      [dragState.pieceId]: {
        x: dragState.offsetX + deltaX,
        y: dragState.offsetY + deltaY,
      },
    }));
  };

  // End drag handler
  const handleDragEnd = () => {
    if (!dragState) return;
    const pieceId = dragState.pieceId;
    const offset = piecesOffsets[pieceId] || { x: 0, y: 0 };

    // Snap metric: target is (0, 0) in the unified map scale
    const distanceToTarget = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
    const snapThreshold = 30; // pixels range

    if (distanceToTarget < snapThreshold) {
      // Correct Match!
      setPiecesOffsets((prev) => ({
        ...prev,
        [pieceId]: { x: 0, y: 0 },
      }));
      audioEngine.playSuccessChime();
      onStatePlaced(pieceId);

      const piece = mapData.pieces.find((p) => p.id === pieceId);
      if (piece) {
        triggerSparkles(piece.centerX, piece.centerY, piece.color);
        onSelectStateInfo(piece);
      }
    } else {
      // Soft return bounce
      audioEngine.playErrorBuzz();
    }

    setDragState(null);
  };

  // Active state in drawer spawn
  const selectFromTray = (pieceId: string) => {
    if (placedStateIds.includes(pieceId)) return;
    audioEngine.playClick();
    setActivePieceInTray(pieceId);

    // Reposition the piece to center stage for easy dragging
    setPiecesOffsets((prev) => ({
      ...prev,
      [pieceId]: { x: 200, y: 220 },
    }));

    const piece = mapData.pieces.find((p) => p.id === pieceId);
    if (piece) {
      onSelectStateInfo(piece);
    }
  };

  const currentActivePieceDetails = mapData.pieces.find((p) => p.id === activePieceInTray);
  const remainingCount = mapData.pieces.length - placedStateIds.length;

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full items-stretch">
      {/* 1. Map Workspace Canvas */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
        {/* Workspace Title & Stats Banner */}
        <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-3 z-10 relative">
          <div>
            <span className="text-xs font-mono text-indigo-650 font-bold uppercase tracking-wider">
              Simulation Deck
            </span>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <span>{mapData.name}</span>
              {remainingCount === 0 && (
                <span className="bg-emerald-50 text-emerald-600 text-xs px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle size={12} /> Solved
                </span>
              )}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-slate-400">Completion</div>
            <div className="text-sm font-bold text-indigo-600 font-mono">
              {placedStateIds.length} / {mapData.pieces.length} Pieces
            </div>
          </div>
        </div>

        {/* Map SVG Canvas Container with ResizeObserver styled desk */}
        <div className="relative flex-1 min-h-[360px] md:min-h-[440px] flex items-center justify-center bg-slate-50/55 rounded-2xl border border-slate-200/60 shadow-inner grid-background p-1 md:p-4">
          
          {/* Compass / Desk watermark */}
          <div className="absolute top-4 left-4 pointer-events-none opacity-20">
            <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest font-bold">N</span>
            </div>
          </div>

          <svg
            id="puzzle-map-svg"
            ref={svgRef}
            viewBox="0 0 600 735"
            className="w-full max-h-[580px] object-contain select-none cursor-default"
            onMouseMove={(e) => handleDragMove(e.clientX, e.clientY, e)}
            onTouchMove={(e) => {
              if (e.touches.length > 0) {
                handleDragMove(e.touches[0].clientX, e.touches[0].clientY, e);
              }
            }}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <defs>
              <filter id="glow-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="active-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.8" />
              </filter>
              <linearGradient id="resting-piece-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>
            </defs>

            {/* A. Entire Country silhouette back-glow */}
            <path
              d={mapData.bgOutline}
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth="4"
              className="transition-all duration-300"
            />

            {/* B. Silhouette outlines (for Guidance in Easy & Medium Modes, or Hint Toggle) */}
            {(difficulty === "easy" || difficulty === "medium" || hintActive) && (
              <g opacity="0.5" pointerEvents="none">
                {mapData.pieces.map((piece) => (
                  <path
                    key={`hint-${piece.id}`}
                    d={piece.path}
                    fill="#e2e8f0"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                ))}
              </g>
            )}

            {/* C. Labels inside targeted slots in Easy Mode */}
            {(difficulty === "easy" || hintActive) && (
              <g opacity="0.65" pointerEvents="none" className="font-sans">
                {mapData.pieces.map((piece) => {
                  if (placedStateIds.includes(piece.id)) return null;
                  return (
                    <g key={`lbl-hint-${piece.id}`}>
                      <text
                        x={piece.centerX}
                        y={piece.centerY}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="9.5"
                        fontWeight="600"
                        fontFamily="monospace"
                      >
                        {piece.abbr}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* D. RENDER CONFIRMED SOLVED PIECES IN POSITION (0, 0) */}
            <g>
              {mapData.pieces.map((piece) => {
                const isPlaced = placedStateIds.includes(piece.id);
                const isHighlighted = highlightedStateId === piece.id;
                if (!isPlaced) return null;

                return (
                  <g
                    key={`placed-${piece.id}`}
                    className="cursor-pointer transition-all duration-200 hover:brightness-105"
                    onClick={() => {
                      audioEngine.playClick();
                      onSelectStateInfo(piece);
                    }}
                  >
                    <path
                      d={piece.path}
                      className={`transition-all duration-500 fill-current ${
                        isHighlighted ? "filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : ""
                      }`}
                      style={{
                        color: isHighlighted ? "#6366f1" : undefined,
                      }}
                      fill={piece.color.includes("bg-") ? undefined : piece.color}
                      // Apply beautiful pastel classes mapped natively inside SVG attributes
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {/* Native Fallback fill matching colors manually to preserve SVG presentation */}
                    <path
                      d={piece.path}
                      fill="none"
                      stroke={isHighlighted ? "#4f46e5" : "#f1f5f9"}
                      strokeWidth={isHighlighted ? "2.5" : "1"}
                    />
                    {/* Add label */}
                    <text
                      x={piece.centerX}
                      y={piece.centerY}
                      textAnchor="middle"
                      fill={piece.textColor}
                      fontSize="10"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow-sm select-none"
                    >
                      {piece.abbr}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Physical Chest Slate/Cardboard Shelf Visuals for Unplaced Jigsaw Pieces */}
            <g>
              <rect
                x="15"
                y="545"
                width="570"
                height="170"
                rx="18"
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <text
                x="35"
                y="570"
                fill="#94a3b8"
                fontSize="10"
                fontWeight="900"
                fontFamily="monospace"
                letterSpacing="1"
              >
                ASSEMBLY PIECES DOCK &mdash; DRAG FROM HERE
              </text>
            </g>

            {/* E. DRAGGING PIECE ACTIVE OVERLAY */}
            {mapData.pieces.map((piece) => {
              const isPlaced = placedStateIds.includes(piece.id);
              if (isPlaced) return null;

              const offset = piecesOffsets[piece.id] || { x: 0, y: 0 };
              const isDragging = dragState?.pieceId === piece.id;
              const isActiveLocal = activePieceInTray === piece.id;
              const isCurrentActive = isDragging || isActiveLocal;

              return (
                <g
                  key={`draggable-${piece.id}`}
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                    transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  }}
                  onMouseDown={(e) => handleDragStart(piece.id, e.clientX, e.clientY, e)}
                  onTouchStart={(e) => {
                    if (e.touches.length > 0) {
                      handleDragStart(piece.id, e.touches[0].clientX, e.touches[0].clientY, e);
                    }
                  }}
                  onClick={() => {
                    audioEngine.playClick();
                    setActivePieceInTray(piece.id);
                    onSelectStateInfo(piece);
                  }}
                  className={`cursor-grab active:cursor-grabbing transition-shadow duration-300 ${
                    isCurrentActive ? "drop-shadow-2xl z-50 filter brightness-105 scale-[1.05]" : "drop-shadow-sm hover:brightness-105"
                  }`}
                >
                  {/* Floating visual back-glow */}
                  <path
                    d={piece.path}
                    fill="#0f172a"
                    opacity={isCurrentActive ? "0.15" : "0.05"}
                    style={{ transform: isCurrentActive ? "translate(6px, 12px)" : "translate(2px, 4px)" }}
                  />

                  {/* Main cardboard piece block */}
                  <path
                    d={piece.path}
                    fill={isCurrentActive ? "#6366f1" : "url(#resting-piece-gradient)"}
                    stroke={isCurrentActive ? "#ffffff" : "#cbd5e1"}
                    strokeWidth={isCurrentActive ? "3" : "1.5"}
                    filter={isCurrentActive ? "url(#active-glow)" : undefined}
                    className={isCurrentActive ? "animate-pulse" : ""}
                  />
                  
                  {isCurrentActive && (
                    <path
                      d={piece.path}
                      fill="#ffffff"
                      opacity="0.15"
                    />
                  )}

                  {/* Centered Abbreviation indicator */}
                  <text
                    x={piece.centerX}
                    y={piece.centerY}
                    textAnchor="middle"
                    fill={isCurrentActive ? "#ffffff" : "#475569"}
                    fontSize={isCurrentActive ? "11.5" : "9.5"}
                    fontWeight="800"
                    className="select-none pointer-events-none font-mono"
                  >
                    {piece.abbr}
                  </text>
                </g>
              );
            })}

            {/* F. CELEBRATORY VISUAL SPARKLE PARTICLES */}
            {sparkles.map((spark) => (
              <circle
                key={spark.id}
                cx={spark.x}
                cy={spark.y}
                r={Math.random() * 4 + 3}
                fill={spark.color}
                className="animate-ping"
                style={{ animationDuration: "1000ms" }}
              />
            ))}
          </svg>

          {/* Active Piece Status HUD overlay */}
          {currentActivePieceDetails && (
            <div
              style={{ height: "50px", width: "658px" }}
              className="absolute bottom-4 left-4 right-4 bg-white/95 border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-3 backdrop-blur-md animate-fade-in z-10 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-150 flex items-center justify-center animate-bounce">
                  <span className="text-indigo-600 font-bold font-mono text-sm">{currentActivePieceDetails.abbr}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{currentActivePieceDetails.name}</h4>
                  <p className="text-xs text-slate-500">Capital: <span className="text-slate-700 font-medium">{currentActivePieceDetails.capital}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md font-bold border border-indigo-100">
                  Ready to snap
                </span>
                <span className="text-[11px] text-slate-500 italic hidden md:inline">
                  Drag the highlighted piece to its correct spot!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Board Utilities panel */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioEngine.playClick();
                setHintActive(!hintActive);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                hintActive 
                  ? "bg-indigo-50 text-indigo-750 border border-indigo-200" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-705 border border-slate-250"
              }`}
            >
              {hintActive ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{hintActive ? "Hide Grid Hint" : "Reveal Grid Hint"}</span>
            </button>
            <span className="text-xs text-slate-400 italic hidden sm:inline">
              {difficulty === "easy" 
                ? "Easy Mode: Large macro-regions, outlines, and label guides!" 
                : difficulty === "medium"
                ? "Medium Mode: Mid-sized regions with outlines but no label guides!"
                : "Hard Mode: Small regions, bare canvas, and strict time pressure!"}
            </span>
          </div>
          <div className="flex gap-2">
            {remainingCount > 0 ? (
              <span className="text-xs text-indigo-600 font-bold flex items-center gap-1">
                <HelpCircle size={14} /> Drag pieces from chest below or tap to select!
              </span>
            ) : (
              <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-250 shadow-sm animate-pulse">
                <Sparkles size={14} /> Map 100% Assembled! Great Job!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. State Pieces Tray Drawer (Unified Grid) */}
      <div className="w-full xl:w-80 bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 flex flex-col shadow-xl">
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest leading-none">Unsolved Chest</span>
            <h4 className="text-sm font-bold text-slate-800">State Puzzle Pieces</h4>
          </div>
          <span className="text-xs bg-slate-100 text-slate-750 px-2.5 py-1 rounded-full font-mono font-bold">
            {remainingCount} Left
          </span>
        </div>

        {remainingCount === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-emerald-200 rounded-xl bg-green-50/5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <CheckCircle className="text-emerald-600" size={24} />
            </div>
            <h5 className="font-bold text-slate-800 text-sm mb-1">Excellent Assembly!</h5>
            <p className="text-xs text-slate-500 max-w-[200px]">
              You placed all provinces correctly. Select states on the map to explore fun facts with our AI Guide!
            </p>
          </div>
        ) : (
          <div className="flex-1 max-h-[300px] xl:max-h-[440px] overflow-y-auto pr-1 flex flex-col gap-2 custom-scrollbar">
            {mapData.pieces.map((piece) => {
              const isPlaced = placedStateIds.includes(piece.id);
              const isActive = activePieceInTray === piece.id;

              if (isPlaced) {
                return (
                  <div
                    key={`tray-${piece.id}`}
                    onClick={() => onSelectStateInfo(piece)}
                    className="opacity-55 bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-slate-405 flex justify-between items-center text-xs line-through cursor-pointer hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-bold">{piece.abbr}</span>
                      <span className="text-slate-500 font-semibold">{piece.name}</span>
                    </div>
                    <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                  </div>
                );
              }

              return (
                <button
                  key={`tray-${piece.id}`}
                  onClick={() => selectFromTray(piece.id)}
                  className={`w-full text-left rounded-xl p-2.5 flex items-center justify-between text-xs font-bold tracking-wide border transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border-indigo-400 shadow-md ring-1 ring-indigo-400"
                      : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-slate-100 text-indigo-650 px-2 py-0.5 rounded font-black border border-slate-200">
                      {piece.abbr}
                    </span>
                    <span className="truncate">{piece.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isActive ? (
                      <span className="text-[10px] uppercase bg-indigo-600 text-white px-1.5 py-0.5 rounded animate-pulse font-bold">
                        Dragging
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono italic">
                        Spawn
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
