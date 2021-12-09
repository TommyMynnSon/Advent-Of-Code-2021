import { createInterface } from 'readline'
import { createReadStream } from 'fs'

// Object to be used for deciding most common bit for each
// corresponding position.
//
// Given input is a list of lines with each line being a 
// a string of 12 binary bits.
//
// The mostCommonBits object maps each bit position to a value
// which represents the bit 0 (if negative) and bit 1 (if positive).
// The value for each key will be updated as lines are read from
// puzzle-input.txt.
const mostCommonBits = {
  '0': 0,
  '1': 0,
  '2': 0,
  '3': 0,
  '4': 0,
  '5': 0,
  '6': 0,
  '7': 0,
  '8': 0,
  '9': 0,
  '10': 0,
  '11': 0,
};

// Create interface for reading data from puzzle-input.txt.
const lineReader = createInterface({
  input: createReadStream('./puzzle-input.txt')
});

lineReader.on('line', (line) => {
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '0') {
      mostCommonBits[i]--;
    }

    if (line[i] === '1') {
      mostCommonBits[i]++;
    }
  }
});

lineReader.on('close', () => {
  console.log(getGammaRate() * getEpsilonRate());
});

// Logic to convert values of the mostCommonBits object
// to a binary representation of the most common bits for each position.
const calculateBinaryRepresentationOfMostCommonBits = (mostCommonBitsObject) => {
  let mostCommonBitsBinaryRepresentation = '';

  for (const position in mostCommonBitsObject) {
    if (mostCommonBitsObject[position] > 0) {
      mostCommonBitsBinaryRepresentation += '1';
    }

    if (mostCommonBitsObject[position] < 0) {
      mostCommonBitsBinaryRepresentation += '0';
    }
  }

  return mostCommonBitsBinaryRepresentation;
}

// Logic to convert values of the mostCommonBits object
// to a binary representation of the least common bits for each position.
const calculateBinaryRepresentationOfLeastCommonBits = (mostCommonBitsObject, callback) => {
  const mostCommonBitsBinaryRepresentation = callback(mostCommonBitsObject);
  let leastCommonBitsBinaryRepresentation = '';

  for (const bit of mostCommonBitsBinaryRepresentation) {
    if (bit === '0') {
      leastCommonBitsBinaryRepresentation += '1';
    }

    if (bit === '1') {
      leastCommonBitsBinaryRepresentation += '0';
    }
  }

  return leastCommonBitsBinaryRepresentation;
}

// Logic to convert a binary representation into a decimal value.
const convertBinaryRepresentationToDecimalValue = (binaryRepresentation) => {
  let decimalValue = parseInt(binaryRepresentation, 2);

  return decimalValue;
}

// Logic to calculate and get the gamma rate.
//
// Note: did not reduce coupling with parameters for cleaner code
//       and the helper functions above are readable enough to
//       understand what is going on in this function.
const getGammaRate = () => {
  const mostCommonBitsBinaryRepresentation = calculateBinaryRepresentationOfMostCommonBits(mostCommonBits);
  const decimalValue = convertBinaryRepresentationToDecimalValue(mostCommonBitsBinaryRepresentation);

  return decimalValue;
};

// Logic to calculate and get the epsilon rate.
//
// Note: did not reduce coupling with parameters for cleaner code
//       and the helper functions above are readable enough to
//       understand what is going on in this function.
const getEpsilonRate = () => {
  const leastCommonBitsBinaryRepresentation = calculateBinaryRepresentationOfLeastCommonBits(mostCommonBits, calculateBinaryRepresentationOfMostCommonBits);
  const decimalValue = convertBinaryRepresentationToDecimalValue(leastCommonBitsBinaryRepresentation);

  return decimalValue;
};