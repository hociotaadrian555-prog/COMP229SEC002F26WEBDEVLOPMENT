
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Game2048.css";

const SIZE = 4;

let nextId = 1;

function createTile(value, row, col, isNew = false) {
    return {
        id: nextId++,
        value,
        row,
        col,
        isNew,
        merged: false
    };
}

function createEmptyBoard() {
    return Array(SIZE * SIZE).fill(null);
}

function addRandomTile(board) {
    const emptySpots = board
        .map((tile, index) => tile === null ? index : -1)
        .filter(index => index !== -1);

    if (emptySpots.length === 0) return board;

    const randomIndex =
        emptySpots[Math.floor(Math.random() * emptySpots.length)];

    const newBoard = [...board];
    const row = Math.floor(randomIndex / SIZE);
    const col = randomIndex % SIZE;

    newBoard[randomIndex] = createTile(
        Math.random() < 0.9 ? 2 : 4,
        row,
        col,
        true
    );

    return newBoard;
}

function createStartingBoard() {
    let board = createEmptyBoard();
    board = addRandomTile(board);
    board = addRandomTile(board);
    return board;
}

function Game2048() {
    const [board, setBoard] = useState(createStartingBoard);
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(
        Number(localStorage.getItem("2048-best")) || 0
    );

    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [keepPlaying, setKeepPlaying] = useState(false);

    // Show instructions automatically when the game opens
    const [showInstructions, setShowInstructions] = useState(true);

    const restartGame = () => {
        setBoard(createStartingBoard());
        setScore(0);
        setGameOver(false);
        setWon(false);
        setKeepPlaying(false);
    };

    const move = useCallback((direction) => {
        setBoard(previousBoard => {
            if (gameOver || (won && !keepPlaying)) {
                return previousBoard;
            }

            const newBoard = createEmptyBoard();
            let moved = false;
            let gainedScore = 0;

            for (let line = 0; line < SIZE; line++) {
                let indexes = [];

                for (let step = 0; step < SIZE; step++) {
                    let row;
                    let col;

                    if (direction === "left") {
                        row = line;
                        col = step;
                    } else if (direction === "right") {
                        row = line;
                        col = SIZE - 1 - step;
                    } else if (direction === "up") {
                        row = step;
                        col = line;
                    } else {
                        row = SIZE - 1 - step;
                        col = line;
                    }

                    indexes.push(row * SIZE + col);
                }

                const tiles = indexes
                    .map(index => previousBoard[index])
                    .filter(Boolean);

                const compressed = [];

                for (let i = 0; i < tiles.length; i++) {
                    if (
                        i < tiles.length - 1 &&
                        tiles[i].value === tiles[i + 1].value
                    ) {
                        const newValue = tiles[i].value * 2;

                        compressed.push({
                            ...tiles[i],
                            value: newValue,
                            merged: true,
                            isNew: false
                        });

                        gainedScore += newValue;
                        i++;
                    } else {
                        compressed.push({
                            ...tiles[i],
                            merged: false,
                            isNew: false
                        });
                    }
                }

                indexes.forEach((index, position) => {
                    const tile = compressed[position];

                    if (tile) {
                        const row = Math.floor(index / SIZE);
                        const col = index % SIZE;

                        if (
                            previousBoard[index] === null ||
                            previousBoard[index].id !== tile.id ||
                            previousBoard[index].value !== tile.value
                        ) {
                            moved = true;
                        }

                        newBoard[index] = {
                            ...tile,
                            row,
                            col
                        };
                    }
                });
            }

            if (!moved) return previousBoard;

            let updatedBoard = addRandomTile(newBoard);

            setScore(currentScore => {
                const updatedScore = currentScore + gainedScore;

                setBest(currentBest => {
                    const newBest = Math.max(currentBest, updatedScore);
                    localStorage.setItem("2048-best", newBest);
                    return newBest;
                });

                return updatedScore;
            });

            if (
                updatedBoard.some(tile => tile?.value === 2048) &&
                !won
            ) {
                setWon(true);
            }

            setTimeout(() => {
                const hasMoves = updatedBoard.some(tile => {
                    if (!tile) return false;

                    const row = tile.row;
                    const col = tile.col;

                    const neighbors = [
                        [row - 1, col],
                        [row + 1, col],
                        [row, col - 1],
                        [row, col + 1]
                    ];

                    return neighbors.some(([r, c]) => {
                        if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) {
                            return false;
                        }

                        const neighbor = updatedBoard[r * SIZE + c];

                        return !neighbor || neighbor.value === tile.value;
                    });
                });

                if (!hasMoves) setGameOver(true);
            }, 200);

            return updatedBoard;
        });
    }, [gameOver, won, keepPlaying]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const keys = {
                ArrowUp: "up",
                w: "up",
                W: "up",
                ArrowDown: "down",
                s: "down",
                S: "down",
                ArrowLeft: "left",
                a: "left",
                A: "left",
                ArrowRight: "right",
                d: "right",
                D: "right"
            };

            const direction = keys[event.key];

            if (direction) {
                event.preventDefault();

                // Don't move tiles while instructions are open
                if (!showInstructions) {
                    move(direction);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [move, showInstructions]);

    return (
        <div className="portfolio-2048">
            <div className="game2048-container">

                <div className="game2048-top">
                    <Link to="/project" className="game2048-back">
                        ← Back to Projects
                    </Link>
                </div>

                <div className="game2048-header">
                    <div>
                        <h1>2048</h1>
                        <p>Join the numbers and reach 2048!</p>
                    </div>

                    <button
                        className="game2048-new"
                        onClick={restartGame}
                    >
                        New Game
                    </button>
                </div>

                <div className="game2048-scores">
                    <div className="game2048-score">
                        <span>SCORE</span>
                        <strong>{score}</strong>
                    </div>

                    <div className="game2048-score">
                        <span>BEST</span>
                        <strong>{best}</strong>
                    </div>
                </div>

                <div className="game2048-board">
                    {Array.from({ length: 16 }).map((_, index) => (
                        <div className="game2048-cell" key={index} />
                    ))}

                    {board.map(tile => {
                        if (!tile) return null;

                        return (
                            <div
                                key={tile.id}
                                className={[
                                    "game2048-tile",
                                    `tile-${tile.value}`,
                                    tile.isNew ? "tile-new" : "",
                                    tile.merged ? "tile-merged" : ""
                                ].join(" ")}
                                style={{
                                    left: `calc(${tile.col * 25}% + ${tile.col * 2.5}px)`,
                                    top: `calc(${tile.row * 25}% + ${tile.row * 2.5}px)`
                                }}
                            >
                                {tile.value}
                            </div>
                        );
                    })}
                </div>

                <div className="game2048-instructions">
                    <strong>How to play</strong>
                    <p>
                        Use your <b>arrow keys</b> or <b>WASD</b> to move
                        the tiles. Matching numbers combine into one!
                    </p>
                </div>

                {/* How to Play Popup */}
                {showInstructions && (
                    <div className="game2048-overlay">
                        <div className="game2048-popup">
                            <h2>How to Play</h2>

                            <p>
                                Welcome to 2048! Your goal is to reach
                                the 2048 tile.
                            </p>

                            <div className="how-to-play-details">
                                <p>
                                    <strong>1. Move Tiles</strong>
                                    <br />
                                    Use your arrow keys or WASD to move
                                    the numbers.
                                </p>

                                <p>
                                    <strong>2. Combine Numbers</strong>
                                    <br />
                                    Match two tiles with the same number
                                    to combine them.
                                </p>

                                <p>
                                    <strong>3. Reach 2048</strong>
                                    <br />
                                    Keep combining numbers until you
                                    create the 2048 tile!
                                </p>

                                <p>
                                    <strong>4. Watch the Board</strong>
                                    <br />
                                    Don't let the board fill up. If you
                                    run out of moves, the game is over.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowInstructions(false)}
                            >
                                Got It, Let's Play!
                            </button>
                        </div>
                    </div>
                )}

                {/* Win Popup */}
                {won && (
                    <div className="game2048-overlay">
                        <div className="game2048-popup">
                            <h2>You Win!</h2>
                            <p>You reached 2048!</p>

                            <button
                                onClick={() => setKeepPlaying(true)}
                            >
                                Keep Playing
                            </button>

                            <button onClick={restartGame}>
                                New Game
                            </button>
                        </div>
                    </div>
                )}

                {/* Game Over Popup */}
                {gameOver && (
                    <div className="game2048-overlay">
                        <div className="game2048-popup">
                            <h2>Game Over!</h2>
                            <p>Final Score: {score}</p>

                            <button onClick={restartGame}>
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Game2048;
