import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useCountdown } from "@/hooks/useCountdown";

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
                           }: {
    quiz: QuizMinigame;
    languageId: string;
    levelKey: string;
}) {
    const passing = quiz.passingScorePercent ?? 70;

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

    const remaining = useCountdown(quiz.timeLimitSeconds, !finished);

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
        setResults((prev) => [
            ...prev,
            { questionId: current.id, selected: optionId, correct: isCorrect },
        ]);
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
    };

    return (
        <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                {!finished ? (
                    <>
            <span>
              Question {currentIdx + 1} / {total}
            </span>
                        {typeof remaining === "number" && (
                            <span className={remaining <= 10 ? "text-red-500" : ""}>
                {formatSeconds(remaining)}
              </span>
                        )}
                    </>
                ) : (
                    <span>Quiz terminé</span>
                )}
            </div>

            {!finished ? (
                <div className="space-y-4">
                    <div>
                        <p className="font-medium text-foreground">{current.question}</p>
                        {current.imageUrl && (
                            <img
                                src={current.imageUrl}
                                alt=""
                                className="mt-2 rounded-md max-h-56 object-cover"
                            />
                        )}
                    </div>

                    <div className="grid gap-2">
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
                                        "w-full text-left border rounded-md px-3 py-2 transition-colors",
                                        "hover:bg-muted",
                                        locked ? "cursor-default" : "cursor-pointer",
                                        isCorrect
                                            ? "border-green-500 bg-green-50 text-green-700"
                                            : "",
                                        isWrong
                                            ? "border-red-500 bg-red-50 text-red-700"
                                            : "",
                                        !isCorrect && !isWrong && isSelected
                                            ? "border-primary"
                                            : "border-border",
                                    ].join(" ")}
                                >
                                    <div className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                      {opt.id.toUpperCase()}
                    </span>
                                        <span>{opt.text}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {locked && (
                        <div className="space-y-3">
                            <div
                                className={[
                                    "text-sm",
                                    selected === current.correctOptionId
                                        ? "text-green-700"
                                        : "text-red-700",
                                ].join(" ")}
                            >
                                {selected === current.correctOptionId
                                    ? "Bonne réponse !"
                                    : "Mauvaise réponse."}
                            </div>
                            {current.explanation && (
                                <div className="text-sm text-muted-foreground">
                                    {current.explanation}
                                </div>
                            )}
                            <div className="flex justify-end">
                                <Button onClick={handleNext}>
                                    {currentIdx + 1 < total ? "Suivant" : "Terminer"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <div
                        className={[
                            "p-4 rounded-md border",
                            passed
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-amber-500 bg-amber-50 text-amber-700",
                        ].join(" ")}
                    >
                        <div className="font-semibold">
                            {passed ? "Bravo !" : "C'est presque bon !"}
                        </div>
                        <div className="text-sm mt-1">
                            Score: {correctCount} / {total} ({scorePercent}%) — Seuil: {passing}%.
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={handleRestart}>
                            Recommencer
                        </Button>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm font-medium text-foreground mb-2">
                            Vos réponses
                        </p>
                        <ul className="space-y-2">
                            {preparedQuestions.map((q, idx) => {
                                const r = results[idx];
                                const correctLabel =
                                    q.options.find((o) => o.id === q.correctOptionId)?.text ??
                                    q.correctOptionId;
                                const selectedLabel =
                                    q.options.find((o) => o.id === r?.selected)?.text ??
                                    r?.selected;

                                return (
                                    <li
                                        key={q.id}
                                        className="border rounded-md p-3 text-sm border-border"
                                    >
                                        <div className="font-medium mb-1">
                                            Q{idx + 1}. {q.question}
                                        </div>
                                        <div
                                            className={r?.correct ? "text-green-700" : "text-red-700"}
                                        >
                                            {r?.correct ? "Correct" : "Incorrect"}
                                        </div>
                                        <div className="text-muted-foreground">
                                            Votre réponse: {selectedLabel ?? "—"}
                                        </div>
                                        <div className="text-muted-foreground">
                                            Bonne réponse: {correctLabel}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}