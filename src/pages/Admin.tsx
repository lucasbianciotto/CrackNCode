// ============================================
// PAGE ADMIN - À RETIRER EN PRODUCTION
// ============================================
// Panel admin ultra complet pour la démonstration

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Trash2, Unlock, AlertTriangle, Zap, Trophy, Languages, MessageCircle, Wand2,
  Bell, Award, Film, User, Gamepad2, Settings, Sparkles, Plus, Minus, Play, X, Eye, EyeOff, Lock
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { languages as staticLanguages } from "@/data/languages";
import { isCheatModeEnabled, toggleCheatMode } from "@/utils/cheatMode";
import { addMessageToHistory } from "@/components/storytelling/CracknChat";
import { CracknMessage } from "@/components/storytelling/CracknCompanion";
import { CRACKN_DIALOGUES } from "@/data/storytelling";
import { getSuccessDefinition } from "@/data/achievements";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const ADMIN_PASSWORD = "admin"; // Mot de passe admin pour la présentation

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [completingLanguage, setCompletingLanguage] = useState<string | null>(null);
  const [cheatMode, setCheatMode] = useState(false);
  
  // États pour les différentes sections
  const [xpAmount, setXpAmount] = useState(100);
  const [selectedAchievement, setSelectedAchievement] = useState("/success1.png");
  const [cracknMessage, setCracknMessage] = useState("");
  const [cracknEmotion, setCracknEmotion] = useState<"happy" | "excited" | "worried" | "proud" | "determined" | "cheering">("happy");
  const [notificationText, setNotificationText] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error" | "info" | "warning">("success");
  const [selectedLanguage, setSelectedLanguage] = useState("html");
  const [selectedLevel, setSelectedLevel] = useState(1);

  // Vérifier si l'utilisateur est déjà authentifié (session)
  useEffect(() => {
    const adminAuth = sessionStorage.getItem("admin_authenticated");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setPasswordError(false);
      toast.success("Accès admin autorisé !");
    } else {
      setPasswordError(true);
      toast.error("Mot de passe incorrect !");
      setPassword("");
    }
  };

  useEffect(() => {
    setCheatMode(isCheatModeEnabled());
  }, []);

  const handleToggleCheatMode = () => {
    const newState = toggleCheatMode();
    setCheatMode(newState);
    toast.success(newState ? "✨ Mode cheat activé !" : "Mode cheat désactivé.");
  };

  const handleReset = async () => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    if (!confirm("⚠️ ATTENTION : Cette action va supprimer TOUTES vos données. Êtes-vous sûr ?")) {
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/reset-user`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Utilisateur reset avec succès !");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("Erreur lors du reset");
      }
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Erreur lors du reset");
    } finally {
      setIsResetting(false);
    }
  };

  const handleUnlockAll = async () => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    if (!confirm("Débloquer tous les langages à 100% ?")) {
      return;
    }

    setIsUnlocking(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/unlock-all`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Tous les langages débloqués ! ${data.totalXP} XP accordés.`);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("Erreur lors du déblocage");
      }
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Erreur lors du déblocage");
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleCompleteLanguage = async (languageId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    const language = staticLanguages.find(l => l.id === languageId);
    if (!language) {
      toast.error("Langage introuvable");
      return;
    }

    setCompletingLanguage(languageId);
    try {
      const XP_PER_LEVEL = [100, 150, 200, 200, 250];
      
      for (let levelNumber = 1; levelNumber <= 5; levelNumber++) {
        const res = await fetch(`${API_BASE}/api/languages/${languageId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            levelNumber,
            xpReward: XP_PER_LEVEL[levelNumber - 1],
            levelTitle: `${language.name} - Niveau ${levelNumber}`,
          }),
        });

        if (!res.ok) throw new Error(`Erreur niveau ${levelNumber}`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      toast.success(`${language.name} complété à 100% !`);
      setTimeout(() => navigate(`/language/${languageId}`), 1500);
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Erreur lors de la complétion");
    } finally {
      setCompletingLanguage(null);
    }
  };

  // Fonctions pour déclencher les fonctionnalités
  const triggerNotification = () => {
    if (!notificationText.trim()) {
      toast.error("Veuillez entrer un message");
      return;
    }

    switch (notificationType) {
      case "success":
        toast.success(notificationText);
        break;
      case "error":
        toast.error(notificationText);
        break;
      case "info":
        toast.info(notificationText);
        break;
      case "warning":
        toast.warning(notificationText);
        break;
    }
    setNotificationText("");
  };

  const triggerAchievement = async (achievementImage?: string) => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    const imageToAward = achievementImage || selectedAchievement;

    try {
      const res = await fetch(`${API_BASE}/api/admin/award-achievement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ image: imageToAward }),
      });

      if (res.ok) {
        const data = await res.json();
        const def = getSuccessDefinition(imageToAward);
        if (data.wasAlreadyUnlocked) {
          toast.info(`Succès déjà débloqué : ${def?.titre || imageToAward}`);
        } else {
          toast.success(`🎉 Succès débloqué ! ${def?.titre || imageToAward}`);
          // Déclenche aussi une notification de succès avec le titre
          setTimeout(() => {
            toast.success(`🎉 Nouveau succès débloqué ! ${def?.titre || imageToAward}`);
          }, 500);
        }
      } else {
        toast.error("Erreur lors de l'attribution du succès");
      }
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Erreur lors de l'attribution du succès");
    }
  };

  const triggerCracknMessage = () => {
    if (!cracknMessage.trim()) {
      toast.error("Veuillez entrer un message");
      return;
    }

    const message: CracknMessage = {
      id: `admin-${Date.now()}`,
      text: cracknMessage,
      emotion: cracknEmotion,
      duration: 0, // Permanent jusqu'à fermeture
    };

    addMessageToHistory(message);
    toast.success("Message de Crack'n ajouté !");
    setCracknMessage("");
  };

  const triggerQuickCracknMessage = (key: keyof typeof CRACKN_DIALOGUES) => {
    const dialogue = CRACKN_DIALOGUES[key];
    if (!dialogue) return;

    const message: CracknMessage = {
      id: `admin-quick-${key}-${Date.now()}`,
      text: dialogue.text,
      emotion: dialogue.emotion,
      duration: 5000,
    };

    addMessageToHistory(message);
    toast.success(`Message "${key}" ajouté !`);
  };

  const addXP = async (amount: number) => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/add-xp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount }),
      });

      if (res.ok) {
        toast.success(`+${amount} XP ajoutés !`);
        setTimeout(() => window.location.reload(), 500);
      } else {
        toast.error("Erreur lors de l'ajout d'XP");
      }
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Erreur lors de l'ajout d'XP");
    }
  };

  const completeLevel = async () => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    try {
      const XP_PER_LEVEL = [100, 150, 200, 200, 250];
      const xpReward = XP_PER_LEVEL[selectedLevel - 1] || 100;

      const res = await fetch(`${API_BASE}/api/languages/${selectedLanguage}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          levelNumber: selectedLevel,
          xpReward,
          levelTitle: `${staticLanguages.find(l => l.id === selectedLanguage)?.name} - Niveau ${selectedLevel}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Niveau ${selectedLevel} complété ! +${xpReward} XP`);
        if (data.newAchievements && data.newAchievements.length > 0) {
          setTimeout(() => {
            data.newAchievements.forEach((achievement: string) => {
              toast.success(`🎉 Nouveau succès débloqué ! ${achievement}`);
            });
          }, 500);
        }
        setTimeout(() => navigate(`/language/${selectedLanguage}`), 1000);
      } else {
        toast.error("Erreur lors de la complétion du niveau");
      }
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Erreur lors de la complétion du niveau");
    }
  };

  const triggerCinematic = () => {
    // Force l'intro cinématique
    localStorage.removeItem("crackncode_intro_seen");
    window.location.href = "/?intro=true";
  };

  // Écran de connexion admin
  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Card className="p-8 max-w-md w-full border-primary/50 bg-primary/5">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/20 border-2 border-primary/50">
                  <Lock className="w-12 h-12 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Accès Admin</h1>
                <p className="text-sm text-muted-foreground">
                  Veuillez entrer le mot de passe administrateur
                </p>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(false);
                      }}
                      placeholder="Entrez le mot de passe"
                      className={passwordError ? "border-destructive" : ""}
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-destructive">Mot de passe incorrect</p>
                  )}
                </div>
                <Button type="submit" className="w-full" size="lg">
                  <Lock className="w-4 h-4 mr-2" />
                  Se connecter
                </Button>
              </form>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page.</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Retour à l'accueil
          </Button>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Panel Admin - Démonstration</h1>
          </div>
        </div>

        <Card className="p-6 border-destructive/50 bg-destructive/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">⚠️ Page Admin - Tests uniquement</h2>
              <p className="text-sm text-muted-foreground">
                Cette page est destinée aux tests et démonstrations. Retirez-la avant la mise en production.
              </p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="quick">⚡ Rapide</TabsTrigger>
            <TabsTrigger value="notifications">🔔 Notifications</TabsTrigger>
            <TabsTrigger value="achievements">🏆 Succès</TabsTrigger>
            <TabsTrigger value="crackn">🐙 Crack'n</TabsTrigger>
            <TabsTrigger value="progression">📈 Progression</TabsTrigger>
            <TabsTrigger value="advanced">⚙️ Avancé</TabsTrigger>
          </TabsList>

          {/* Tab Rapide */}
          <TabsContent value="quick" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-4 border-primary/50 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Ajouter XP</h3>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => addXP(100)} variant="outline">+100</Button>
                  <Button size="sm" onClick={() => addXP(500)} variant="outline">+500</Button>
                  <Button size="sm" onClick={() => addXP(1000)} variant="outline">+1000</Button>
                </div>
              </Card>

              <Card className="p-4 border-green-500/50 bg-green-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-green-500" />
                  <h3 className="font-bold text-foreground">Succès Rapide</h3>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => triggerAchievement("/success1.png")} variant="outline">Succès 1</Button>
                  <Button size="sm" onClick={() => triggerAchievement("/success2.png")} variant="outline">Succès 2</Button>
                  <Button size="sm" onClick={() => triggerAchievement("/success3.png")} variant="outline">Succès 3</Button>
                </div>
              </Card>

              <Card className="p-4 border-cyan-500/50 bg-cyan-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-5 h-5 text-cyan-500" />
                  <h3 className="font-bold text-foreground">Crack'n Rapide</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" onClick={() => triggerQuickCracknMessage("welcome")} variant="outline">Bienvenue</Button>
                  <Button size="sm" onClick={() => triggerQuickCracknMessage("language_complete")} variant="outline">Langage complété</Button>
                </div>
              </Card>

              <Card className="p-4 border-purple-500/50 bg-purple-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Film className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-foreground">Cinématique</h3>
                </div>
                <Button size="sm" onClick={triggerCinematic} variant="outline" className="w-full">
                  Lancer l'intro
                </Button>
              </Card>

              <Card className="p-4 border-orange-500/50 bg-orange-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Gamepad2 className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-foreground">Compléter Niveau</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {staticLanguages.map(lang => (
                          <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedLevel.toString()} onValueChange={(v) => setSelectedLevel(parseInt(v))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map(lvl => (
                          <SelectItem key={lvl} value={lvl.toString()}>N{lvl}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button size="sm" onClick={completeLevel} variant="outline" className="w-full">
                    Compléter
                  </Button>
                </div>
              </Card>

              <Card className="p-4 border-red-500/50 bg-red-500/5">
                <div className="flex items-center gap-2 mb-3">
                  <Wand2 className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-foreground">Mode Cheat</h3>
                </div>
                <Button 
                  size="sm" 
                  onClick={handleToggleCheatMode} 
                  variant={cheatMode ? "default" : "outline"}
                  className={`w-full ${cheatMode ? "bg-cyan-500 hover:bg-cyan-600" : ""}`}
                >
                  {cheatMode ? "Désactiver" : "Activer"}
                </Button>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Notifications */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Déclencher des Notifications</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notification-type">Type de notification</Label>
                  <Select value={notificationType} onValueChange={(v: any) => setNotificationType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">✅ Succès</SelectItem>
                      <SelectItem value="error">❌ Erreur</SelectItem>
                      <SelectItem value="info">ℹ️ Info</SelectItem>
                      <SelectItem value="warning">⚠️ Avertissement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notification-text">Message</Label>
                  <Textarea
                    id="notification-text"
                    placeholder="Entrez le message de la notification..."
                    value={notificationText}
                    onChange={(e) => setNotificationText(e.target.value)}
                  />
                </div>
                <Button onClick={triggerNotification} className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Déclencher la notification
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Tab Succès */}
          <TabsContent value="achievements" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Débloquer des Succès</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="achievement-select">Sélectionner un succès</Label>
                  <Select value={selectedAchievement} onValueChange={setSelectedAchievement}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="/success1.png">Succès 1 - Premier défi</SelectItem>
                      <SelectItem value="/success2.png">Succès 2 - 10 défis</SelectItem>
                      <SelectItem value="/success3.png">Succès 3 - 25 défis</SelectItem>
                      <SelectItem value="/success4.png">Succès 4 - 1000 XP</SelectItem>
                      <SelectItem value="/sucess5.png">Succès 5 - 5000 XP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={triggerAchievement} className="w-full">
                  <Award className="w-4 h-4 mr-2" />
                  Débloquer ce succès
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Tab Crack'n */}
          <TabsContent value="crackn" className="space-y-4">
            <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Messages de Crack'n</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="crackn-emotion">Émotion</Label>
                  <Select value={cracknEmotion} onValueChange={(v: any) => setCracknEmotion(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="happy">😊 Heureux</SelectItem>
                      <SelectItem value="excited">🤩 Excité</SelectItem>
                      <SelectItem value="worried">😟 Inquiet</SelectItem>
                      <SelectItem value="proud">😎 Fier</SelectItem>
                      <SelectItem value="determined">💪 Déterminé</SelectItem>
                      <SelectItem value="cheering">🎉 Encourageant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="crackn-message">Message personnalisé</Label>
                  <Textarea
                    id="crackn-message"
                    placeholder="Entrez le message de Crack'n..."
                    value={cracknMessage}
                    onChange={(e) => setCracknMessage(e.target.value)}
                  />
                </div>
                <Button onClick={triggerCracknMessage} className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Envoyer le message
                </Button>
                <Separator />
              <div>
                  <Label>Messages rapides</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button size="sm" onClick={() => triggerQuickCracknMessage("welcome")} variant="outline">Bienvenue</Button>
                    <Button size="sm" onClick={() => triggerQuickCracknMessage("first_level")} variant="outline">Premier niveau</Button>
                    <Button size="sm" onClick={() => triggerQuickCracknMessage("level_complete")} variant="outline">Niveau complété</Button>
                    <Button size="sm" onClick={() => triggerQuickCracknMessage("language_unlock")} variant="outline">Langage débloqué</Button>
                    <Button size="sm" onClick={() => triggerQuickCracknMessage("language_complete")} variant="outline">Langage complété</Button>
                    <Button size="sm" onClick={() => triggerQuickCracknMessage("boss_unlock")} variant="outline">Boss débloqué</Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab Progression */}
          <TabsContent value="progression" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Gestion XP</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="xp-amount">Montant d'XP</Label>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => setXpAmount(Math.max(0, xpAmount - 100))}>
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        id="xp-amount"
                        type="number"
                        value={xpAmount}
                        onChange={(e) => setXpAmount(parseInt(e.target.value) || 0)}
                        className="text-center"
                      />
                      <Button size="sm" variant="outline" onClick={() => setXpAmount(xpAmount + 100)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={() => addXP(xpAmount)} className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Ajouter {xpAmount} XP
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Compléter un Niveau</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Langage</Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {staticLanguages.map(lang => (
                          <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Niveau</Label>
                    <Select value={selectedLevel.toString()} onValueChange={(v) => setSelectedLevel(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map(lvl => (
                          <SelectItem key={lvl} value={lvl.toString()}>Niveau {lvl}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={completeLevel} className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Compléter ce niveau
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="p-6 border-primary/50 bg-primary/5">
              <div className="flex items-center gap-3 mb-4">
                <Languages className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Compléter un Langage Complet</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {staticLanguages.map((lang) => (
                  <Button
                    key={lang.id}
                    onClick={() => handleCompleteLanguage(lang.id)}
                    disabled={completingLanguage !== null}
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-3"
                  >
                    <span className="text-2xl">{lang.icon}</span>
                    <span className="text-xs font-medium">{lang.name}</span>
                    {completingLanguage === lang.id && (
                      <span className="text-xs text-muted-foreground">En cours...</span>
                    )}
                  </Button>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Tab Avancé */}
          <TabsContent value="advanced" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6 border-destructive/50">
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 className="w-6 h-6 text-destructive" />
                  <h3 className="text-lg font-bold text-foreground">Reset Utilisateur</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
                  Supprime toutes les données : progression, XP, succès, activités, avatar.
            </p>
            <Button
              onClick={handleReset}
              disabled={isResetting}
              variant="destructive"
              className="w-full"
            >
              {isResetting ? "Reset en cours..." : "Reset Complet"}
            </Button>
          </Card>

              <Card className="p-6 border-green-500/50">
            <div className="flex items-center gap-3 mb-4">
                  <Unlock className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-bold text-foreground">Débloquer Tout</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
                  Complète tous les langages à 100% et débloque le combat contre le Kraken.
            </p>
            <Button
              onClick={handleUnlockAll}
              disabled={isUnlocking}
                  className="w-full bg-green-500 hover:bg-green-600"
            >
              {isUnlocking ? "Déblocage en cours..." : "Débloquer Tout à 100%"}
            </Button>
          </Card>
        </div>

            <Card className="p-6 border-cyan-500/50 bg-cyan-500/5">
              <div className="flex items-center gap-3 mb-4">
                <Wand2 className="w-6 h-6 text-cyan-500" />
                <h3 className="text-lg font-bold text-foreground">Mode Cheat - Présentation</h3>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-cyan-500/30">
                <div>
                  <p className="font-medium text-foreground mb-1">
                    Mode Cheat {cheatMode ? "Activé ✨" : "Désactivé"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {cheatMode 
                      ? "Les boutons 'Remplir automatiquement' sont disponibles dans tous les mini-jeux"
                      : "Activez pour voir les boutons de remplissage automatique dans les mini-jeux"}
                  </p>
                </div>
                <Button
                  onClick={handleToggleCheatMode}
                  variant={cheatMode ? "default" : "outline"}
                  className={cheatMode ? "bg-cyan-500 hover:bg-cyan-600" : ""}
                >
                  {cheatMode ? "Désactiver" : "Activer"}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
