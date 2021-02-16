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
    function updateField (newPos) {
      if (!newPos) return;
      if (newPos.x === shapePosition.x && newPos.y === shapePosition.y) return;
      let field = cloneMatrix(fieldWithShape);
  
      function clearShape() {
        field = cloneMatrix(fieldState);
      }
  
      function drawShape() {
        for (let i = 0; i < fallingShape.length; i++) {
          for (let u = 0; u < fallingShape[0].length; u++) {
            field[newPos.y + i][newPos.x + u] = fallingShape[i][u];
          }
        }
      }
      
      clearShape();
      drawShape();
      setFieldWithShape(field);

    };

    function detectCollision(newPos) {
      if (!newPos) return false;
      const {x, y} = newPos;
      if (x < 1 || x + fallingShape[0].length > RIGHT_WALL_X || y >=  BOTTOM_WALL_Y) {
        return true;
      }
      function mapShapeToLayedTiles() {
        for (let i = y; i < y + fallingShape.length; i ++) {
          for (let u = x; u < x + fallingShape[0].length; u++) {
            if (fallingShape[i - y][u - x] !== '0') {
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
    
    function handleKey (event) {
      const time = new Date().getTime();
      if (time - keyPressTime < 500) return;
      keyPressTime.current = time;
      if (event.key === 'ArrowRight'){
        setDirection('right');
      } else if (event.key === 'ArrowLeft'){
        setDirection('left');
      } else if (event.key === 'ArrowDown'){
        setDirection('down');
      }
    }
  
    document.addEventListener('keyup', handleKey);

    if (direction) {
      const newPos = moveShape(direction);
      setDirection(null);

      if (!detectCollision(newPos) && (shapePosition.x !== newPos.x || shapePosition.y !== newPos.y)){
        updateField(newPos);
      }
    }

    return () => {
      document.removeEventListener('keyup', handleKey);
    };
  }, [shapePosition, direction, fallingShape, fieldState, fieldWithShape]);

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
