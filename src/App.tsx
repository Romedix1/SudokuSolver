import React, { useState, useEffect } from 'react';
import './style.css';

function App() {
    const [boardSize, setBoardSize] = useState(3);
    const [board, setBoard] = useState<any[][]>([]);
    const [solvedBoard, setSolvedBoard] = useState<string[][]>([]);
    const [error, setError] = useState<string[]>([]);
    const [solving, setSolving] = useState(false);

    const borderStyle = (index: number, boardSize: number) => {
        let borders = 'border ';

        if (boardSize === 3) {
            if ((index + 1) % 3 === 0 && (index + 1) % 9 !== 0) {
                borders += 'border-r-8 ';
            }
            if (Math.floor(index / 9) % 3 === 2 && index < 72) {
                borders += 'border-b-8 ';
            }
        } else if (boardSize === 4) {
            if ((index + 1) % 4 === 0 && (index + 1) % 16 !== 0) {
                borders += 'border-r-8 ';
            }
            if (Math.floor(index / 16) % 4 === 3 && index < 240) {
                borders += 'border-b-8 ';
            }
        }

        return borders;
    };

    useEffect(() => {
        const size = boardSize * boardSize;
        const initialBoard = Array.from({ length: size }, () => Array(size).fill(""));
        setBoard(initialBoard);
        setSolvedBoard(initialBoard);
    }, [boardSize]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value.toUpperCase();
        const row = Math.floor(index / (boardSize * boardSize));
        const col = index % (boardSize * boardSize);

        const updatedBoard = [...board];
        if (boardSize === 3) {
            if (value.length === 1 && /[1-9]/.test(value)) {
                updatedBoard[row][col] = parseInt(value, 10);
            } else {
                updatedBoard[row][col] = "";
            }
        } else if (boardSize === 4) {
            if (value.length === 1 && /[1-9A-G]/.test(value)) {
                updatedBoard[row][col] = value;
            } else {
                updatedBoard[row][col] = "";
            }
        }

        setBoard(updatedBoard);

        const nextIndex = index + 1;
        const nextInput = document.getElementById(`box-${nextIndex}`);
        if (nextInput) {
            nextInput.focus();
        }
    };

    const findEmptyCell = (board: string[][]) => {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === "" || board[row][col] === "0") {
                    return [row, col];
                }
            }
        }
        return null;
    };

    const canPlaceValue = (value: any, row: number, col: number) => {
        for (let i = 0; i < boardSize * boardSize; i++) {
            if (board[row][i] === value && i !== col) {
                return false;
            }
        }

        for (let i = 0; i < boardSize * boardSize; i++) {
            if (board[i][col] === value && i !== row) {
                return false;
            }
        }

        const squareSize = boardSize === 3 ? 3 : 4;
        const rowStart = Math.floor(row / squareSize) * squareSize;
        const colStart = Math.floor(col / squareSize) * squareSize;
        for (let i = 0; i < squareSize; i++) {
            for (let j = 0; j < squareSize; j++) {
                if (
                    board[rowStart + i][colStart + j] === value &&
                    (rowStart + i !== row || colStart + j !== col)
                ) {
                    return false;
                }
            }
        }

        return true;
    };

    const isValidBoard = (board: string[][]): string[] => {
        const seen: Set<string> = new Set();
        const errors: string[] = [];

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const value = board[row][col];
                if (value) {
                    const rowKey = `row-${row}-${value}`;
                    const colKey = `col-${col}-${value}`;
                    const boxKey = `box-${Math.floor(row / 2)}-${Math.floor(col / 2)}-${value}`;

                  if (seen.has(rowKey)) {
                    errors.push(`Duplicate in row ${row + 1}: ${value}`);
                  }
                  if (seen.has(colKey)) {
                    errors.push(`Duplicate in column ${col + 1}: ${value}`);
                  }
                  if (seen.has(boxKey)) {
                    errors.push(`Duplicate in box ${Math.floor(row / 2) + 1}-${Math.floor(col / 2) + 1}: ${value}`);
                  }

                    seen.add(rowKey);
                    seen.add(colKey);
                    seen.add(boxKey);
                }
            }
        }

        return errors;
    };

    const solveSudoku = () => {
        const validationErrors = isValidBoard(board);
        if (validationErrors.length > 0) {
            setError(validationErrors);
            return;
        }

        const solve = (board: any[][]): boolean => {
            const emptyCell = findEmptyCell(board);
            if (!emptyCell) {
                return true; 
            }

            const [row, col] = emptyCell;
            const possibilities = boardSize === 3
                ? [1, 2, 3, 4, 5, 6, 7, 8, 9]
                : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G"];

            for (let value of possibilities) {
                if (canPlaceValue(value, row, col)) {
                    board[row][col] = value;

                    if (solve(board)) {
                        return true;
                    }

                    board[row][col] = "";
                }
            }

            return false;
        };

        setSolving(true);
        const boardCopy = [...board];
        if (solve(boardCopy)) {
            setSolvedBoard(boardCopy);
            setError([]);
        } else {
            setError(["Nie udało się rozwiązać Sudoku"]);
        }
        setSolving(false);
    };

    return (
        <div className="flex flex-col items-center mt-12 mb-12">
            <h1 className="text-xl mb-4">Sudoku Grid {boardSize}x{boardSize}</h1>
            <div className="mb-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white mr-2"
                    onClick={() => setBoardSize(3)}
                >
                    3x3
                </button>
                <button
                    className="px-4 py-2 bg-green-500 text-white"
                    onClick={() => setBoardSize(4)}
                >
                    4x4
                </button>
            </div>

            <div className={`grid place-items-center gap-0 ${boardSize === 3 ? 'grid-cols-9' : 'grid-cols-custom'}`}>
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <input
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, rowIndex * (boardSize * boardSize) + colIndex)}
                            id={`box-${rowIndex * (boardSize * boardSize) + colIndex}`}
                            maxLength={1}
                            type="text"
                            key={rowIndex * (boardSize * boardSize) + colIndex}
                            value={solvedBoard[rowIndex][colIndex] || board[rowIndex][colIndex] || ''}
                            className={`w-12 h-12 bg-red-200 text-center outline-none ${borderStyle(rowIndex * (boardSize * boardSize) + colIndex, boardSize)}`}
                        />
                    ))
                )}
            </div>

            <button
                className="px-4 py-2 bg-green-500 text-white mt-4"
                onClick={solveSudoku}
                disabled={solving}
            >
                Solve
            </button>

            {error.length > 0 && (
                <div className="text-red-500">
                    {error.map((err, index) => (
                        <p key={index}>{err}</p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;
