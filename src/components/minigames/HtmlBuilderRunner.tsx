import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
      // Vérifie que le template est valide avant de l'insérer
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
        setCode(code.replace("</body>", "    <p>Un paragraphe d'exemple</p>\n  </body>"));
        inserted = true;
      }
    } else if (currentGoal.selector === "a[href]") {
      if (!/\<a[^>]*href=/.test(code)) {
        setCode(code.replace("</body>", "    <a href=\"https://example.com\">Un lien</a>\n  </body>"));
        inserted = true;
      }
    }
    
    if (inserted) {
      setHintCount(prev => prev + 1);
      toast.info(`Indice ${hintCount + 1}/${MAX_HINTS} utilisé`);
    } else {
      toast.info("Cet élément est déjà présent dans votre code");
    }
  };

  const handleCompleteLevel = async () => {
    if (!allOk || !languageId || !levelNumber) {
      toast.error("Impossible de valider le niveau");
      return;
    }

    // Empêche de valider si on a utilisé le modèle complet ou trop d'indices
    if (hasUsedTemplate) {
      toast.error("Vous ne pouvez pas valider un niveau en utilisant le modèle complet. Essayez de le faire vous-même !");
      return;
    }

    if (hintCount >= MAX_HINTS) {
      toast.error("Vous avez utilisé trop d'indices. Essayez de compléter le niveau avec moins d'aide !");
      return;
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
        
        // Vérifie si le niveau a déjà été complété (pas de gain d'XP)
        const wasAlreadyCompleted = data.wasAlreadyCompleted || false;
        
        if (wasAlreadyCompleted) {
          toast.success("Niveau complété ! (Déjà complété précédemment - pas de gain d'XP)");
        } else {
          toast.success(`Niveau complété ! +${xpReward || 0} XP`);
        }
        
        // Affiche les nouveaux succès débloqués
        if (data.newAchievements && data.newAchievements.length > 0) {
          setTimeout(() => {
            data.newAchievements.forEach((achievement: string) => {
              toast.success(`🎉 Nouveau succès débloqué ! ${achievement}`);
            });
          }, 500);
        }
        
        // Invalide les queries pour forcer l'actualisation des données
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["languages"] });
        queryClient.invalidateQueries({ queryKey: ["language-progress"] });
        
        if (onExit) {
          setTimeout(() => onExit(), 1500);
        }
      } else {
        toast.error("Erreur lors de la validation du niveau");
      }
    } catch (err) {
      console.error("Erreur lors de la complétion du niveau:", err);
      toast.error("Erreur lors de la validation du niveau");
    }
  };

  // Désactive le bouton si on a utilisé le modèle complet ou trop d'indices
  const canValidate = allOk && !hasUsedTemplate && hintCount < MAX_HINTS;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <Tabs defaultValue="learn">
          <TabsList>
            <TabsTrigger value="learn">Apprendre</TabsTrigger>
            <TabsTrigger value="play">Jouer</TabsTrigger>
          </TabsList>

          <TabsContent value="learn">
            <Card className="p-4">
              <h2 className="text-xl font-bold text-foreground mb-2">HTML — Structure de base</h2>
              <p className="text-sm text-muted-foreground">
                Un document HTML contient généralement un <code>&lt;head&gt;</code> et un <code>&lt;body&gt;</code>.
                Dans le corps, on place des éléments comme un titre <code>&lt;h1&gt;</code>,
                un paragraphe <code>&lt;p&gt;</code> et un lien <code>&lt;a href=\"...\"&gt;</code>.
              </p>
              <Separator className="my-3" />
              <div className="text-sm">
                <p className="font-semibold mb-2">Exemple minimal:</p>
                <pre className="p-3 rounded bg-muted text-foreground overflow-auto text-xs">
{`<h1>Mon titre</h1>
<p>Un texte de présentation.</p>
<a href="https://developer.mozilla.org/">Découvrir MDN</a>`}
                </pre>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" onClick={insertTemplate}>Insérer un modèle complet</Button>
                <Button variant="ghost" asChild>
                  <a href="https://developer.mozilla.org/fr/docs/Learn/HTML/Introduction_to_HTML/Getting_started" target="_blank" rel="noreferrer">
                    Ouvrir la leçon MDN
                  </a>
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="play">
            <Card className="p-4">
              <h2 className="text-xl font-bold text-foreground mb-2">Objectifs du niveau</h2>
              <ul className="mt-2 space-y-2">
                {game.goals.map((g) => {
                  const ok = goalChecks.find((c) => c.id === g.id)?.ok;
                  return (
                    <li key={g.id} className="flex items-center gap-2 text-sm">
                      {ok ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-destructive" />}
                      <span className="text-foreground">{g.description}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Lightbulb className="w-4 h-4" />
                {currentGoal ? (
                  <span>Astuce: {currentGoal.selector === "h1" ? "Ajoute un titre h1" : currentGoal.selector === "p" ? "Ajoute un paragraphe" : "Ajoute un lien avec href"}</span>
                ) : (
                  <span>Tous les objectifs sont validés, tu peux valider le niveau.</span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={insertHintForCurrent} 
                  disabled={!currentGoal || hintCount >= MAX_HINTS}
                >
                  Insérer un indice ({hintCount}/{MAX_HINTS})
                </Button>
                {hintCount >= MAX_HINTS && (
                  <span className="text-xs text-muted-foreground">Limite atteinte</span>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-0 overflow-hidden">
          <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">Éditeur</div>
          <textarea
            className="w-full h-[340px] p-3 font-mono text-sm bg-background text-foreground outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
            <div className="flex justify-between items-center p-3 border-t border-border">
              <div className="text-sm text-muted-foreground">
                {allOk 
                  ? hasUsedTemplate 
                    ? "⚠️ Vous avez utilisé le modèle complet - vous ne pouvez pas valider" 
                    : hintCount >= MAX_HINTS
                    ? "⚠️ Vous avez utilisé trop d'indices - vous ne pouvez pas valider"
                    : "Tous les objectifs sont validés ✅"
                  : "Complète les objectifs pour valider"}
              </div>
              <div className="flex gap-2">
                {onExit && <Button variant="ghost" onClick={onExit}>Quitter</Button>}
                <Button disabled={!canValidate} onClick={handleCompleteLevel}>Valider le niveau</Button>
              </div>
            </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">Aperçu</div>
        <iframe title="preview" className="w-full h-[520px] bg-white" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts" srcDoc={srcDoc} />
      </Card>
    </div>
  );
}


