import { createInterface } from 'readline';
import { createReadStream } from 'fs';

// Will be populated with data from puzzle-input.txt.
const depths = [];

// Create interface for reading data from puzzle-input.txt.
const lineReader = createInterface({
  input: createReadStream('./puzzle-input.txt')
});

// Parse each line from puzzle-input.txt to an integer
// before pushing into depths array.
lineReader.on('line', (line) => {
  depths.push(parseInt(line));
});

// Once reading each line of puzzle-input.txt is done,
// call countDepthIncreases with now-populated depths
// array as argument and ouput its return value (the answer).
lineReader.on('close', () => {
  console.log(countDepthIncreases(depths));
});

// Logic to count number of times a depth measurement increases
// from the previous.
const countDepthIncreases = (depths) => {
  let count = 0;

  for (let i = 1; i < depths.length; i++) {
    if (depths[i] > depths[i - 1]) {
      count++;
    }
  }

  return count;
};