import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useCountdown } from "@/hooks/useCountdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { HelpCircle, Clock, CheckCircle2, XCircle, Zap, Trophy, Target, Lightbulb, Sparkles, ArrowRight, Wand2 } from "lucide-react";
import { LevelCompleteCinematic } from "@/components/storytelling/LevelCompleteCinematic";
import { isCheatModeEnabled } from "@/utils/cheatMode";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

type QuizQuestionOption = { id: string; text: string; imageUrl?: string };
type QuizQuestion = {
    id: string;
    question: string;
    options: QuizQuestionOption[];
    correctOptionId: string;
    explanation?: string;
    imageUrl?: string;
};
type QuizMinigame = {
    type: "quiz";
    questions: QuizQuestion[];
    shuffleOptions?: boolean;
    timeLimitSeconds?: number;
    passingScorePercent?: number;
    lesson?: {
        title: string;
        content: string;
        resourceUrl?: string;
    };
};

const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

function formatSeconds(total: number) {
    const m = Math.floor(total / 60)
        .toString()
        .padStart(2, "0");
    const s = Math.floor(total % 60)
        .toString()
        .padStart(2, "0");
    return `${m}:${s}`;
}

export function QuizRunner({
                               quiz,
                               languageId,
                               levelKey,
                               onExit,
                               levelNumber,
                               xpReward,
                               levelTitle,
                           }: {
    quiz: QuizMinigame;
    languageId: string;
    levelKey: string;
    onExit?: () => void;
    levelNumber?: number;
    xpReward?: number;
    levelTitle?: string;
}) {
    const passing = quiz.passingScorePercent ?? 70;
    const [started, setStarted] = useState(false);
    const [showCinematic, setShowCinematic] = useState(false);
    const [completedData, setCompletedData] = useState<{isFirst: boolean; isLanguageComplete: boolean} | null>(null);

    const preparedQuestions = useMemo(
        () =>
            quiz.questions.map((q) => ({
                ...q,
                options: quiz.shuffleOptions ? shuffleArray(q.options) : q.options,
            })),
        [quiz]
    );

    const [currentIdx, setCurrentIdx] = useState(0);
    const [locked, setLocked] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [results, setResults] = useState<
        { questionId: string; selected: string; correct: boolean }[]
    >([]);
    const [finished, setFinished] = useState(false);

    const remaining = useCountdown(quiz.timeLimitSeconds, started && !finished);

    useEffect(() => {
        setCurrentIdx(0);
        setLocked(false);
        setSelected(null);
        setResults([]);
        setFinished(false);
    }, [languageId, levelKey, quiz]);

    useEffect(() => {
        if (remaining === 0 && !finished) {
            handleFinish();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remaining]);

    const current = preparedQuestions[currentIdx];
    const total = preparedQuestions.length;

    const correctCount = results.reduce((acc, r) => acc + (r.correct ? 1 : 0), 0);
    const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const passed = scorePercent >= passing;

    const onSelect = (optionId: string) => {
        if (locked || finished) return;
        setSelected(optionId);

        const isCorrect = optionId === current.correctOptionId;
        // Vérifie si cette question a déjà été répondue (pour éviter les doublons en mode cheat)
        const existingResult = results.find(r => r.questionId === current.id);
        if (!existingResult) {
            setResults((prev) => [
                ...prev,
                { questionId: current.id, selected: optionId, correct: isCorrect },
            ]);
        }
        setLocked(true);
    };

    const handleNext = () => {
        if (currentIdx + 1 < total) {
            setCurrentIdx((i) => i + 1);
            setLocked(false);
            setSelected(null);
        } else {
            handleFinish();
        }
    };

    const handleFinish = () => setFinished(true);
    const handleRestart = () => {
        setCurrentIdx(0);
        setLocked(false);
        setSelected(null);
        setResults([]);
        setFinished(false);
        setStarted(false);
    };

    // Fonction cheat : répondre automatiquement à toutes les questions
    const autoAnswerAll = () => {
        if (!isCheatModeEnabled()) {
            toast.error("Mode cheat non activé. Activez-le depuis la page Admin.");
            return;
        }

        if (finished) {
            toast.info("Le quiz est déjà terminé !");
            return;
        }

        // Répond automatiquement à toutes les questions restantes
        const newResults: { questionId: string; selected: string; correct: boolean }[] = [];
        let answered = false;

        preparedQuestions.forEach((q) => {
            // Vérifie si cette question a déjà été répondue
            const existingResult = results.find(r => r.questionId === q.id);
            if (!existingResult) {
                // Sélectionne la bonne réponse
                newResults.push({
                    questionId: q.id,
                    selected: q.correctOptionId,
                    correct: true
                });
                answered = true;
            }
        });

        if (answered) {
            // Ajoute les nouvelles réponses aux résultats existants
            setResults(prev => [...prev, ...newResults]);
            
            // Si on est sur une question non répondue, sélectionne automatiquement la bonne réponse
            const currentResult = results.find(r => r.questionId === current.id);
            if (!currentResult && !locked) {
                // Sélectionne la bonne réponse pour la question actuelle
                setSelected(current.correctOptionId);
                // Ajoute le résultat pour la question actuelle
                setResults(prev => {
                    const exists = prev.find(r => r.questionId === current.id);
                    if (!exists) {
                        return [...prev, {
                            questionId: current.id,
                            selected: current.correctOptionId,
                            correct: true
                        }];
                    }
                    return prev;
                });
                setLocked(true);
            }
            
            toast.success("✨ Toutes les questions répondues automatiquement ! Vous pouvez maintenant continuer.");
        } else {
            toast.info("Toutes les questions ont déjà été répondues !");
        }
    };

    const handleCompleteLevel = async () => {
        const totalQ = preparedQuestions.length;
        const correctCountQ = results.reduce((acc, r) => acc + (r.correct ? 1 : 0), 0);
        const scorePercentQ = totalQ > 0 ? Math.round((correctCountQ / totalQ) * 100) : 0;
        const passedQ = scorePercentQ >= passing;

        if (!passedQ || !languageId || !levelNumber) {
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
                                toast.success(`🎉 Nouveau succès débloqué ! ${achievement}`);
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
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-purple-900/20 border-2 border-blue-500/30 p-6">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] animate-pulse" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30">
                                    <HelpCircle className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Quiz Challenge</h3>
                                    <p className="text-sm text-muted-foreground">Teste tes connaissances</p>
                                </div>
                            </div>
                            {xpReward && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    <span className="font-bold text-yellow-400">+{xpReward} XP</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Progression */}
                        {started && !finished && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <Target className="w-4 h-4 text-blue-400" />
                                    <span className="font-bold text-foreground">
                                        Question {currentIdx + 1} / {total}
                                    </span>
                                </div>
                                {typeof remaining === "number" && (
                                    <div className={`flex items-center gap-2 text-sm ${remaining <= 10 ? 'text-red-400 animate-pulse' : 'text-muted-foreground'}`}>
                                        <Clock className="w-4 h-4" />
                                        <span className="font-bold">{formatSeconds(remaining)}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <Tabs defaultValue="learn">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                        <TabsTrigger value="learn" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500">
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Apprendre
                        </TabsTrigger>
                        <TabsTrigger value="play" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500">
                            <Target className="w-4 h-4 mr-2" />
                            Jouer
                        </TabsTrigger>
                    </TabsList>

                <TabsContent value="learn" className="mt-4">
                    <Card className="p-6 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-slate-800/50 border-blue-500/20 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-blue-400/50">
                                    <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">
                                        {quiz.lesson?.title ?? levelTitle ?? "Quiz — Rappels et astuces"}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">Leçon interactive</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30">
                                <span className="text-xs font-bold text-blue-300">📚 Théorie</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                                <div className="flex items-start gap-3">
                                    <div className="w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full min-h-[40px]" />
                                    <div className="flex-1 space-y-2">
                                        {quiz.lesson?.content ? (
                                            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                                {quiz.lesson.content}
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm text-foreground leading-relaxed font-medium">
                                                    Révisez les concepts clés du niveau avant de jouer.
                                                </p>
                                                <div className="flex items-center gap-2 mt-3 p-2 rounded-md bg-background/50 border border-blue-500/20">
                                                    <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                    <p className="text-xs text-muted-foreground">
                                                        Astuce: lisez attentivement chaque énoncé et éliminez les réponses impossibles.
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {quiz.lesson?.resourceUrl && (
                                <Button 
                                    variant="secondary" 
                                    asChild
                                    className="w-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 border border-blue-400/30"
                                >
                                    <a href={quiz.lesson.resourceUrl} target="_blank" rel="noreferrer">
                                        <Lightbulb className="w-4 h-4 mr-2" />
                                        Consulter la documentation
                                    </a>
                                </Button>
                            )}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="play" className="mt-4">
                    <div className="space-y-4">
                        {!finished ? (
                            <div className="space-y-4">
                                {!started ? (
                                    <Card className="p-6 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-500/20 text-center">
                                        <div className="space-y-4">
                                            <div className="text-6xl mb-4">🧠</div>
                                            <h3 className="text-xl font-bold text-foreground">Prêt pour le quiz ?</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {quiz.timeLimitSeconds ? `${total} questions en ${formatSeconds(quiz.timeLimitSeconds)}` : `${total} questions t'attendent`}
                                            </p>
                                            <div className="flex items-center justify-center gap-3 pt-4">
                                                <Button 
                                                    onClick={() => setStarted(true)}
                                                    size="lg"
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
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
                                        {/* Question avec style immersif */}
                                        <Card className="p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-blue-500/30">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
                                                        <span className="text-xs font-bold text-blue-300">Question {currentIdx + 1}/{total}</span>
                                                    </div>
                                                    {typeof remaining === "number" && (
                                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${remaining <= 10 ? 'bg-red-500/20 border border-red-400/30' : 'bg-blue-500/20 border border-blue-400/30'}`}>
                                                            <Clock className={`w-4 h-4 ${remaining <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
                                                            <span className={`text-xs font-bold ${remaining <= 10 ? 'text-red-400' : 'text-blue-300'}`}>
                                                                {formatSeconds(remaining)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <p className="text-lg font-bold text-foreground leading-relaxed">{current.question}</p>
                                                    {current.imageUrl && (
                                                        <div className="mt-4 rounded-lg overflow-hidden border border-blue-500/30">
                                                            <img src={current.imageUrl} alt="" className="w-full max-h-64 object-cover" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Options avec style immersif */}
                                        <div className="grid gap-3">
                                            {current.options.map((opt) => {
                                                const isSelected = selected === opt.id;
                                                const isCorrect = locked && opt.id === current.correctOptionId;
                                                const isWrong = locked && isSelected && !isCorrect;
                                                return (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => onSelect(opt.id)}
                                                        disabled={locked}
                                                        className={[
                                                            "w-full text-left border-2 rounded-lg px-4 py-4 transition-all",
                                                            "hover:scale-[1.02] hover:shadow-lg",
                                                            locked ? "cursor-default" : "cursor-pointer",
                                                            isCorrect ? "border-green-500 bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-green-100 shadow-lg" : "",
                                                            isWrong ? "border-red-500 bg-gradient-to-r from-red-900/30 to-orange-900/30 text-red-100 shadow-lg" : "",
                                                            !isCorrect && !isWrong && isSelected ? "border-blue-500 bg-blue-500/20" : "border-blue-500/30 bg-background/50 hover:border-blue-400 hover:bg-blue-500/10",
                                                        ].join(" ")}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                                                                isCorrect ? "bg-green-500 text-white" :
                                                                isWrong ? "bg-red-500 text-white" :
                                                                isSelected ? "bg-blue-500 text-white" :
                                                                "bg-muted text-foreground"
                                                            }`}>
                                                                {opt.id.toUpperCase()}
                                                            </span>
                                                            <span className="flex-1 text-foreground font-medium">{opt.text}</span>
                                                            {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                                                            {isWrong && <XCircle className="w-5 h-5 text-red-400" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                 {/* Feedback et navigation */}
                                 {locked && (
                                     <Card className={`p-4 border-2 ${selected === current.correctOptionId ? "border-green-500/50 bg-gradient-to-br from-green-900/30 to-emerald-900/30" : "border-red-500/50 bg-gradient-to-br from-red-900/30 to-orange-900/30"}`}>
                                         <div className="space-y-3">
                                             <div className="flex items-center gap-2">
                                                 {selected === current.correctOptionId ? (
                                                     <CheckCircle2 className="w-6 h-6 text-green-400" />
                                                 ) : (
                                                     <XCircle className="w-6 h-6 text-red-400" />
                                                 )}
                                                 <span className={`font-bold text-lg ${selected === current.correctOptionId ? "text-green-400" : "text-red-400"}`}>
                                                     {selected === current.correctOptionId ? "Bonne réponse ! 🎉" : "Mauvaise réponse 😔"}
                                                 </span>
                                             </div>
                                             {current.explanation && (
                                                 <div className="text-sm text-muted-foreground p-3 rounded-lg bg-background/30 border border-border/50">
                                                     💡 {current.explanation}
                                                 </div>
                                             )}
                                             <div className="flex flex-col gap-2 pt-2">
                                                 {isCheatModeEnabled() && currentIdx + 1 < total && (
                                                     <Button 
                                                         onClick={autoAnswerAll}
                                                         variant="outline"
                                                         className="w-full border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20"
                                                     >
                                                         <Wand2 className="w-4 h-4 mr-2" />
                                                         ✨ Répondre à toutes les questions (Cheat)
                                                     </Button>
                                                 )}
                                                 <div className="flex justify-end">
                                                     <Button 
                                                         onClick={handleNext}
                                                         className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                                                     >
                                                         {currentIdx + 1 < total ? (
                                                             <>
                                                                 Question suivante
                                                                 <ArrowRight className="w-4 h-4 ml-2" />
                                                             </>
                                                         ) : (
                                                             <>
                                                                 <Trophy className="w-4 h-4 mr-2" />
                                                                 Voir les résultats
                                                             </>
                                                         )}
                                                     </Button>
                                                 </div>
                                             </div>
                                         </div>
                                     </Card>
                                 )}
                                 
                                 {/* Bouton cheat si pas encore répondu */}
                                 {!locked && !finished && isCheatModeEnabled() && (
                                     <Card className="p-4 border-blue-500/30 bg-blue-500/5">
                                         <Button 
                                             onClick={autoAnswerAll}
                                             variant="outline"
                                             className="w-full border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20"
                                         >
                                             <Wand2 className="w-4 h-4 mr-2" />
                                             ✨ Répondre automatiquement (Cheat)
                                         </Button>
                                     </Card>
                                 )}
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
                                
                                <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-blue-500/20">
                                    <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        Détail de vos réponses
                                    </p>
                                    <ul className="space-y-3">
                                        {preparedQuestions.map((q, idx) => {
                                            const r = results[idx];
                                            const correctLabel = q.options.find((o) => o.id === q.correctOptionId)?.text ?? q.correctOptionId;
                                            const selectedLabel = q.options.find((o) => o.id === r?.selected)?.text ?? r?.selected;
                                            return (
                                                <Card key={q.id} className={`p-4 border ${r?.correct ? "border-green-500/30 bg-green-900/20" : "border-red-500/30 bg-red-900/20"}`}>
                                                    <div className="flex items-start gap-3">
                                                        {r?.correct ? (
                                                            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                                        ) : (
                                                            <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                                        )}
                                                        <div className="flex-1 space-y-1">
                                                            <div className="font-medium text-sm text-foreground">
                                                                Q{idx + 1}. {q.question}
                                                            </div>
                                                            <div className={`text-xs font-medium ${r?.correct ? "text-green-400" : "text-red-400"}`}>
                                                                {r?.correct ? "✅ Correct" : "❌ Incorrect"}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                Votre réponse: <span className="font-mono bg-background/50 px-1.5 py-0.5 rounded">{selectedLabel ?? "—"}</span>
                                                            </div>
                                                            {!r?.correct && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    Bonne réponse: <span className="font-mono bg-background/50 px-1.5 py-0.5 rounded">{correctLabel}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </ul>
                                </Card>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
        </>
    );
}