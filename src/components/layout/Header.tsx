import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, Trophy, Code2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/context/AuthContext";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
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
            {/* Theme Switcher to the left of Accueil */}
            <div className="flex items-center gap-1">
              <Switch
                checked={theme === "light"}
                onCheckedChange={toggleTheme}
                aria-label="Toggle theme"
                className="relative"
              />
              {theme === "light" ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-400" />
              )}
            </div>
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
