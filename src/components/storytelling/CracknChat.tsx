import { useState, useEffect, useRef, useCallback } from "react";
import { X, MessageCircle, ChevronDown, ChevronUp, Sparkles, Minimize2, Maximize2, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CracknMessage } from "./CracknCompanion";

// Mapping des émotions vers les images
const getEmotionImage = (emotion: string): string => {
  const emotionMap: Record<string, string> = {
    happy: "/kraken/happy.png",
    excited: "/kraken/excited.png",
    worried: "/kraken/worried.png",
    proud: "/kraken/proud.png",
    determined: "/kraken/determined.png",
    cheering: "/kraken/cheering.png",
  };
  return emotionMap[emotion] || "/kraken/happy.png";
};

interface CracknChatProps {
  messages: CracknMessage[];
  onAddMessage?: (message: CracknMessage) => void;
  position?: "bottom-right" | "bottom-left";
}

// Stockage global de l'historique des messages
let globalMessageHistory: (CracknMessage & { timestamp: number })[] = [];

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
      const isNearBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 100;
      if (isNearBottom) {
        setTimeout(() => {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: "smooth"
          });
        }, 100);
      }
    }
  }, [messageHistory, isOpen]);

  // Vérifie si on doit afficher le bouton "remonter"
  useEffect(() => {
    if (!isOpen || !scrollViewportRef.current) {
      setShowScrollToTop(false);
      return;
    }

    const handleScroll = () => {
      const viewport = scrollViewportRef.current;
      if (viewport) {
        const isScrolled = viewport.scrollTop > 100;
        setShowScrollToTop(isScrolled);
      }
    };

    const viewport = scrollViewportRef.current;
    viewport?.addEventListener("scroll", handleScroll);
    handleScroll(); // Vérifie immédiatement

    return () => {
      viewport?.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  // Fonction pour remonter en haut
  const scrollToTop = useCallback(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
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
  const latestEmotionImage = getEmotionImage(latestEmotion);

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

  if (isMinimized) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50 animate-fade-in`}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-2xl border-4 border-white/20 animate-float"
        >
          <div className="flex flex-col items-center gap-1 relative">
            <img 
              src={latestEmotionImage} 
              alt={latestEmotion}
              className="w-10 h-10 object-contain"
            />
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
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 animate-float overflow-hidden">
              <img 
                src={latestEmotionImage} 
                alt={latestEmotion}
                className="w-full h-full object-contain p-1"
              />
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
                sortedMessages.map((msg, index) => {
                  const emotion = msg.emotion || "happy";
                  const emotionImage = getEmotionImage(emotion);
                  const isLatest = index === sortedMessages.length - 1;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                        isLatest 
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 animate-fade-in" 
                          : "bg-background/50 border border-border/50"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md border border-white/30 overflow-hidden">
                          <img 
                            src={emotionImage} 
                            alt={emotion}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">Crack'n</span>
                          {msg.timestamp && (
                            <span className="text-xs text-muted-foreground">
                              {formatTime(msg.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Bouton pour remonter en haut */}
            {showScrollToTop && (
              <Button
                onClick={scrollToTop}
                size="sm"
                className="absolute bottom-4 right-4 rounded-full w-10 h-10 p-0 bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg z-10"
                title="Remonter en haut"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Preview du dernier message si fermé */}
        {!isOpen && latestMessage && (
          <div className="p-4 border-t border-cyan-300/30">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md border border-white/30 overflow-hidden">
                  <img 
                    src={latestEmotionImage} 
                    alt={latestEmotion}
                    className="w-full h-full object-contain p-1"
                  />
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

