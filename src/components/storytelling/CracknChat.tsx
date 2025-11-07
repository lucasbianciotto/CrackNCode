import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { X, MessageCircle, ChevronDown, ChevronUp, Sparkles, Minimize2, Maximize2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CracknMessage } from "./CracknCompanion";
import { toast } from "sonner";

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
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
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

  // Ferme automatiquement les notifications toast quand on ouvre le chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Ferme toutes les notifications toast après un court délai
      // pour laisser le temps à l'utilisateur de voir qu'un message est arrivé
      const timer = setTimeout(() => {
        // Ferme toutes les notifications toast de sonner
        toast.dismiss();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

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

  // Scroll automatique vers le haut (nouveaux messages) quand un nouveau message arrive
  useEffect(() => {
    if (isOpen && scrollViewportRef.current) {
      const viewport = scrollViewportRef.current;
      // Scroll seulement si on est déjà près du haut (pour ne pas interrompre la lecture)
      const isNearTop = viewport.scrollTop < 150;
      if (isNearTop || isAtBottom) {
        setTimeout(() => {
          viewport.scrollTo({
            top: 0,
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
        // Avec l'ordre inversé, le haut contient les nouveaux messages
        const isScrolledFromTop = scrollTop > 100;
        const isScrolledFromBottom = scrollHeight - scrollTop - clientHeight > 150;
        
        // Inverser : scrollToTop va vers le haut (nouveaux messages), scrollToBottom vers le bas (anciens)
        setShowScrollToTop(isScrolledFromTop);
        setShowScrollToBottom(isScrolledFromBottom);
        setIsAtBottom(scrollTop < 100); // Près du haut = à jour avec les nouveaux messages
      }
    };

    const viewport = scrollViewportRef.current;
    viewport?.addEventListener("scroll", handleScroll);
    handleScroll(); // Vérifie immédiatement

    return () => {
      viewport?.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, messageHistory]);

  // Fonction pour remonter en haut (nouveaux messages)
  const scrollToTop = useCallback(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      setIsAtBottom(true);
    }
  }, []);

  // Fonction pour descendre en bas (anciens messages)
  const scrollToBottom = useCallback(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: "smooth"
      });
      setIsAtBottom(false);
    }
  }, []);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  // Tri inverse : dernier message en haut (timestamp décroissant)
  const sortedMessages = [...messageHistory].sort((a, b) => 
    (b.timestamp || 0) - (a.timestamp || 0)
  );

  // Le dernier message est maintenant le premier dans la liste triée
  const latestMessage = sortedMessages[0];
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

  // Groupe les messages par date (ordre inversé : nouveaux en premier)
  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: (CracknMessage & { timestamp?: number })[] }[] = [];
    let currentDate = "";
    
    // Parcourir les messages triés par timestamp décroissant (nouveaux en premier)
    sortedMessages.forEach((msg) => {
      if (!msg.timestamp) return;
      
      const dateKey = formatDateSeparator(msg.timestamp);
      
      if (dateKey !== currentDate) {
        currentDate = dateKey;
        // Ajouter le nouveau groupe au début pour garder l'ordre chronologique inversé
        groups.unshift({ date: dateKey, messages: [] });
      }
      
      // Ajouter le message au premier groupe (le plus récent)
      groups[0].messages.push(msg);
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
          className="rounded-full w-16 h-16 bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl border-4 border-primary-foreground/20 animate-float"
        >
          <div className="flex flex-col items-center gap-1 relative">
            <img 
              src={latestEmotionImage} 
              alt={latestEmotion}
              className="w-10 h-10 object-contain"
            />
            {sortedMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground font-bold">
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
      <Card className="w-96 h-[600px] flex flex-col bg-gradient-to-br from-card/95 to-card/95 border-2 border-primary/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-primary/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg border-2 border-primary-foreground/30 animate-float overflow-hidden">
              <img 
                src={latestEmotionImage} 
                alt={latestEmotion}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">Crack'n</span>
                <MessageCircle className="w-4 h-4 text-primary" />
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
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
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
                      const emotionImage = getEmotionImage(emotion);
                      const isRecent = isRecentMessage(msg.timestamp);
                      // Le dernier message est maintenant le premier dans le premier groupe
                      const isLatest = groupIndex === 0 && msgIndex === 0;
                      
                      return (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-all relative ${
                            isLatest 
                              ? "bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/40 animate-fade-in shadow-md" 
                              : isRecent
                              ? "bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
                              : "bg-card/50 border border-border/50"
                          }`}
                        >
                          {/* Indicateur de nouveau message */}
                          {isRecent && !isLatest && (
                            <div className="absolute -left-2 top-3 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          )}
                          
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-md border border-primary-foreground/30 overflow-hidden ${
                              isRecent ? "ring-2 ring-primary/50" : ""
                            }`}>
                              <img 
                                src={emotionImage} 
                                alt={emotion}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-primary">Crack'n</span>
                              {msg.timestamp && (
                                <span className={`text-xs ${isRecent ? "text-primary font-medium" : "text-muted-foreground"}`}>
                                  {formatTime(msg.timestamp)}
                                </span>
                              )}
                              {isRecent && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
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
            
            {/* Bouton pour remonter en haut (nouveaux messages) */}
            {showScrollToTop && (
              <Button
                onClick={scrollToTop}
                size="sm"
                className="absolute top-4 right-4 rounded-full w-10 h-10 p-0 bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg z-10"
                title="Voir les nouveaux messages"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            )}
            
            {/* Bouton pour descendre en bas (anciens messages) */}
            {showScrollToBottom && (
              <Button
                onClick={scrollToBottom}
                size="sm"
                className="absolute bottom-4 right-4 rounded-full w-10 h-10 p-0 bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg z-10"
                title="Voir les anciens messages"
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Preview du dernier message si fermé */}
        {!isOpen && latestMessage && (
          <div className="p-4 border-t border-primary/30">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-md border border-primary-foreground/30 overflow-hidden">
                  <img 
                    src={latestEmotionImage} 
                    alt={latestEmotion}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary">Dernier message</span>
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

