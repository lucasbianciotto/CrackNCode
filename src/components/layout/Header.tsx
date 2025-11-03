import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, Trophy, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-bold text-xl"
          >
            <Code2 className="w-6 h-6 text-primary animate-pulse-glow" />
            <span className="gradient-text">Devlingo</span>
          </button>
          
          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Accueil</span>
            </Button>
            
            <Button
              variant={isActive("/leaderboard") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/leaderboard")}
              className="gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Classement</span>
            </Button>
            
            <Button
              variant={isActive("/profile") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/profile")}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </Button>
            {user ? (
              <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
                Se déconnecter
              </Button>
            ) : (
              <Button
                variant={isActive("/login") ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/login")}
                className="gap-2"
              >
                Se connecter
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
