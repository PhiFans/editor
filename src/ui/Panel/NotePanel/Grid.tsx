import { useSelectedItem } from "../../contexts/SelectedItem";
import GridAlignScale from "./AlignScale";
import NoteContainer from "./NoteContainer/NoteContainer";

const Grid = () => {
  const [ selectedItem, ] = useSelectedItem()!;

  return (
    <div className="note-grid-container">
      <GridAlignScale />
      <NoteContainer line={selectedItem ? selectedItem.line : null} />
      {!selectedItem && <div className="note-grid-placeholder">Select a line to continue</div>}
    </div>
  );
};

export default Grid;
