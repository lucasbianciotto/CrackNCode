import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useCountdown } from "@/hooks/useCountdown";

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
                               }: {
    game: CodeFillMinigame;
    languageId: string;
    levelKey: string;
}) {
    const passing = game.passingScorePercent ?? 100;

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

    const remaining = useCountdown(game.timeLimitSeconds, !finished);

    // reset si on change de level
    useEffect(() => {
        setValues(initialValues);
        setFinished(false);
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
    };

    return (
        <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                {!finished ? (
                    <>
            <span>
              Blocs à compléter: {correctCount}/{total} corrects (provisoire)
            </span>
                        {typeof remaining === "number" && (
                            <span className={remaining <= 10 ? "text-red-500" : ""}>
                {formatSeconds(remaining)}
              </span>
                        )}
                    </>
                ) : (
                    <span>Exercice terminé</span>
                )}
            </div>

            {/* Zone code */}
            <div className="border rounded-md p-3 bg-muted">
        <pre className="font-mono text-sm whitespace-pre-wrap break-words">
          {tokens.map((tk, idx) =>
              tk.type === "text" ? (
                  <span key={idx}>{tk.text}</span>
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

            {/* Actions */}
            {!finished ? (
                <div className="flex items-center gap-2">
                    <Button onClick={handleFinish}>Terminer</Button>
                    <Button variant="secondary" onClick={handleRestart}>
                        Réinitialiser
                    </Button>
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
                            Score: {correctCount} / {total} ({scorePercent}%) — Seuil:{" "}
                            {passing}%.
                        </div>
                    </div>

                    {/* Détails des réponses avec explications */}
                    <div className="space-y-2">
                        {game.blanks.map((b) => {
                            const ok = (resultPerBlank as any)[b.id];
                            const expected = Array.isArray(b.answer)
                                ? b.answer.join(" | ")
                                : b.answer;
                            return (
                                <div
                                    key={b.id}
                                    className={[
                                        "border rounded-md p-3 text-sm",
                                        ok
                                            ? "border-green-300 bg-green-50"
                                            : "border-red-300 bg-red-50",
                                    ].join(" ")}
                                >
                                    <div className="font-medium mb-1">
                                        Trou n°{b.id}: {ok ? "Correct" : "Incorrect"}
                                    </div>
                                    {!ok && (
                                        <div className="text-muted-foreground">
                                            Votre réponse: “{values[b.id] ?? ""}”
                                        </div>
                                    )}
                                    <div className="text-muted-foreground">
                                        Réponse attendue: {expected}
                                    </div>
                                    {b.explanation && (
                                        <div className="text-muted-foreground mt-1">
                                            {b.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={handleRestart}>
                            Recommencer
                        </Button>
                    </div>
                </div>
            )}
        </div>
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
        "align-baseline inline-flex items-center mx-1 px-1 rounded-sm";
    const borderClass = showResult
        ? correct
            ? "outline outline-2 outline-green-500"
            : "outline outline-2 outline-red-500"
        : "outline outline-1 outline-border";
    const commonStyle = [
        "font-mono text-sm bg-background",
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