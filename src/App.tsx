import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { GameIntro } from "@/components/intro/GameIntro";
import Home from "./pages/Home";
import Language from "./pages/Language";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Level from "@/pages/Level.tsx";
import Login from "./pages/Login";

const queryClient = new QueryClient();

export const INTRO_SEEN_KEY = "crackncode_intro_seen";

// Fonction utilitaire pour réinitialiser l'intro
export const resetIntro = () => {
  localStorage.removeItem(INTRO_SEEN_KEY);
  window.location.reload();
};

const AppContent = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check URL parameter to force intro
    const urlParams = new URLSearchParams(window.location.search);
    const forceIntro = urlParams.get("intro") === "true";
    
    if (forceIntro) {
      localStorage.removeItem(INTRO_SEEN_KEY);
      setShowIntro(true);
      setIsChecking(false);
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    // Check if intro has been seen
    const introSeen = localStorage.getItem(INTRO_SEEN_KEY);
    if (!introSeen) {
      setShowIntro(true);
    }
    setIsChecking(false);
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem(INTRO_SEEN_KEY, "true");
    setShowIntro(false);
  };

  if (isChecking) {
    return null; // Or a loading spinner
  }

  if (showIntro) {
    return <GameIntro onComplete={handleIntroComplete} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/language/:id" element={<Language />} />
        <Route path="/language/:id/level/:levelId" element={<Level />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
