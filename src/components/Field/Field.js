import BlockFactory from '../BlockFactory/BlockFactory';
import './Field.css';

function Field ({state}) {
  function renderRow(row, rowIndex) {
    return row.map((block, index) => <BlockFactory blockType={block} key={`block-${index}-${rowIndex}`} />);
  }
  function renderField() {
    return state.map((row, index) => {
      return <div className="row" key={`row-${index}`}>{renderRow(row, index)}</div>
    });
  }
  return (
    <div className="field">{renderField()}</div> 
  );
}

export default Field;