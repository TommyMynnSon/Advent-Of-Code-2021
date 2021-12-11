import { createInterface } from 'readline';
import { createReadStream } from 'fs';

// Boolean to determine if the first line (drawing numbers) has already been read.
let isFirstLineRead = false;

// Array to contain drawing numbers.
let drawingNumbers = [];

// Keeps track of the count of bingo boards.
let bingoBoardCounter = 1;

// Object to hold each bingo board.
const bingoBoards = {};

// Create interface for reading data from puzzle-input.txt.
const lineReader = createInterface({
  input: createReadStream('./puzzle-input.txt')
});

// Read each line and construct individual bingo boards
// within the bingoBoards object.
lineReader.on('line', (line) => {
  if (!isFirstLineRead) {
    drawingNumbers = line.split(',');
    isFirstLineRead = true;
  } else {
    if (bingoBoards[bingoBoardCounter] === undefined) {
      bingoBoards[bingoBoardCounter] = [];
    }

    if (line.length > 0 && bingoBoards[bingoBoardCounter].length <= 5) {
      bingoBoards[bingoBoardCounter].push(line.split(' ').filter(content => content.length > 0));
    }

    if (bingoBoards[bingoBoardCounter].length === 5) {
      bingoBoardCounter++;
    }
  }
});

// Output answer to terminal.
lineReader.on('close', () => {
  console.log(getFinalScoreOfWinningBingoBoard());
});

// Logic to check if a win is detected from a row of a bingo board (multi-dimensional array).
// Returns bingoBoard if a win is detected.
const checkRows = (bingoBoard) => {
  let markedCount = 0;

  for (let row = 0; row < bingoBoard.length; row++) {
    for (let position = 0; position < bingoBoard[row].length; position++) {
      if (bingoBoard[row][position] === 'x') {
        markedCount++;
      }
    }

    if (markedCount === 5) {
      return bingoBoard;
    } else {
      markedCount = 0;
    }
  }
};

// Logic to check if a win is detected from a column of a bingo board (multi-dimensional array).
// Returns bingoBoard if a win is detected.
const checkColumns = (bingoBoard) => {
  let markedCount = 0;

  for (let column = 0; column < bingoBoard[0].length; column++) {
    for (let position = 0; position < bingoBoard.length; position++) {
      if (bingoBoard[position][column] === 'x') {
        markedCount++;
      }
    }

    if (markedCount === 5) {
      return bingoBoard;
    } else {
      markedCount = 0;
    }
  }
};

// Logic to get the winning bingo board by checking
// each bingo board for either a win in one of its rows
// or columns.
const getWinningBingoBoard = () => {
  for (const bingoBoard in bingoBoards) {
    if (checkRows(bingoBoards[bingoBoard]) !== undefined) {
      return checkRows(bingoBoards[bingoBoard]);
    }

    if (checkColumns(bingoBoards[bingoBoard]) !== undefined) {
      return checkRows(bingoBoards[bingoBoard]);
    }
  }
};

// Logic to mark each bingo board with an 'x' if it has the current
// drawing number. Returns the winning bingo board and the drawing number
// that made it win if a winning board is detected after each drawing number
// check.
const markBingoBoards = () => {
  for (const drawingNumber of drawingNumbers) {
    for (const bingoBoard in bingoBoards) {
      for (let row = 0; row < bingoBoards[bingoBoard].length; row++) {
        for (let position = 0; position < bingoBoards[bingoBoard][row].length; position++) {
          if (bingoBoards[bingoBoard][row][position] === drawingNumber) {
            bingoBoards[bingoBoard][row][position] = 'x';

            if (getWinningBingoBoard() !== undefined) {
              return { winningBoard: getWinningBingoBoard(), latestDrawingNumber: drawingNumber };
            }
          }
        }
      }
    }
  }
};

// Logic to calculate and return the final score of a winning bingo board.
const getFinalScoreOfWinningBingoBoard = () => {
  const { winningBoard, latestDrawingNumber } = markBingoBoards();

  let finalScore = 0;

  for (let row = 0; row < winningBoard.length; row++) {
    for (let position = 0; position < winningBoard[row].length; position++) {
      if (winningBoard[row][position] !== 'x') {
        finalScore += parseInt(winningBoard[row][position]);
      }
    }
  }

  return finalScore * latestDrawingNumber;
};