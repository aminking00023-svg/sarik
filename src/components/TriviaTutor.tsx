import React, { useState, useEffect, useRef } from "react";
import { StatePiece, ChatMessage, StateTrivia } from "../types";
import { audioEngine } from "./AudioEngine";
import { Sparkles, Send, MapPin, Compass, ThermometerSun, BookOpen, MessageSquare, Loader2, Info, GraduationCap } from "lucide-react";

interface TriviaTutorProps {
  selectedState: StatePiece | null;
  country: "india" | "usa";
  completedStates: string[];
}

export const TriviaTutor: React.FC<TriviaTutorProps> = ({
  selectedState,
  country,
  completedStates,
}) => {
  const [activeTab, setActiveTab] = useState<"facts" | "chat">("facts");
  const [trivia, setTrivia] = useState<StateTrivia | null>(null);
  const [loadingTrivia, setLoadingTrivia] = useState<boolean>(false);
  const [triviaError, setTriviaError] = useState<string | null>(null);

  // Chat states
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: "Hello young explorer! 🌍 I am **Atlas**, your AI Geography Guide. Assemble the puzzle by dragging pieces in place! Whenever you complete a state, or select a solved piece, I will unlock authentic facts here. Ask me anything about world geography!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMsg, setInputMsg] = useState<string>("");
  const [sendingMsg, setSendingMsg] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendingMsg]);

  // Load detailed educational trivia when a state is clicked or solved
  useEffect(() => {
    if (!selectedState) {
      setTrivia(null);
      return;
    }

    setLoadingTrivia(true);
    setTriviaError(null);

    // Fetch facts from Express backend
    fetch("/api/gemini/state-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country,
        stateName: selectedState.name,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not contact geography database");
        return res.json();
      })
      .then((data: StateTrivia) => {
        setTrivia(data);
        setLoadingTrivia(false);

        // Optional greeting message injected into chat dynamically
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) => [
          ...prev,
          {
            id: `auto-${selectedState.id}-${Date.now()}`,
            role: "assistant",
            content: `🎓 **Fascinating Discovery!** You selected/placed **${selectedState.name}**! Its capital is **${data.capital}**. Take a look at its unique climate and fun facts in the **Explorer Facts** tab!`,
            timestamp: timeStr,
          },
        ]);
        setActiveTab("facts");
      })
      .catch((err) => {
        console.error(err);
        setTriviaError("Using cached geographic descriptions due to safe api configuration");
        setTrivia({
          capital: selectedState.capital,
          climate: "Temperate continental / variable regional geography",
          funFact: selectedState.funFactAhead || "A beautiful region enriched with historical towns, geographical scenic paths, and friendly local culture.",
          historicalFact: "Settled by ancient cultures, its borders were defined by rivers, mountain ridges, and trade pathways.",
          placesToVisit: ["Capital landmarks", "Historic historic parks", "Natural trails"],
          fallback: true,
        });
        setLoadingTrivia(false);
      });
  }, [selectedState, country]);

  // Ask dynamic question to Tutor Atlas
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputMsg).trim();
    if (!query) return;

    audioEngine.playClick();
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: userTime,
    };

    setMessages((prev) => [...prev, userMessage]);
    
    if (!textToSend) {
      setInputMsg("");
    }
    setSendingMsg(true);

    // Call ask-tutor express route
    fetch("/api/gemini/ask-tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: query,
        currentCountry: country === "india" ? "India" : "United States of America",
        completedStates: completedStates.map((id) => id.split("-")[1] || id),
        history: messages.slice(-5).map((m) => ({ role: m.role, content: m.content })),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Tutor became busy!");
        return res.json();
      })
      .then((data) => {
        const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) => [
          ...prev,
          {
            id: `ast-${Date.now()}`,
            role: "assistant",
            content: data.answer || "I could not generate an answer right now. Keep exploring!",
            timestamp: assistantTime,
          },
        ]);
        setSendingMsg(false);
      })
      .catch((err) => {
        console.error(err);
        setTimeout(() => {
          const assistantTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setMessages((prev) => [
            ...prev,
            {
              id: `ast-err-${Date.now()}`,
              role: "assistant",
              content: `To get real-time conversation or custom geographic details from Atlas, please ensure your **GEMINI_API_KEY** is configured securely in the **Settings > Secrets** panel! Ready for the next state?`,
              timestamp: assistantTime,
            },
          ]);
          setSendingMsg(false);
        }, 800);
      });
  };

  const handleQuickQuestion = (topic: string) => {
    if (!selectedState) return;
    let actualPrompt = "";
    if (topic === "rivers") {
      actualPrompt = `What are the major rivers, lake systems, and water bodies flowing in ${selectedState.name}, ${country === "india" ? "India" : "USA"}?`;
    } else if (topic === "animals") {
      actualPrompt = `What unique wild animals, birds, or plant species are found in ${selectedState.name}, ${country === "india" ? "India" : "USA"}?`;
    } else if (topic === "food") {
      actualPrompt = `Tell me about the traditional food, famous farming crops, and harvest festivals of ${selectedState.name}, ${country === "india" ? "India" : "USA"}!`;
    }
    handleSendMessage(actualPrompt);
    setActiveTab("chat");
  };

  // Utility to parse basic markdown inside assistant text (like bold and headers)
  const formatAssistantText = (text: string) => {
    return text.split("\n").map((line, idx) => {
      // Bold rendering
      let processed = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      
      // Basic sanitization
      processed = processed.replace(boldRegex, "<strong>$1</strong>");

      if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
        return (
          <li key={idx} className="ml-4 list-disc pl-1 mb-1 text-slate-300" dangerouslySetInnerHTML={{ __html: processed.replace(/^[-*]\s*/, "") }} />
        );
      }
      return (
        <p key={idx} className="mb-2 text-slate-300 leading-relaxed text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: processed }} />
      );
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl flex flex-col h-full overflow-hidden shadow-xl">
      {/* Tutor Profile Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-indigo-650 rounded-full flex items-center justify-center shadow-md">
              <GraduationCap className="text-white" size={20} />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-slate-800 font-sans">Professor Atlas</h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wider border border-indigo-100">Tutor</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium font-sans">AI Geography Coach & Academic Guide</p>
          </div>
        </div>
        
        {/* Header decoration */}
        <Compass className="text-slate-400 animate-spin-slow pointer-events-none" size={24} />
      </div>

      {/* Tabs Switcher */}
      <div className="bg-slate-50/55 p-1.5 flex border-b border-slate-200">
        <button
          onClick={() => { audioEngine.playClick(); setActiveTab("facts"); }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
            activeTab === "facts"
              ? "bg-white text-indigo-700 border border-slate-200/50 shadow-sm"
              : "text-slate-500 hover:text-slate-850"
          }`}
        >
          <BookOpen size={13} />
          Explorer Facts
        </button>
        <button
          onClick={() => { audioEngine.playClick(); setActiveTab("chat"); }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${
            activeTab === "chat"
              ? "bg-white text-indigo-700 border border-slate-200/50 shadow-sm"
              : "text-slate-500 hover:text-slate-850"
          }`}
        >
          <MessageSquare size={13} />
          Tutor Chat
        </button>
      </div>

      {/* Main Panel Content Box */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-between">
        {activeTab === "facts" ? (
          <div className="flex-1 flex flex-col">
            {loadingTrivia ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10">
                <Loader2 className="animate-spin text-indigo-600 mb-2" size={28} />
                <span className="text-xs text-slate-405">Querying geographic encyclopedia...</span>
              </div>
            ) : trivia ? (
              <div className="space-y-4 animate-fade-in flex-1">
                {/* State Name Header Banner */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                  <span className="text-[10px] font-mono text-indigo-650 tracking-widest font-bold uppercase">Active Exhibit</span>
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2 mt-0.5">
                    <MapPin size={16} className="text-amber-500 animate-pulse" />
                    {selectedState?.name}
                  </h3>
                  <div className="mt-1.5 text-xs text-slate-500 flex items-center gap-1.5 font-bold">
                    <span className="text-slate-400 font-semibold">Official Capital:</span>
                    <span className="text-indigo-600">{trivia.capital}</span>
                  </div>
                </div>

                {/* Climate Facts */}
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex gap-3">
                  <div className="bg-amber-50 text-amber-600 p-2 rounded-lg h-9 w-9 flex items-center justify-center shrink-0 border border-amber-100">
                    <ThermometerSun size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-705 uppercase tracking-wide">Climate & Landscape</h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{trivia.climate}</p>
                  </div>
                </div>

                {/* Engaging Fun Fact */}
                <div className="bg-slate-50/55 p-3 rounded-xl border border-slate-100 flex gap-3">
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg h-9 w-9 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-705 uppercase tracking-wide">Curious Fun Fact</h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{trivia.funFact}</p>
                  </div>
                </div>

                {/* Geographic History */}
                <div className="bg-slate-50/55 p-3 rounded-xl border border-slate-100 flex gap-3">
                  <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg h-9 w-9 flex items-center justify-center shrink-0 border border-indigo-100">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-705 uppercase tracking-wide">How Land Shaped History</h5>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{trivia.historicalFact}</p>
                  </div>
                </div>

                {/* 3 Famous Places to visit */}
                <div className="p-3 bg-slate-50/75 rounded-xl border border-slate-150">
                  <h5 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Compass size={14} className="text-amber-500" />
                    <span>Famous Places to Visit:</span>
                  </h5>
                  <div className="space-y-1.5">
                    {trivia.placesToVisit.map((place, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                        <span className="w-5 h-5 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center font-black border border-indigo-100">
                          {index + 1}
                        </span>
                        <span>{place}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trivia prompt warning if fallback active */}
                {trivia.fallback && (
                  <div className="p-2 border border-slate-150 rounded-lg text-[10px] text-slate-500 bg-slate-50 flex items-center gap-1.5 mt-2">
                    <Info size={12} className="text-slate-400 shrink-0" />
                    <span>Pre-loaded content active. Synthesize dynamic answers by loading your API Key.</span>
                  </div>
                )}

                {/* Quick Topic Prompts Chips for Student Chat trigger */}
                <div className="border-t border-slate-200 pt-3">
                  <h6 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-2 font-bold">
                    Ask Atlas About {selectedState.abbr}:
                  </h6>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleQuickQuestion("rivers")}
                      className="text-[10px] tracking-wide font-bold text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 px-2 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
                    >
                      🌊 Rivers & Lakes?
                    </button>
                    <button
                      onClick={() => handleQuickQuestion("animals")}
                      className="text-[10px] tracking-wide font-bold text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 px-2 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
                    >
                      🦌 Wild Animals?
                    </button>
                    <button
                      onClick={() => handleQuickQuestion("food")}
                      className="text-[10px] tracking-wide font-bold text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 px-2 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
                    >
                      🍛 Traditional Food?
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/40">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <Compass size={24} className="animate-spin-slow" />
                </div>
                <h5 className="font-bold text-slate-700 text-sm mb-1">Interactive Board Idle</h5>
                <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                  Take a state piece from the chest and snap it into the puzzle, or tap any solved state on the map to trigger geographer's notes!
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Conversational Chat Interface */
          <div className="flex-1 flex flex-col h-[380px] sm:h-[460px] md:h-[500px] justify-between">
            {/* Scrollable messages box */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 mb-3 custom-scrollbar">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[85%] ${
                    m.role === "user" ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono text-slate-400 capitalize">{m.role === "user" ? "Student" : "Atlas"}</span>
                    <span className="text-[9px] text-slate-400">{m.timestamp}</span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                        : "bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none font-sans font-medium"
                    }`}
                  >
                    {m.role === "user" ? (
                      <p className="font-bold text-xs sm:text-sm">{m.content}</p>
                    ) : (
                      <div className="space-y-1 text-slate-700">
                        {formatAssistantText(m.content)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {sendingMsg && (
                <div className="self-start flex flex-col items-start max-w-[80%] animate-pulse">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono text-slate-400 font-medium">Atlas is thinking</span>
                    <Loader2 size={10} className="animate-spin text-indigo-600" />
                  </div>
                  <div className="p-3 bg-slate-100 text-slate-500 border border-slate-200 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <span className="text-xs italic font-medium">Consulting dynamic maps...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick pre-made student helper prompts */}
            <div className="border-t border-slate-150 pt-2 mb-2">
              <span className="text-[9px] font-mono text-slate-400 block mb-1">Suggested Geography Queries:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => handleSendMessage("How do geography maps use lines of Latitude and Longitude?")}
                  className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 px-2 py-1 rounded border border-slate-200 shrink-0 select-none cursor-pointer"
                >
                  🌐 Lat & Long?
                </button>
                <button
                  onClick={() => handleSendMessage("What are the absolute biggest rivers in India and where do they end?")}
                  className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 px-2 py-1 rounded border border-slate-200 shrink-0 select-none cursor-pointer"
                >
                  💧 Rivers & Deltas?
                </button>
                <button
                  onClick={() => handleSendMessage("Why are mountain climates naturally colder and rainier than flat valleys?")}
                  className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 px-2 py-1 rounded border border-slate-200 shrink-0 select-none cursor-pointer"
                >
                  🏔️ Mountain climates?
                </button>
              </div>
            </div>

            {/* Text input control bar */}
            <div className="flex items-center gap-2 bg-slate-55 p-1.5 rounded-xl border border-slate-200 bg-slate-50">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                disabled={sendingMsg}
                placeholder="Ask Atlas any geography question..."
                className="flex-1 bg-transparent text-slate-705 text-xs px-2.5 py-1.5 focus:outline-none focus:ring-0 placeholder:text-slate-405 font-sans"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={sendingMsg || !inputMsg.trim()}
                className={`p-1.5 rounded-lg transition-all ${
                  inputMsg.trim() && !sendingMsg
                    ? "bg-indigo-650 bg-indigo-600 text-white hover:scale-105 active:scale-95"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
