import { createInterface } from 'readline';
import { createReadStream } from 'fs';

// Will be updated as input is read from puzzle-input.txt.
const tally = {
  depth: 0,
  horizontalPosition: 0
};

// Create interface for reading data from puzzle-input.txt.
const lineReader = createInterface({
  input: createReadStream('./puzzle-input.txt')
});

// Update tally object as each line is read for
// the type of move (e.g., up, down, and forward)
// and its magnitude.
lineReader.on('line', (line) => {
  if (line.includes('up')) {
    tally.depth -= (parseInt(line.substr(-1)));
  }

  if (line.includes('down')) {
    tally.depth += (parseInt(line.substr(-1)));
  }

  if (line.includes('forward')) {
    tally.horizontalPosition += (parseInt(line.substr(-1)));
  }
});

// Once reading each line of puzzle-input.txt is done,
// call multiplyFinalDepthByFinalHorizontalPosition
// with values of the depth and horizontalPosition 
// properties of the tally object and output its return value
// (the answer).
lineReader.on('close', () => {
  console.log(multiplyFinalDepthByFinalHorizontalPosition(tally.depth, tally.horizontalPosition));
});

// Logic to multiply final depth and final horizontal position.
const multiplyFinalDepthByFinalHorizontalPosition = (finalDepth, finalHorizontalPosition) => {
  return finalDepth * finalHorizontalPosition;
};

