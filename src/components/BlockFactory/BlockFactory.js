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
      return <Tile color='#5ebde6' />
    case 'g':
      return <Tile color='#ed9548' />
    case 'b':
      return <Tile color='#dd6557' />
    case 'p':
      return <Tile color='#4dd4b0' />
    case 'c':
      return <Tile color='#96dc55' />
    case 'y':
      return <Tile color='#909090' />
    default:
      break;
  }
}

export default BlockFactory;