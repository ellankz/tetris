import './Tile.scss';

function Tile({ color }) {
  return (
    <div className="block-tile" style={{'backgroundColor': color}}></div>
  );
}

export default Tile;