import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, Lightbulb, Code2, Eye, Sparkles, Zap, Trophy, Target, Wand2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { LevelCompleteCinematic } from "@/components/storytelling/LevelCompleteCinematic";
import { isCheatModeEnabled } from "@/utils/cheatMode";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

type HtmlGoal = {
  id: string;
  description: string;
  selector: string; // CSS selector à vérifier
  minTextLength?: number; // optionnel: longueur minimale de texte
  requireAttr?: string; // ex: "href"
};

type HtmlBuilderGame = {
  type: "html-builder";
  starter: string;
  goals: HtmlGoal[];
};

export function HtmlBuilderRunner({ 
  game, 
  onExit,
  languageId,
  levelNumber,
  xpReward,
  levelTitle,
}: { 
  game: HtmlBuilderGame; 
  onExit?: () => void;
  languageId?: string;
  levelNumber?: number;
  xpReward?: number;
  levelTitle?: string;
}) {
  const [code, setCode] = useState<string>(game.starter);
  const [hintCount, setHintCount] = useState<number>(0);
  const [hasUsedTemplate, setHasUsedTemplate] = useState<boolean>(false);
  const [showCinematic, setShowCinematic] = useState(false);
  const [completedData, setCompletedData] = useState<{isFirst: boolean; isLanguageComplete: boolean} | null>(null);
  const queryClient = useQueryClient();
  const MAX_HINTS = 3; // Limite de 3 indices

  const goalChecks = useMemo(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, "text/html");
      return game.goals.map((g) => {
        const el = doc.querySelector(g.selector) as HTMLElement | null;
        const hasEl = Boolean(el);
        const textOk = g.minTextLength ? Boolean(el && (el.textContent || "").trim().length >= g.minTextLength) : true;
        const attrOk = g.requireAttr ? Boolean(el && el.getAttribute(g.requireAttr)) : true;
        return { id: g.id, ok: hasEl && textOk && attrOk };
      });
    } catch {
      return game.goals.map((g) => ({ id: g.id, ok: false }));
    }
  }, [code, game]);

  const allOk = goalChecks.every((c) => c.ok);
  const currentGoalIndex = goalChecks.findIndex((c) => !c.ok);
  const currentGoal = currentGoalIndex === -1 ? undefined : game.goals[currentGoalIndex];

  const srcDoc = code;

  const insertTemplate = () => {
    try {
      const tmpl = `<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>Mon premier document</title>\n  </head>\n  <body>\n    <h1>Mon titre</h1>\n    <p>Ceci est un paragraphe d'exemple.</p>\n    <a href=\"https://developer.mozilla.org/\">Découvrir MDN</a>\n  </body>\n</html>`;
      const parser = new DOMParser();
      const doc = parser.parseFromString(tmpl, "text/html");
      if (doc.querySelector("parsererror")) {
        toast.error("Erreur lors de l'insertion du modèle");
        return;
      }
      setCode(tmpl);
      setHasUsedTemplate(true);
      toast.success("Modèle complet inséré avec succès");
    } catch (err) {
      console.error("Erreur lors de l'insertion du modèle:", err);
      toast.error("Erreur lors de l'insertion du modèle");
    }
  };

  const insertHintForCurrent = () => {
    if (!currentGoal || hintCount >= MAX_HINTS) {
      if (hintCount >= MAX_HINTS) {
        toast.error(`Vous avez atteint la limite de ${MAX_HINTS} indices !`);
      }
      return;
    }
    
    let inserted = false;
    if (currentGoal.selector === "h1") {
      if (!/\<h1[\s\S]*?\<\/h1\>/.test(code)) {
        setCode(code.replace("</body>", "    <h1>Mon titre</h1>\n  </body>"));
        inserted = true;
      }
    } else if (currentGoal.selector === "p") {
      if (!/\<p[\s\S]*?\<\/p\>/.test(code)) {
        setCode(code.replace("</body>", "    <p>Ceci est un paragraphe.</p>\n  </body>"));
        inserted = true;
      }
    } else if (currentGoal.selector.includes("a[href]")) {
      if (!/\<a[\s\S]*?href[\s\S]*?\>/.test(code)) {
        setCode(code.replace("</body>", "    <a href=\"https://example.com\">Lien</a>\n  </body>"));
        inserted = true;
      }
    }
    
    if (inserted) {
      setHintCount((prev) => prev + 1);
      toast.info(`Indice ${hintCount + 1}/${MAX_HINTS} inséré`);
    } else {
      toast.info("Cet élément semble déjà présent");
    }
  };

  // Fonction cheat : remplir automatiquement tous les objectifs
  const autoFillAll = () => {
    if (!isCheatModeEnabled()) {
      toast.error("Mode cheat non activé. Activez-le depuis la page Admin.");
      return;
    }

    let newCode = code;
    let filled = false;

    // Remplit tous les objectifs manquants
    game.goals.forEach((goal) => {
      if (goal.selector === "h1" && !/\<h1[\s\S]*?\<\/h1\>/.test(newCode)) {
        newCode = newCode.replace("</body>", "    <h1>Mon titre</h1>\n  </body>");
        filled = true;
      } else if (goal.selector === "p" && !/\<p[\s\S]*?\<\/p\>/.test(newCode)) {
        newCode = newCode.replace("</body>", "    <p>Ceci est un paragraphe.</p>\n  </body>");
        filled = true;
      } else if (goal.selector.includes("a[href]") && !/\<a[\s\S]*?href[\s\S]*?\>/.test(newCode)) {
        const hrefValue = goal.requireAttr === "href" ? "https://developer.mozilla.org/" : "https://example.com";
        newCode = newCode.replace("</body>", `    <a href="${hrefValue}">Découvrir MDN</a>\n  </body>`);
        filled = true;
      }
    });

    if (filled) {
      setCode(newCode);
      setHintCount(0); // Reset hint count en mode cheat
      toast.success("✨ Tous les objectifs remplis automatiquement ! Vous pouvez maintenant valider.");
    } else {
      toast.info("Tous les objectifs sont déjà remplis !");
    }
  };

  const handleCompleteLevel = async () => {
    if (!allOk || !languageId || !levelNumber) {
      toast.error("Impossible de valider le niveau");
      return;
    }

    // En mode cheat, on ignore les restrictions
    if (!isCheatModeEnabled()) {
      if (hasUsedTemplate) {
        toast.error("Vous ne pouvez pas valider un niveau en utilisant le modèle complet. Essayez de le faire vous-même !");
        return;
      }

      if (hintCount >= MAX_HINTS) {
        toast.error("Vous avez utilisé trop d'indices. Essayez de compléter le niveau avec moins d'aide !");
        return;
      }
    }

    try {
      const res = await fetch(`${API_BASE}/api/languages/${languageId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          levelNumber,
          xpReward: xpReward || 0,
          levelTitle: levelTitle || `${languageId?.charAt(0).toUpperCase() + languageId?.slice(1)} - Niveau ${levelNumber}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        
        const wasAlreadyCompleted = data.wasAlreadyCompleted || false;
        
        const languagesResponse = await fetch(`${API_BASE}/api/languages`, {
          credentials: "include",
        });
        let currentLang = null;
        if (languagesResponse.ok) {
          const languagesData = await languagesResponse.json();
          currentLang = languagesData.languages?.find((l: any) => l.id === languageId);
        }
        
        const isFirstLevel = currentLang?.completedLevels === 0 && levelNumber === 1;
        const totalLevels = 5;
        const isLanguageComplete = currentLang ? (currentLang.completedLevels + 1) >= totalLevels : false;
        
        if (wasAlreadyCompleted) {
          toast.success("Niveau complété ! (Déjà complété précédemment - pas de gain d'XP)");
          if (onExit) {
            setTimeout(() => onExit(), 1500);
          }
        } else {
          setCompletedData({ isFirst: isFirstLevel, isLanguageComplete });
          setShowCinematic(true);
          
          if (data.newAchievements && data.newAchievements.length > 0) {
            setTimeout(() => {
              data.newAchievements.forEach((achievement: string) => {
                toast.success(`🎉 Nouveau succès débloqué ! ${achievement}`);
              });
            }, 500);
          }
          
          queryClient.invalidateQueries({ queryKey: ["user"] });
          queryClient.invalidateQueries({ queryKey: ["languages"] });
          queryClient.invalidateQueries({ queryKey: ["language-progress"] });
        }
      } else {
        toast.error("Erreur lors de la validation du niveau");
      }
    } catch (err) {
      console.error("Erreur lors de la complétion du niveau:", err);
      toast.error("Erreur lors de la validation du niveau");
    }
  };

  const canValidate = allOk && !hasUsedTemplate && hintCount < MAX_HINTS;

  const getLanguageName = () => {
    const langMap: Record<string, string> = {
      html: "HTML/CSS",
      javascript: "JavaScript",
      php: "PHP",
      sql: "SQL",
      python: "Python",
      java: "Java",
      csharp: "C#",
      cpp: "C++",
    };
    return langMap[languageId || ""] || languageId || "Ce langage";
  };

  const handleCinematicComplete = () => {
    setShowCinematic(false);
    setCompletedData(null);
    if (onExit) {
      setTimeout(() => onExit(), 500);
    }
  };

  const completedGoals = goalChecks.filter(c => c.ok).length;
  const totalGoals = game.goals.length;
  const progressPercent = (completedGoals / totalGoals) * 100;

  return (
    <>
      {showCinematic && completedData && (
        <LevelCompleteCinematic
          levelTitle={levelTitle || `Niveau ${levelNumber}`}
          languageName={getLanguageName()}
          xpEarned={xpReward || 0}
          isFirstLevel={completedData.isFirst}
          isLanguageComplete={completedData.isLanguageComplete}
          onContinue={handleCinematicComplete}
        />
      )}
      
      <div className="space-y-6">
        {/* Header avec progression immersive */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20 border-2 border-cyan-500/30 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] animate-pulse" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30">
                  <Code2 className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Défi HTML Builder</h3>
                  <p className="text-sm text-muted-foreground">Construis ta page étape par étape</p>
                </div>
              </div>
              {xpReward && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-yellow-400">+{xpReward} XP</span>
                </div>
              )}
            </div>
            
            {/* Barre de progression immersive */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">Objectifs complétés</span>
                <span className="text-cyan-400 font-bold">{completedGoals}/{totalGoals}</span>
              </div>
              <div className="relative h-3 bg-background/50 rounded-full overflow-hidden border border-cyan-500/20">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Colonne gauche : Instructions et éditeur */}
          <div className="space-y-4">
            <Tabs defaultValue="learn" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="learn" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Apprendre
                </TabsTrigger>
                <TabsTrigger value="play" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
                  <Target className="w-4 h-4 mr-2" />
                  Objectifs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="learn" className="mt-4">
                <Card className="p-6 bg-gradient-to-br from-slate-900/50 via-cyan-900/30 to-slate-800/50 border-cyan-500/20 shadow-xl">
                  {/* Header avec badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-400/50">
                        <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">HTML — Structure de base</h2>
                        <p className="text-xs text-muted-foreground">Leçon interactive</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30">
                      <span className="text-xs font-bold text-cyan-300">📚 Théorie</span>
                    </div>
                  </div>

                  {/* Contenu avec design gamifié */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                      <p className="text-sm text-foreground leading-relaxed mb-3">
                        Un document HTML contient généralement un <code className="px-2 py-1 rounded-md bg-cyan-500/30 text-cyan-200 font-mono text-xs border border-cyan-400/50">&lt;head&gt;</code> et un <code className="px-2 py-1 rounded-md bg-cyan-500/30 text-cyan-200 font-mono text-xs border border-cyan-400/50">&lt;body&gt;</code>.
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        Dans le corps, on place des éléments comme :
                      </p>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="p-2 rounded-md bg-background/50 border border-cyan-500/20 text-center">
                          <code className="text-xs font-mono text-cyan-300">&lt;h1&gt;</code>
                          <p className="text-xs text-muted-foreground mt-1">Titre</p>
                        </div>
                        <div className="p-2 rounded-md bg-background/50 border border-cyan-500/20 text-center">
                          <code className="text-xs font-mono text-cyan-300">&lt;p&gt;</code>
                          <p className="text-xs text-muted-foreground mt-1">Paragraphe</p>
                        </div>
                        <div className="p-2 rounded-md bg-background/50 border border-cyan-500/20 text-center">
                          <code className="text-xs font-mono text-cyan-300">&lt;a&gt;</code>
                          <p className="text-xs text-muted-foreground mt-1">Lien</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-cyan-500/20" />

                    {/* Exemple avec design amélioré */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                        <p className="font-semibold text-sm text-foreground">Exemple minimal :</p>
                      </div>
                      <div className="relative">
                        <pre className="p-4 rounded-lg bg-background/90 border-2 border-cyan-500/30 text-foreground overflow-auto text-xs font-mono shadow-inner">
{`<h1>Mon titre</h1>
<p>Un texte de présentation.</p>
<a href="https://developer.mozilla.org/">Découvrir MDN</a>`}
                        </pre>
                        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-cyan-500/20 border border-cyan-400/30">
                          <span className="text-[10px] font-bold text-cyan-300">💡 Exemple</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions avec design gamifié */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button 
                        variant="secondary" 
                        onClick={insertTemplate} 
                        className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/30"
                      >
                        <Code2 className="w-4 h-4 mr-2" />
                        Modèle complet
                      </Button>
                      <Button 
                        variant="ghost" 
                        asChild
                        className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-slate-700/50 hover:to-slate-600/50 border border-border/50"
                      >
                        <a href="https://developer.mozilla.org/fr/docs/Learn/HTML/Introduction_to_HTML/Getting_started" target="_blank" rel="noreferrer">
                          <Eye className="w-4 h-4 mr-2" />
                          MDN Docs
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="play" className="mt-4">
                <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-bold text-foreground">Objectifs du niveau</h2>
                  </div>
                  <ul className="space-y-3 mb-4">
                    {game.goals.map((g) => {
                      const ok = goalChecks.find((c) => c.id === g.id)?.ok;
                      return (
                        <li key={g.id} className="flex items-start gap-3 p-3 rounded-lg bg-background/30 border border-purple-500/20 transition-all">
                          <div className={`mt-0.5 flex-shrink-0 ${ok ? 'text-green-400' : 'text-muted-foreground'}`}>
                            {ok ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                          </div>
                          <span className={`text-sm flex-1 ${ok ? 'text-foreground line-through opacity-60' : 'text-foreground font-medium'}`}>
                            {g.description}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-background/30 border border-purple-500/20">
                    <Lightbulb className="w-4 h-4 text-purple-400" />
                    {currentGoal ? (
                      <span className="text-sm text-foreground">
                        Astuce: {currentGoal.selector === "h1" ? "Ajoute un titre h1" : currentGoal.selector === "p" ? "Ajoute un paragraphe" : "Ajoute un lien avec href"}
                      </span>
                    ) : (
                      <span className="text-sm text-green-400 font-medium">✨ Tous les objectifs sont validés !</span>
                    )}
                  </div>
                  <div className="mt-3">
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={insertHintForCurrent} 
                  disabled={!currentGoal || hintCount >= MAX_HINTS}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Indice ({hintCount}/{MAX_HINTS})
                </Button>
                {isCheatModeEnabled() && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={autoFillAll}
                    className="w-full border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    ✨ Remplir automatiquement (Cheat)
                  </Button>
                )}
              </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Éditeur avec style immersif */}
            <Card className="p-0 overflow-hidden border-cyan-500/30 bg-gradient-to-br from-slate-900/80 to-slate-800/80">
              <div className="border-b border-cyan-500/30 px-4 py-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-300">Éditeur HTML</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{code.split('\n').length} lignes</span>
                </div>
              </div>
              <textarea
                className="w-full h-[400px] p-4 font-mono text-sm bg-background/50 text-foreground outline-none resize-none focus:bg-background/70 transition-colors"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Écris ton code HTML ici..."
                spellCheck={false}
              />
              <div className="flex justify-between items-center p-4 border-t border-cyan-500/30 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
                <div className="text-sm">
                  {allOk 
                    ? hasUsedTemplate 
                      ? <span className="text-orange-400">⚠️ Modèle utilisé - validation impossible</span>
                      : hintCount >= MAX_HINTS
                      ? <span className="text-orange-400">⚠️ Trop d'indices - validation impossible</span>
                      : <span className="text-green-400 font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Prêt à valider !</span>
                    : <span className="text-muted-foreground">Complète les objectifs pour valider</span>}
                </div>
                <div className="flex gap-2">
                  {onExit && (
                    <Button variant="ghost" onClick={onExit} size="sm">
                      Quitter
                    </Button>
                  )}
                  <Button 
                    disabled={!canValidate} 
                    onClick={handleCompleteLevel}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50"
                    size="sm"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Valider
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Colonne droite : Aperçu avec style immersif */}
          <div className="space-y-4">
            <Card className="p-0 overflow-hidden border-cyan-500/30 bg-gradient-to-br from-slate-900/80 to-slate-800/80">
              <div className="border-b border-cyan-500/30 px-4 py-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-300">Aperçu en temps réel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>
              </div>
              <div className="relative bg-white min-h-[500px]">
                <iframe 
                  title="preview" 
                  className="w-full h-[500px] bg-white border-0" 
                  sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts" 
                  srcDoc={srcDoc} 
                />
                {allOk && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg animate-bounce">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tous les objectifs validés !
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
