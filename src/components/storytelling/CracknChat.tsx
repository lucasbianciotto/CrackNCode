import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { X, MessageCircle, ChevronDown, ChevronUp, Sparkles, Minimize2, Maximize2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CracknMessage } from "./CracknCompanion";

const CRACKN_EMOTIONS = {
  happy: "😊",
  excited: "🤩",
  worried: "😟",
  proud: "😎",
  determined: "💪",
  cheering: "🎉",
};

interface CracknChatProps {
  messages: CracknMessage[];
  onAddMessage?: (message: CracknMessage) => void;
  position?: "bottom-right" | "bottom-left";
}

// Stockage global de l'historique des messages
let globalMessageHistory: CracknMessage[] = [];

export function addMessageToHistory(message: CracknMessage) {
  // Évite les doublons
  if (!globalMessageHistory.find(m => m.id === message.id)) {
    globalMessageHistory.push({
      ...message,
      timestamp: Date.now(),
    } as CracknMessage & { timestamp: number });
    
    // Limite à 50 messages maximum
    if (globalMessageHistory.length > 50) {
      globalMessageHistory = globalMessageHistory.slice(-50);
    }
  }
}

export function getMessageHistory(): (CracknMessage & { timestamp: number })[] {
  return globalMessageHistory;
}

export function CracknChat({ 
  messages = [],
  onAddMessage,
  position = "bottom-right"
}: CracknChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messageHistory, setMessageHistory] = useState<(CracknMessage & { timestamp?: number })[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charge l'historique au montage
  useEffect(() => {
    const history = getMessageHistory();
    setMessageHistory(history);
    // Ouvre le chat si c'est le premier chargement et qu'il y a des messages
    if (!hasInitialized && history.length > 0) {
      setIsOpen(true);
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  // Ajoute les nouveaux messages à l'historique
  useEffect(() => {
    messages.forEach(msg => {
      if (msg) {
        // Vérifie dans l'historique global pour éviter les doublons
        const globalHistory = getMessageHistory();
        const existingMsg = globalHistory.find(m => m.id === msg.id);
        if (!existingMsg) {
          const newMsg = { ...msg, timestamp: Date.now() };
          addMessageToHistory(newMsg);
          setMessageHistory(prev => {
            // Évite les doublons
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          // Ouvre automatiquement le chat pour les nouveaux messages
          if (!isMinimized) {
            setIsOpen(true);
          }
          onAddMessage?.(newMsg);
        }
      }
    });
  }, [messages, onAddMessage, isMinimized]);

  // Scroll automatique vers le bas quand un nouveau message arrive
  useEffect(() => {
    if (isOpen && scrollViewportRef.current) {
      const viewport = scrollViewportRef.current;
      // Scroll seulement si on est déjà près du bas (pour ne pas interrompre la lecture)
      const isNearBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 150;
      if (isNearBottom || isAtBottom) {
        setTimeout(() => {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: "smooth"
          });
          setIsAtBottom(true);
        }, 100);
      }
    }
  }, [messageHistory, isOpen, isAtBottom]);

  // Vérifie la position du scroll et affiche les boutons appropriés
  useEffect(() => {
    if (!isOpen || !scrollViewportRef.current) {
      setShowScrollToTop(false);
      setShowScrollToBottom(false);
      return;
    }

    const handleScroll = () => {
      const viewport = scrollViewportRef.current;
      if (viewport) {
        const scrollTop = viewport.scrollTop;
        const scrollHeight = viewport.scrollHeight;
        const clientHeight = viewport.clientHeight;
        const isScrolledFromTop = scrollTop > 100;
        const isScrolledFromBottom = scrollHeight - scrollTop - clientHeight > 150;
        
        setShowScrollToTop(isScrolledFromTop);
        setShowScrollToBottom(isScrolledFromBottom);
        setIsAtBottom(!isScrolledFromBottom);
      }
    };

    const viewport = scrollViewportRef.current;
    viewport?.addEventListener("scroll", handleScroll);
    handleScroll(); // Vérifie immédiatement

    return () => {
      viewport?.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, messageHistory]);

  // Fonction pour remonter en haut
  const scrollToTop = useCallback(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, []);

  // Fonction pour descendre en bas
  const scrollToBottom = useCallback(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: "smooth"
      });
      setIsAtBottom(true);
    }
  }, []);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  const sortedMessages = [...messageHistory].sort((a, b) => 
    (a.timestamp || 0) - (b.timestamp || 0)
  );

  const latestMessage = sortedMessages[sortedMessages.length - 1];
  const latestEmotion = latestMessage?.emotion || "happy";
  const latestEmoji = CRACKN_EMOTIONS[latestEmotion];

  // Format de date pour les messages
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  // Format de date pour les séparateurs (aujourd'hui, hier, date)
  const formatDateSeparator = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.getTime() === today.getTime()) {
      return "Aujourd'hui";
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return "Hier";
    } else {
      return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    }
  };

  // Groupe les messages par date
  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: (CracknMessage & { timestamp?: number })[] }[] = [];
    let currentDate = "";
    
    sortedMessages.forEach((msg) => {
      if (!msg.timestamp) return;
      
      const dateKey = formatDateSeparator(msg.timestamp);
      
      if (dateKey !== currentDate) {
        currentDate = dateKey;
        groups.push({ date: dateKey, messages: [] });
      }
      
      groups[groups.length - 1].messages.push(msg);
    });
    
    return groups;
  }, [sortedMessages]);

  // Détermine si un message est récent (moins de 5 minutes)
  const isRecentMessage = (timestamp?: number) => {
    if (!timestamp) return false;
    const diff = Date.now() - timestamp;
    return diff < 5 * 60 * 1000; // 5 minutes
  };

  if (isMinimized) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50 animate-fade-in`}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-2xl border-4 border-white/20 animate-float"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">{latestEmoji}</span>
            {sortedMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                {sortedMessages.length > 9 ? "9+" : sortedMessages.length}
              </span>
            )}
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 animate-slide-up`}>
      <Card className="w-96 h-[600px] flex flex-col bg-gradient-to-br from-cyan-50/95 to-blue-50/95 dark:from-cyan-950/95 dark:to-blue-950/95 border-2 border-cyan-300/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-300/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 animate-float">
              <span className="text-2xl">{latestEmoji}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-700 dark:text-cyan-300">Crack'n</span>
                <MessageCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <p className="text-xs text-muted-foreground">
                {sortedMessages.length} {sortedMessages.length > 1 ? "messages" : "message"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-8 w-8 p-0"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="h-8 w-8 p-0"
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setIsMinimized(true);
              }}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        {isOpen && (
          <div className="flex-1 overflow-hidden relative flex flex-col">
            <div 
              ref={scrollViewportRef}
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 crackn-chat-scroll"
              style={{ 
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(155, 155, 155, 0.5) transparent"
              }}
            >
              {sortedMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                  <p className="text-sm">Aucun message pour le moment</p>
                  <p className="text-xs mt-1">Crack'n apparaîtra ici quand il aura quelque chose à te dire !</p>
                </div>
              ) : (
                groupedMessages.map((group, groupIndex) => (
                  <div key={group.date} className="space-y-3">
                    {/* Séparateur de date */}
                    {groupIndex > 0 && (
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-border/50"></div>
                        <span className="text-xs font-medium text-muted-foreground px-2">
                          {group.date}
                        </span>
                        <div className="flex-1 h-px bg-border/50"></div>
                      </div>
                    )}
                    
                    {/* Messages du groupe */}
                    {group.messages.map((msg, msgIndex) => {
                      const emotion = msg.emotion || "happy";
                      const emoji = CRACKN_EMOTIONS[emotion];
                      const isRecent = isRecentMessage(msg.timestamp);
                      const isLatest = groupIndex === groupedMessages.length - 1 && msgIndex === group.messages.length - 1;
                      
                      return (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-all relative ${
                            isLatest 
                              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/40 animate-fade-in shadow-md" 
                              : isRecent
                              ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20"
                              : "bg-background/50 border border-border/50"
                          }`}
                        >
                          {/* Indicateur de nouveau message */}
                          {isRecent && !isLatest && (
                            <div className="absolute -left-2 top-3 w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                          )}
                          
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md border border-white/30 ${
                              isRecent ? "ring-2 ring-cyan-400/50" : ""
                            }`}>
                              <span className="text-lg">{emoji}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">Crack'n</span>
                              {msg.timestamp && (
                                <span className={`text-xs ${isRecent ? "text-cyan-600 dark:text-cyan-400 font-medium" : "text-muted-foreground"}`}>
                                  {formatTime(msg.timestamp)}
                                </span>
                              )}
                              {isRecent && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold">
                                  Nouveau
                                </span>
                              )}
                            </div>
                            <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                              isRecent ? "text-foreground font-medium" : "text-foreground"
                            }`}>
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Bouton pour remonter en haut */}
            {showScrollToTop && (
              <Button
                onClick={scrollToTop}
                size="sm"
                className="absolute top-4 right-4 rounded-full w-10 h-10 p-0 bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg z-10"
                title="Remonter en haut"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            )}
            
            {/* Bouton pour descendre en bas */}
            {showScrollToBottom && (
              <Button
                onClick={scrollToBottom}
                size="sm"
                className="absolute bottom-4 right-4 rounded-full w-10 h-10 p-0 bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg z-10"
                title="Voir les derniers messages"
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Preview du dernier message si fermé */}
        {!isOpen && latestMessage && (
          <div className="p-4 border-t border-cyan-300/30">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md border border-white/30">
                  <span className="text-lg">{latestEmoji}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">Dernier message</span>
                  {latestMessage.timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {formatTime(latestMessage.timestamp)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                  {latestMessage.text}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

