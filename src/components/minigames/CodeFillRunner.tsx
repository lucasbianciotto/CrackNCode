import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useCountdown } from "@/hooks/useCountdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Code2, Clock, CheckCircle2, XCircle, Zap, Trophy, Target, Lightbulb, Sparkles, Wand2 } from "lucide-react";
import { LevelCompleteCinematic } from "@/components/storytelling/LevelCompleteCinematic";
import { getSuccessDefinition } from "@/data/achievements";
import { isCheatModeEnabled } from "@/utils/cheatMode";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

type CodeFillBlank = {
    id: string;
    answer: string | string[];
    placeholder?: string;
    explanation?: string;
    caseSensitive?: boolean;
    trim?: boolean;
    choices?: string[];
};

type CodeFillMinigame = {
    type: "code-fill";
    language: string;
    snippet: string; // placeholders {{1}}, {{2}}, …
    blanks: CodeFillBlank[];
    timeLimitSeconds?: number;
    passingScorePercent?: number;
};

function tokenizeSnippet(snippet: string): Array<
    | { type: "text"; text: string }
    | { type: "blank"; id: string }
> {
    const parts = snippet.split(/(\{\{\s*([a-zA-Z0-9_-]+)\s*\}\})/g);
    const tokens: Array<{ type: "text"; text?: string; id?: string }> = [];
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;
        const m = part.match(/^\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}$/);
        if (m) {
            tokens.push({ type: "blank", id: m[1] });
        } else if (!/^\{\{|\}\}$/.test(part)) {
            tokens.push({ type: "text", text: part });
        }
    }
    return tokens as any;
}

function isAnswerCorrect(value: string, def: CodeFillBlank): boolean {
    const trim = def.trim ?? true;
    const caseSensitive = def.caseSensitive ?? false;

    const norm = (s: string) => {
        let r = trim ? s.trim() : s;
        if (!caseSensitive) r = r.toLowerCase();
        return r;
    };

    const v = norm(value);
    const answers = Array.isArray(def.answer) ? def.answer : [def.answer];
    return answers.map(norm).some((a) => a === v);
}

function formatSeconds(total: number) {
    const m = Math.floor(total / 60)
        .toString()
        .padStart(2, "0");
    const s = Math.floor(total % 60)
        .toString()
        .padStart(2, "0");
    return `${m}:${s}`;
}

export function CodeFillRunner({
  game,
  languageId,
  levelKey,
  onExit,
  levelNumber,
  xpReward,
  levelTitle,
  onSuccess,
}: {
  game: CodeFillMinigame;
  languageId: string;
  levelKey: string;
  onExit?: () => void;
  levelNumber?: number;
  xpReward?: number;
  levelTitle?: string;
  onSuccess?: () => void;
}) {
    const passing = game.passingScorePercent ?? 100;
    const [started, setStarted] = useState(false);
    const [showCinematic, setShowCinematic] = useState(false);
    const [completedData, setCompletedData] = useState<{isFirst: boolean; isLanguageComplete: boolean} | null>(null);

    const tokens = useMemo(() => tokenizeSnippet(game.snippet), [game.snippet]);
    const blankIds = useMemo(
        () => tokens.filter((t) => t.type === "blank").map((t) => t.id),
        [tokens]
    );

    const initialValues = useMemo(() => {
        const map: Record<string, string> = {};
        blankIds.forEach((id) => (map[id] = ""));
        return map;
    }, [blankIds]);

    const [values, setValues] = useState<Record<string, string>>(initialValues);
    const [finished, setFinished] = useState(false);

    const remaining = useCountdown(game.timeLimitSeconds, started && !finished);

    // reset si on change de level
    useEffect(() => {
        setValues(initialValues);
        setFinished(false);
        setStarted(false);
    }, [languageId, levelKey, game, initialValues]);

    useEffect(() => {
        if (remaining === 0 && !finished) {
            setFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remaining]);

    const resultPerBlank = useMemo(() => {
        if (!finished) return {};
        const res: Record<string, boolean> = {};
        for (const id of blankIds) {
            const def = game.blanks.find((b) => b.id === id);
            const val = values[id] ?? "";
            res[id] = def ? isAnswerCorrect(val, def) : false;
        }
        return res;
    }, [finished, values, blankIds, game.blanks]);

    const total = blankIds.length;
    const correctCount = Object.values(resultPerBlank).filter(Boolean).length;
    const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const passed = scorePercent >= passing;

    const handleChange = (id: string, v: string) => {
        setValues((prev) => ({ ...prev, [id]: v }));
    };

    const handleSelectChoice = (id: string, v: string) => {
        handleChange(id, v);
    };

    const handleFinish = () => setFinished(true);
    const handleRestart = () => {
        setValues(initialValues);
        setFinished(false);
        setStarted(false);
    };

    // Fonction cheat : remplir automatiquement tous les champs
    const autoFillAll = () => {
        if (!isCheatModeEnabled()) {
            toast.error("Mode cheat non activé. Activez-le depuis la page Admin.");
            return;
        }

        const newValues: Record<string, string> = {};
        let filled = false;

        blankIds.forEach((id) => {
            const def = game.blanks.find((b) => b.id === id);
            if (def) {
                // Prend la première réponse correcte
                const answer = Array.isArray(def.answer) ? def.answer[0] : def.answer;
                newValues[id] = answer;
                if (!values[id] || values[id] !== answer) {
                    filled = true;
                }
            }
        });

        if (filled) {
            setValues(newValues);
            toast.success("✨ Tous les champs remplis automatiquement ! Vous pouvez maintenant terminer et valider.");
        } else {
            toast.info("Tous les champs sont déjà remplis correctement !");
        }
    };

    const handleCompleteLevel = async () => {
        const passedLocal = passed;
        if (!passedLocal) {
            toast.error("Impossible de valider le niveau");
            return;
        }

        // Si onSuccess est fourni (défi boss), on l'appelle au lieu de compléter le niveau
        if (onSuccess) {
            onSuccess();
            return;
        }

        if (!languageId || !levelNumber) {
            toast.error("Impossible de valider le niveau");
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
                    levelTitle: levelTitle || `${languageId.charAt(0).toUpperCase() + languageId.slice(1)} - Niveau ${levelNumber}`,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                const wasAlreadyCompleted = data.wasAlreadyCompleted || false;
                
                if (wasAlreadyCompleted) {
                    toast.success("Niveau complété ! (Déjà complété précédemment - pas de gain d'XP)");
                    if (onExit) {
                        setTimeout(() => onExit(), 1500);
                    }
                } else {
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
                    
                    setCompletedData({ isFirst: isFirstLevel, isLanguageComplete });
                    setShowCinematic(true);
                    
                    if (data.newAchievements && data.newAchievements.length > 0) {
                        setTimeout(() => {
                            data.newAchievements.forEach((achievement: string) => {
                                const def = getSuccessDefinition(achievement);
                                toast.success(`🎉 Nouveau succès débloqué ! ${def?.titre || achievement}`);
                            });
                        }, 500);
                    }
                }
            } else {
                toast.error("Erreur lors de la validation du niveau");
            }
        } catch (err) {
            console.error("Erreur lors de la complétion du niveau:", err);
            toast.error("Erreur lors de la validation du niveau");
        }
    };

    const getLanguageName = () => {
        const langMap: Record<string, string> = {
            html: "HTML/CSS", javascript: "JavaScript", php: "PHP", sql: "SQL",
            python: "Python", java: "Java", csharp: "C#", cpp: "C++",
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
                {/* Header immersif */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-red-900/20 border-2 border-purple-500/30 p-6">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)] animate-pulse" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                                    <Code2 className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Code Fill Challenge</h3>
                                    <p className="text-sm text-muted-foreground">Complète les trous du code</p>
                                </div>
                            </div>
                            {xpReward && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    <span className="font-bold text-yellow-400">+{xpReward} XP</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Timer et progression */}
                        {started && !finished && typeof remaining === "number" && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className={`w-4 h-4 ${remaining <= 10 ? 'text-red-400 animate-pulse' : 'text-purple-400'}`} />
                                    <span className={`font-bold ${remaining <= 10 ? 'text-red-400' : 'text-foreground'}`}>
                                        {formatSeconds(remaining)}
                                    </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {correctCount}/{total} corrects
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Tabs defaultValue="learn">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                        <TabsTrigger value="learn" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Apprendre
                        </TabsTrigger>
                        <TabsTrigger value="play" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-red-500">
                            <Target className="w-4 h-4 mr-2" />
                            Jouer
                        </TabsTrigger>
                    </TabsList>

                <TabsContent value="learn" className="mt-4">
                    <Card className="p-6 bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-800/50 border-purple-500/20 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/50">
                                    <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">
                                        {levelTitle ?? "Code Fill — Complète le code"}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">Leçon interactive</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                                <span className="text-xs font-bold text-purple-300">📚 Théorie</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                            <div className="flex items-start gap-3">
                                <div className="w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full min-h-[40px]" />
                                <div className="flex-1 space-y-2">
                                    <p className="text-sm text-foreground leading-relaxed font-medium">
                                        Complète les trous du code avec les bons mots‑clés et valeurs.
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="px-2 py-1 rounded-md bg-background/50 border border-purple-500/20">
                                            <span className="text-xs font-mono text-purple-300">💡 Astuce</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Utilise l'onglet Jouer pour t'entraîner sous un timer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="play" className="mt-4">
                    <div className="space-y-4">
                        {!finished ? (
                            <div className="space-y-4">
                                {!started ? (
                                    <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/20 text-center">
                                        <div className="space-y-4">
                                            <div className="text-6xl mb-4">🎯</div>
                                            <h3 className="text-xl font-bold text-foreground">Prêt pour le défi ?</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {game.timeLimitSeconds ? `Tu as ${formatSeconds(game.timeLimitSeconds)} pour compléter le code` : "Complète tous les trous du code"}
                                            </p>
                                            <div className="flex items-center justify-center gap-3 pt-4">
                                                <Button 
                                                    onClick={() => setStarted(true)}
                                                    size="lg"
                                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                                >
                                                    <Sparkles className="w-5 h-5 mr-2" />
                                                    Commencer
                                                </Button>
                                                <Button variant="secondary" onClick={handleRestart} size="lg">
                                                    Réinitialiser
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ) : (
                                    <>
                                        {/* Zone code avec style immersif */}
                                        <Card className="p-0 overflow-hidden border-purple-500/30 bg-gradient-to-br from-slate-900/80 to-slate-800/80">
                                            <div className="border-b border-purple-500/30 px-4 py-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Code2 className="w-4 h-4 text-purple-400" />
                                                    <span className="text-xs font-medium text-purple-300">Code à compléter</span>
                                                </div>
                                                {typeof remaining === "number" && (
                                                    <div className={`flex items-center gap-2 ${remaining <= 10 ? 'text-red-400 animate-pulse' : 'text-muted-foreground'}`}>
                                                        <Clock className="w-4 h-4" />
                                                        <span className="text-xs font-bold">{formatSeconds(remaining)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 bg-background/50">
                                                <pre className="font-mono text-sm whitespace-pre-wrap break-words text-foreground leading-relaxed">
                                                    {tokens.map((tk, idx) =>
                                                        tk.type === "text" ? (
                                                            <span key={idx} className="text-foreground">{tk.text}</span>
                                                        ) : (
                                                            <InlineBlank
                                                                key={idx}
                                                                id={tk.id}
                                                                def={game.blanks.find((b) => b.id === tk.id)}
                                                                value={values[tk.id] ?? ""}
                                                                onChange={(v) => handleChange(tk.id, v)}
                                                                onSelectChoice={(v) => handleSelectChoice(tk.id, v)}
                                                                showResult={finished}
                                                                correct={
                                                                    finished
                                                                        ? isAnswerCorrect(
                                                                            values[tk.id] ?? "",
                                                                            game.blanks.find((b) => b.id === tk.id)!
                                                                        )
                                                                        : undefined
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </pre>
                                            </div>
                                        </Card>

                                 {/* Actions */}
                                 <div className="flex flex-col items-center gap-3">
                                     {isCheatModeEnabled() && !finished && (
                                         <Button 
                                             onClick={autoFillAll}
                                             variant="outline"
                                             className="w-full border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20"
                                         >
                                             <Wand2 className="w-4 h-4 mr-2" />
                                             ✨ Remplir automatiquement (Cheat)
                                         </Button>
                                     )}
                                     <div className="flex items-center justify-center gap-3 w-full">
                                         <Button 
                                             onClick={handleFinish}
                                             className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                         >
                                             <Trophy className="w-4 h-4 mr-2" />
                                             Terminer
                                         </Button>
                                         <Button variant="secondary" onClick={handleRestart}>
                                             Réinitialiser
                                         </Button>
                                     </div>
                                 </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Card className={`p-6 border-2 ${passed ? "border-green-500/50 bg-gradient-to-br from-green-900/30 to-emerald-900/30" : "border-amber-500/50 bg-gradient-to-br from-amber-900/30 to-orange-900/30"}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        {passed ? (
                                            <CheckCircle2 className="w-8 h-8 text-green-400" />
                                        ) : (
                                            <XCircle className="w-8 h-8 text-amber-400" />
                                        )}
                                        <div>
                                            <div className="font-bold text-lg text-foreground">{passed ? "Bravo ! 🎉" : "C'est presque bon ! 💪"}</div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                Score: {correctCount} / {total} ({scorePercent}%) — Seuil: {passing}%
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                
                                {/* Détails des réponses avec style amélioré */}
                                <div className="space-y-3">
                                    {game.blanks.map((b) => {
                                        const ok = (resultPerBlank as any)[b.id];
                                        const expected = Array.isArray(b.answer) ? b.answer.join(" | ") : b.answer;
                                        return (
                                            <Card key={b.id} className={`p-4 border ${ok ? "border-green-500/30 bg-green-900/20" : "border-red-500/30 bg-red-900/20"}`}>
                                                <div className="flex items-start gap-3">
                                                    {ok ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                                    )}
                                                    <div className="flex-1 space-y-1">
                                                        <div className="font-medium text-sm text-foreground">
                                                            Trou n°{b.id}: {ok ? "Correct ✅" : "Incorrect ❌"}
                                                        </div>
                                                        {!ok && (
                                                            <div className="text-xs text-muted-foreground">
                                                                Votre réponse: <span className="font-mono bg-background/50 px-1.5 py-0.5 rounded">"{values[b.id] ?? ""}"</span>
                                                            </div>
                                                        )}
                                                        <div className="text-xs text-muted-foreground">
                                                            Réponse attendue: <span className="font-mono bg-background/50 px-1.5 py-0.5 rounded">{expected}</span>
                                                        </div>
                                                        {b.explanation && (
                                                            <div className="text-xs text-muted-foreground mt-2 p-2 rounded bg-background/30 border border-border/50">
                                                                💡 {b.explanation}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                                
                                <div className="flex items-center justify-center gap-3 pt-2">
                                    {onExit && (
                                        <Button variant="ghost" onClick={onExit}>
                                            Quitter
                                        </Button>
                                    )}
                                    <Button 
                                        disabled={!passed} 
                                        onClick={handleCompleteLevel}
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
                                    >
                                        <Trophy className="w-4 h-4 mr-2" />
                                        Valider le niveau
                                    </Button>
                                    <Button variant="secondary" onClick={handleRestart}>
                                        Recommencer
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
        </>
    );
}

function InlineBlank({
                         id,
                         def,
                         value,
                         onChange,
                         onSelectChoice,
                         showResult,
                         correct,
                     }: {
    id: string;
    def?: CodeFillBlank;
    value: string;
    onChange: (v: string) => void;
    onSelectChoice: (v: string) => void;
    showResult: boolean;
    correct?: boolean;
}) {
    const baseClass =
        "align-baseline inline-flex items-center mx-1 px-2 py-1 rounded transition-all";
    const borderClass = showResult
        ? correct
            ? "outline outline-2 outline-green-500 bg-green-500/20"
            : "outline outline-2 outline-red-500 bg-red-500/20"
        : "outline outline-1 outline-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 focus-within:outline-purple-400";
    const commonStyle = [
        "font-mono text-sm font-medium",
        baseClass,
        borderClass,
    ].join(" ");

    if (def?.choices && def.choices.length > 0) {
        return (
            <span className={baseClass}>
        <select
            className={[commonStyle, "py-0.5"].join(" ")}
            value={value}
            onChange={(e) => onSelectChoice(e.target.value)}
        >
          <option value="">{def.placeholder ?? `{{${id}}}`}</option>
            {def.choices.map((c) => (
                <option key={c} value={c}>
                    {c}
                </option>
            ))}
        </select>
      </span>
        );
    }

    const widthCh =
        Math.max(String(value || "").length, (def?.placeholder ?? "").length, 4) +
        1;

    return (
        <input
            aria-label={`Champ ${id}`}
            className={[commonStyle, "py-0.5"].join(" ")}
            style={{ width: `${widthCh}ch` }}
            placeholder={def?.placeholder ?? `{{${id}}}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoComplete="off"
        />
    );
}