import { useNavigate, useParams } from "react-router-dom";
import { levels as levelsByLanguage } from "@/data/levels.ts";
import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout.tsx";
import { Card } from "@/components/ui/card.tsx";
import { QuizRunner } from "@/components/minigames/QuizRunner";
import { CodeFillRunner } from "@/components/minigames/CodeFillRunner";
import { HtmlBuilderRunner } from "@/components/minigames/HtmlBuilderRunner";

type RouteParams = {
    id?: string; // language id (e.g., "python")
    levelId?: string; // level id (e.g., "py-lvl-3") or level number as string (e.g., "3")
};

const Level = () => {
    const { id, levelId } = useParams<RouteParams>();
    const navigate = useNavigate();

    if (!id) {
        return <div>Aucune langue spécifiée.</div>;
    }

    const langLevels = levelsByLanguage[id] ?? [];

    if (langLevels.length === 0) {
        return <div>Langue inconnue: {id}</div>;
    }

    // If a levelId is provided, try to match by id or by levelNumber
    const level =
        (levelId
            ? langLevels.find(
                (l) => l.id === levelId || String(l.levelNumber) === levelId
            )
            : undefined) ??
        // Fallback: first incomplete level, else first level
        langLevels.find((l) => !l.isCompleted) ??
        langLevels[0];

    if (!level) {
        return <div>Niveau introuvable pour la langue: {id}</div>;
    }

    const minigame = level.minigame;

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate(`/language/${id}`)}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </Button>
                <Card className="p-4 border-border bg-card transition-all">
                    <div className="flex items-start gap-4">
                        {/* Level Number Badge */}
                        <div className="relative">
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center font-bold text-lg">
                                {level.levelNumber}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-bold text-foreground">{level.title}</h4>
                            </div>

                            <p className="text-sm text-muted-foreground mb-2">
                                {level.description}
                            </p>

                            {/* Zone mini-jeu */}
                            {minigame?.type === "quiz" ? (
                                <QuizRunner
                                    // @ts-expect-error: typage simplifié pour intégration rapide
                                    quiz={minigame}
                                    languageId={id}
                                    levelKey={level.id}
                                />
                            ) : minigame?.type === "code-fill" ? (
                                <CodeFillRunner
                                    // @ts-expect-error: typage simplifié pour intégration rapide
                                    game={minigame}
                                    languageId={id}
                                    levelKey={level.id}
                                />
                            ) : minigame?.type === "html-builder" ? (
                                <HtmlBuilderRunner
                                    // @ts-expect-error: typage simplifié pour intégration rapide
                                    game={minigame}
                                    onExit={() => navigate(`/language/${id}`)}
                                />
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    Aucun mini‑jeu disponible pour ce niveau.
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Level;