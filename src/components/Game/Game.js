import { useState, useEffect, useRef } from 'react';
import Field from '../Field/Field';
import { cloneMatrix } from '../../helpers';

const FIELD_CENTER_X = 4;
const RIGHT_WALL_X = 11;
const BOTTOM_WALL_Y = 20;



function Game() {
  const initialFieldState = [
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','0','0','0','0','0','0','0','0','0','0','#'],
    ['#','#','#','#','#','#','#','#','#','#','#','#'],
  ];

  const [fieldState, setFieldState] = useState(cloneMatrix(initialFieldState));

  const [fieldWithShape, setFieldWithShape] = useState(cloneMatrix(initialFieldState));

  const [fallingShape, setFallingShape] = useState(() => createRandomShape(getRandomColor()));

  const [shapePosition, setShapePosition] = useState({x: FIELD_CENTER_X, y: 0});

  const [direction, setDirection] = useState(null);

  function getRandomColor() {
    const colors = ['r', 'g', 'b', 'p', 'c', 'y'];
    const randNum = Math.floor(Math.random() * colors.length);
    const randColor = colors[randNum];

    return randColor;
  }

  function createRandomShape(colorLetter) {
    const shapes = [
      [
        ['1', '1'],
        ['1', '1'],
      ],
      [
        ['0', '1', '0'],
        ['1', '1', '1'],
      ],
      [
        ['1', '1', '1', '1', '1'],
      ],
      [
        ['1', '0'],
        ['1', '0'],
        ['1', '1'],
      ],
      [
        ['0', '1'],
        ['0', '1'],
        ['1', '1'],
      ],
      [
        ['1', '0'],
        ['1', '1'],
        ['0', '1'],
      ],
      [
        ['0', '1'],
        ['1', '1'],
        ['1', '0']
      ]
    ];
    const randNum = Math.floor(Math.random() * shapes.length);
    const newShape = shapes[randNum].map((row) => row.map((tile) => tile === '1' ? colorLetter : tile));
    return newShape;
  }

  let keyPressTime = useRef();
  keyPressTime.current = new Date().getTime();

  useEffect(() => {
    function updateField (newPos, rotated) {
      if ((!newPos && !rotated)
      || (!rotated && newPos.x === shapePosition.x && newPos.y === shapePosition.y)) return;
      let field = cloneMatrix(fieldWithShape);
  
      function clearShape() {
        field = cloneMatrix(fieldState);
      }
  
      function drawShape() {
        const shape = rotated || fallingShape;
        const pos = newPos || shapePosition;
        for (let i = 0; i < shape.length; i++) {
          for (let u = 0; u < shape[0].length; u++) {
            if (shape[i][u] !== '0') {
              field[pos.y + i][pos.x + u] = shape[i][u];
            }
          }
        }
      }

      clearShape();
      drawShape();
      setFieldWithShape(field);
    };

    function detectCollision(newPos, rotated) {
      if (!newPos && !rotated) return false;
      const {x, y} = newPos || shapePosition;
      const shape = rotated || fallingShape;
      if (x < 1 || x + shape[0].length > RIGHT_WALL_X || y >=  BOTTOM_WALL_Y) {
        return true;
      }
      function mapShapeToLayedTiles() {
        for (let i = y; i < y + shape.length; i++) {
          for (let u = x; u < x + shape[0].length; u++) {
            if (shape[i - y][u - x] !== '0') {
              if (fieldState[i][u] !== '0') {
                return true;
              }
            }
          }
        }
        return false;
      }
  
      return mapShapeToLayedTiles();
    };
    
    function moveShape(direction) {
      let newPos;
      const savedPos = { ...shapePosition };
      switch (direction) {
        case 'left':
          newPos = { ...savedPos, x: savedPos.x - 1};
          break;
        case 'right':
          newPos = { ...savedPos, x: savedPos.x + 1};
          break;
        case 'down':
          newPos = { x: savedPos.x, y: savedPos.y + 1};
          break;
        default:
          break;
        }
        if (newPos) setShapePosition(newPos);

      const collided = detectCollision(newPos);

      if (collided) {
        setShapePosition(savedPos);
      }

      return newPos;
    }

    function rotateShape() {
      const shape = [];

      for (let i = 0; i < fallingShape[0].length; i++) {
        const row = [];
        shape.push(row);
        for (let u = (fallingShape.length - 1); u >= 0; u--) {
          row.push(fallingShape[u][i]);
        }
      }

      const collided = detectCollision(undefined, shape);

      if (!collided) {
        setFallingShape(shape);
        updateField(undefined, shape);
      }

    }

    function dropNewShape() {
      setFieldState(cloneMatrix(fieldWithShape));
      setFallingShape(createRandomShape(getRandomColor()));
      setShapePosition({x: FIELD_CENTER_X, y: 0});
    }

    function speedDropShape() {
      setDirection('down');
    }

    function handleKeyUp(event) {
      const time = new Date().getTime();
      if (time - keyPressTime < 500) return;
      keyPressTime.current = time;
      if (event.key === 'ArrowRight') {
        setDirection('right');
      } else if (event.key === 'ArrowLeft') {
        setDirection('left');
      } else if (event.key === 'ArrowDown') {
        setDirection('down');
      } else if (event.key === 'ArrowUp')
        rotateShape();
    }

    function handleKeyDown(event) {
      if (event.keyCode === 32) {
        speedDropShape();
      }
    }

    function checkForFilledLine() {
      const filledLines = [];
      for (let i = 0; i < fieldWithShape.length - 1; i++) {
        if (fieldWithShape[i].every((tile) => tile !== '0')) {
          filledLines.push(i);
        }
      }
      return filledLines;
    }

    function clearLine(lineIndexes) {
      if (!lineIndexes.length) return;
      const field = [];
      lineIndexes.forEach(() => field.push([...initialFieldState[0]]));
      for (let i = 0; i < fieldWithShape.length; i++) {
        if (lineIndexes.every(index => index !== i)) {
          field.push(fieldWithShape[i]);
        }
      }
      setFieldState(field);
    }
    
    if (direction) {
      const newPos = moveShape(direction);
      const isCollided = detectCollision(newPos);
      setDirection(null);

      if ((isCollided && direction === 'down') || shapePosition.y >= BOTTOM_WALL_Y - fallingShape.length) {
        dropNewShape();
        const filledRows = checkForFilledLine();
        if (filledRows.length) clearLine(filledRows);
      }
      
      if (!isCollided && (shapePosition.x !== newPos.x || shapePosition.y !== newPos.y)){
        updateField(newPos);
      }

    }

    document.addEventListener('keyup', handleKeyUp);

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shapePosition, direction, fallingShape, fieldState, fieldWithShape, initialFieldState]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection('down');
    }, 1000);
    return () => clearInterval(interval);
  });
  
  return (
    <div className="Game">
      <Field state={fieldWithShape} />
    </div>
  );
}

export default Game;
