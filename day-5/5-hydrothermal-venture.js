import { createInterface } from 'readline';
import { createReadStream } from 'fs';

// Keeps track of the number of hydrothermal vent lines
// read from puzzle-input.txt.
let numberOfHydrothermalVents = 1;

// Object to act as storage for all hydrothermal vent lines
// read from puzzle-input.txt.
const hydrothermalVentLines = {};

// Object to keep track of points that get touched by hydrothermal vent lines.
const touchedPoints = {};

// Create interface for reading data from puzzle-input.txt.
const lineReader = createInterface({
  input: createReadStream('./puzzle-input.txt')
});

// Read each line of puzzle-input.txt and store the coordinates 
// of each hydrothermal vent line into the hydrothermalVentLines object.
lineReader.on('line', (line) => {
  const coordinatesOfEnds = [];

  line.split(' -> ').forEach((coordinateOfOneEnd) => {
    coordinatesOfEnds.push(coordinateOfOneEnd.split(',').map((number) => parseInt(number)));
  });

  hydrothermalVentLines[numberOfHydrothermalVents] = coordinatesOfEnds;
  numberOfHydrothermalVents++;
});

// Output answer.
lineReader.on('close', () => {
  console.log('dangerous points:', getNumberOfDangerousPoints());
});

// Given the coordinates of a vertical hydrothermal vent line, updates
// the touchedPoints object.
const markPointsVertically = (hydrothermalVentLine) => {
  if (hydrothermalVentLine[0][1] > hydrothermalVentLine[1][1]) {
    for (let i = hydrothermalVentLine[1][1]; i <= hydrothermalVentLine[0][1]; i++) {
      if (touchedPoints[[hydrothermalVentLine[0][0], i].toString()] === undefined) {
        touchedPoints[[hydrothermalVentLine[0][0], i].toString()] = 1;
      } else {
        touchedPoints[[hydrothermalVentLine[0][0], i].toString()]++;
      }
    }
  } else {
    for (let i = hydrothermalVentLine[0][1]; i <= hydrothermalVentLine[1][1]; i++) {
      if (touchedPoints[[hydrothermalVentLine[0][0], i].toString()] === undefined) {
        touchedPoints[[hydrothermalVentLine[0][0], i].toString()] = 1;
      } else {
        touchedPoints[[hydrothermalVentLine[0][0], i].toString()]++;
      }
    }
  }
};

// Given the coordinates of a horizontal hydrothermal vent line, updates
// the touchedPoints object.
const markPointsHorizontally = (hydrothermalVentLine) => {
  if (hydrothermalVentLine[0][0] > hydrothermalVentLine[1][0]) {
    for (let i = hydrothermalVentLine[1][0]; i <= hydrothermalVentLine[0][0]; i++) {
      if (touchedPoints[[i, hydrothermalVentLine[0][1]].toString()] === undefined) {
        touchedPoints[[i, hydrothermalVentLine[0][1]].toString()] = 1;
      } else {
        touchedPoints[[i, hydrothermalVentLine[0][1]].toString()]++;
      }
    }
  } else {
    for (let i = hydrothermalVentLine[0][0]; i <= hydrothermalVentLine[1][0]; i++) {
      if (touchedPoints[[i, hydrothermalVentLine[0][1]].toString()] === undefined) {
        touchedPoints[[i, hydrothermalVentLine[0][1]].toString()] = 1;
      } else {
        touchedPoints[[i, hydrothermalVentLine[0][1]].toString()]++;
      }
    }
  }
};

// Given the coordinates of a diagonal hydrothermal vent line, updates
// the touchedPoints object.
//
// All variations of diagonals:
// Positive slope hydrothermal vent line with a lower first point: (421, 667) -> (902, 186) | 421,667 - 422,666, 423,665 - ... - 902,186
// Positive slope hydrothermal vent line with a higher first point: (939, 372) -> (354, 957) | 939,372 - 938,373 - 937,374 - ... - 354,957 
// Negative slope hydrothermal vent line with a lower first point: (313, 762) -> (198, 647) | 313,762 - 312,761 - 311,760 - ... - 198,647
// Negative slope hydrothermal vent line with a higher first point: (380, 148) -> (631, 399) |  380,148 - 381,149 - 382,150 - ... - 631,399
const markPointsDiagonally = (hydrothermalVentLine) => {
  if (hydrothermalVentLine[0][0] < hydrothermalVentLine[1][0] && hydrothermalVentLine[0][1] > hydrothermalVentLine[1][1]) {
    for (let i = 0; i <= hydrothermalVentLine[1][0] - hydrothermalVentLine[0][0]; i++) {
      if (touchedPoints[[hydrothermalVentLine[0][0] + i, hydrothermalVentLine[0][1] - i].toString()] === undefined) {
        touchedPoints[[hydrothermalVentLine[0][0] + i, hydrothermalVentLine[0][1] - i].toString()] = 1;
      } else {
        touchedPoints[[hydrothermalVentLine[0][0] + i, hydrothermalVentLine[0][1] - i].toString()]++;
      }
    }
  }

  if (hydrothermalVentLine[0][0] > hydrothermalVentLine[1][0] && hydrothermalVentLine[0][1] < hydrothermalVentLine[1][1]) {
    for (let i = 0; i <= hydrothermalVentLine[0][0] - hydrothermalVentLine[1][0]; i++) {
      if (touchedPoints[[hydrothermalVentLine[0][0] - i, hydrothermalVentLine[0][1] + i].toString()] === undefined) {
        touchedPoints[[hydrothermalVentLine[0][0] - i, hydrothermalVentLine[0][1] + i].toString()] = 1;
      } else {
        touchedPoints[[hydrothermalVentLine[0][0] - i, hydrothermalVentLine[0][1] + i].toString()]++;
      }
    }
  }

  if (hydrothermalVentLine[0][0] > hydrothermalVentLine[1][0] && hydrothermalVentLine[0][1] > hydrothermalVentLine[1][1]) {
    for (let i = 0; i <= hydrothermalVentLine[0][0] - hydrothermalVentLine[1][0]; i++) {
      if (touchedPoints[[hydrothermalVentLine[0][0] - i, hydrothermalVentLine[0][1] - i].toString()] === undefined) {
        touchedPoints[[hydrothermalVentLine[0][0] - i, hydrothermalVentLine[0][1] - i].toString()] = 1;
      } else {
        touchedPoints[[hydrothermalVentLine[0][0] - i, hydrothermalVentLine[0][1] - i].toString()]++;
      }
    }
  }

  if (hydrothermalVentLine[0][0] < hydrothermalVentLine[1][0] && hydrothermalVentLine[0][1] < hydrothermalVentLine[1][1]) {
    for (let i = 0; i <= hydrothermalVentLine[1][0] - hydrothermalVentLine[0][0]; i++) {
      if (touchedPoints[[hydrothermalVentLine[0][0] + i, hydrothermalVentLine[0][1] + i].toString()] === undefined) {
        touchedPoints[[hydrothermalVentLine[0][0] + i, hydrothermalVentLine[0][1] + i].toString()] = 1;
      } else {
        touchedPoints[[hydrothermalVentLine[0][0] + i, hydrothermalVentLine[0][1] + i].toString()]++;
      }
    }
  }
};

// Logic to update the touchedPoints object with the number of times that each point gets touched by hydrothermal vent lines.
const trackTouchedPoints = () => {
  for (const line in hydrothermalVentLines) {
    if (hydrothermalVentLines[line][0][0] === hydrothermalVentLines[line][1][0]) {
      markPointsVertically(hydrothermalVentLines[line]);
    } else if (hydrothermalVentLines[line][0][1] === hydrothermalVentLines[line][1][1]) {
      markPointsHorizontally(hydrothermalVentLines[line]);
    } else {
      markPointsDiagonally(hydrothermalVentLines[line]);
    }
  }
};

// Get the number of points that have at least two hydrothermal vet lines overlapping it.
const getNumberOfDangerousPoints = () => {
  trackTouchedPoints();

  let numberOfDangerousPoints = 0;

  for (const point in touchedPoints) {
    if (touchedPoints[point] >= 2) {
      numberOfDangerousPoints++;
    }
  }

  return numberOfDangerousPoints;
};