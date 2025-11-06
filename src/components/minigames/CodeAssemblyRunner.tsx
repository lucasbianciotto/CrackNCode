import React, { useState } from "react";
import { CodeAssemblyMinigame } from "@/types";

interface CodeAssemblyRunnerProps {
    game: CodeAssemblyMinigame;
    onComplete: (success: boolean) => void;
}

export const CodeAssemblyRunner: React.FC<CodeAssemblyRunnerProps> = ({ game, onComplete }) => {
    const [blocks, setBlocks] = useState(game.blocks);

    // Permet de réorganiser les blocs
    const moveBlock = (fromIndex: number, toIndex: number) => {
        const updatedBlocks = [...blocks];
        const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
        updatedBlocks.splice(toIndex, 0, movedBlock);
        setBlocks(updatedBlocks);
    };

    // Valide la solution
    const validateSolution = () => {
        const currentOrder = blocks.map((block) => block.id);
        const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(game.solutionOrder);
        onComplete(isCorrect);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold">Assemblez le code :</h3>
            <div className="space-y-2">
                {blocks.map((block, index) => (
                    <div key={block.id} className="p-2 border rounded bg-muted">
                        <div className="flex items-center justify-between">
                            <pre className="text-sm">{block.content}</pre>
                            <div className="flex gap-2">
                                {index > 0 && (
                                    <button onClick={() => moveBlock(index, index - 1)}>↑</button>
                                )}
                                {index < blocks.length - 1 && (
                                    <button onClick={() => moveBlock(index, index + 1)}>↓</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={validateSolution} className="btn btn-primary">
                Valider
            </button>
        </div>
    );
};