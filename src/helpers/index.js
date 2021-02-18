import { shapes } from '../constants';

export function cloneMatrix(a) {
  return a.map(o => [...o]);
}

export function getRandomColor() {
  const colors = ['r', 'g', 'b', 'p', 'c', 'y'];
  const randNum = Math.floor(Math.random() * colors.length);
  const randColor = colors[randNum];

  return randColor;
}

export function createRandomShape(colorLetter) {
  const randNum = Math.floor(Math.random() * shapes.length);
  const newShape = shapes[randNum].map((row) => row.map((tile) => tile === '1' ? colorLetter : tile));
  return newShape;
}