import React, { useState, useEffect } from "react";
import { BossBattleMinigame } from "@/types";
import {Button} from "@/components/ui/button.tsx";

interface BossBattleMinigameProps {
    game: BossBattleMinigame;
    onComplete: (success: boolean) => void;
}

export const BossBattleMinigame: React.FC<BossBattleMinigameProps> = ({ game, onComplete }) => {
    const [bossHealth, setBossHealth] = useState(game.boss.maxHealth);
    const [playerHealth, setPlayerHealth] = useState(game.playerHealth);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(game.questions[0].timeLimitSeconds);
    const [isGameOver, setIsGameOver] = useState(false);

    const currentQuestion = game.questions[currentQuestionIndex];

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            handleAnswer(null); // Time ran out
        }
    }, [timeLeft]);

    const handleAnswer = (answer: string | null) => {
        if (isGameOver) return;

        if (answer === currentQuestion.correctAnswer) {
            setBossHealth((prev) => Math.max(prev - 10, 0));
        } else {
            setPlayerHealth((prev) => Math.max(prev - 10, 0));
        }

        if (bossHealth - 10 <= 0) {
            setIsGameOver(true);
            onComplete(true); // Player wins
        } else if (playerHealth - 10 <= 0) {
            setIsGameOver(true);
            onComplete(false); // Player loses
        } else {
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < game.questions.length) {
                setCurrentQuestionIndex(nextIndex);
                setTimeLeft(game.questions[nextIndex].timeLimitSeconds);
            } else {
                setCurrentQuestionIndex(0); // Loop back to the first question
                setTimeLeft(game.questions[0].timeLimitSeconds);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold">{game.boss.name}</h3>
                    <img src={game.boss.imageUrl} alt={game.boss.name} className="w-32 h-32" />
                </div>
                <div>
                    <p>Vie du Boss: {bossHealth}</p>
                    <p>Vie du Joueur: {playerHealth}</p>
                </div>
            </div>
            <div>
                <h4 className="font-bold">{currentQuestion.question}</h4>
                <div className="space-y-2">
                    {currentQuestion.choices.map((choice, index) => (
                        <Button
                            key={index}
                            onClick={() => handleAnswer(choice)}
                            className="btn btn-primary m-2"
                            aria-label={`Choix ${index + 1}: ${choice}`}
                        >
                            {choice}
                        </Button>
                    ))}
                </div>
                <p>Temps restant: {timeLeft}s</p>
            </div>
        </div>
    );
};