export interface StatePiece {
  id: string;          // e.g. "IN-RJ"
  name: string;        // e.g. "Rajasthan"
  capital: string;     // e.g. "Jaipur"
  abbr: string;        // e.g. "RJ"
  color: string;       // Hex or Tailwind class for fills
  textColor: string;   // For label contrast
  path: string;        // SVG path code inside 600x550 coordinate space
  centerX: number;     // Label center X
  centerY: number;     // Label center Y
  targetX: number;     // Target grid coordinate X
  targetY: number;     // Target grid coordinate Y
  funFactAhead?: string; // Quick pre-cached fun fact
}

export interface MapData {
  id: "india" | "usa";
  name: string;
  viewBox: string;
  width: number;
  height: number;
  bgOutline: string; // Silhouette path of the entire country
  pieces: StatePiece[];
}

export interface GameSession {
  country: "india" | "usa";
  difficulty: "easy" | "medium" | "hard"; // Easy (grouped macro-regions), Medium (mid-sized), Hard (small, time pressure)
  score: number;
  elapsedSeconds: number;
  placedStateIds: string[]; // Placed states
  movesCount: number;
  hintsUsed: number;
  isCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface StateTrivia {
  capital: string;
  climate: string;
  funFact: string;
  historicalFact: string;
  placesToVisit: string[];
  fallback?: boolean;
}
