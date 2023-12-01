import { getLines } from '../utils.js';

const URL = './inputs/2.txt';

function processData(lines) {
  const rounds = [];

  for (const line of lines) {
    rounds.push(line.split(' '));
  }

  return rounds;
}

function getShape(letter) {
  if (letter === 'A' || letter === 'X') return 0;
  if (letter === 'B' || letter === 'Y') return 1;
  if (letter === 'C' || letter === 'Z') return 2;

  throw new Error('unknown letter shape');
}

function getShapeScore(shape) {
  return shape + 1;
}

function getOutcomeScore(oppShape, playerShape) {
  const diff = playerShape - oppShape;
  if (diff === 1 || diff === -2) return 6;
  if (diff === 0) return 3;
  return 0;
}

function getRoundScore(round) {
  return getShapeScore(round[1]) + getOutcomeScore(...round);
}

function getRoundScorePartTwo(round) {
  const oppShape = getShape(round[0]);
  let playerShape;
  let score = 0;

  if (round[1] === 'X') {
    playerShape = (oppShape + 2) % 3;
  } else if (round[1] === 'Y') {
    score += 3;
    playerShape = oppShape;
  } else {
    score += 6;
    playerShape = (oppShape + 1) % 3;
  }

  score += getShapeScore(playerShape);
  return score;
}

export default async function dayTwo() {
  const lines = await getLines(URL);
  const rounds = processData(lines);
  // PART ONE

  let score = 0;

  for (const round of rounds) {
    score += getRoundScore([getShape(round[0]), getShape(round[1])]);
  }

  console.log(score);

  // PART TWO

  score = 0;

  for (const round of rounds) {
    score += getRoundScorePartTwo(round);
  }
  console.log(score);
}
