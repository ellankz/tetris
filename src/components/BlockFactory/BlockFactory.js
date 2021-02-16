import Space from '../Space/Space';
import Brick from '../Brick/Brick';
import Tile from '../Tile/Tile';

function BlockFactory({blockType}) {
  switch (blockType) {
    case '0':
      return <Space />
    case '#':
      return <Brick />
    case 'r':
      return <Tile color='red' />
    case 'g':
      return <Tile color='green' />
    case 'b':
      return <Tile color='blue' />
    case 'p':
      return <Tile color='pink' />
    case 'c':
      return <Tile color='cyan' />
    case 'y':
      return <Tile color='yellow' />
    default:
      break;
  }
}

export default BlockFactory;