import { useSelectedItem } from "../contexts/SelectedItem";
import { useAlign } from "./AlignContext";
import GridAlignScale from "./AlignScale";
import NoteContainer from "./NoteContainer/NoteContainer";

type GridProps = {
  scale: number,
};

const Grid = ({
  scale,
}: GridProps) => {
  const align = useAlign();
  const [ selectedItem, ] = useSelectedItem()!;

  return (
    <div className="note-grid-container">
      <GridAlignScale grid={align} />
      <NoteContainer line={selectedItem ? selectedItem.line : null} scale={scale} />
      {!selectedItem && <div className="note-grid-placeholder">Select a line to continue</div>}
    </div>
  );
};

export default Grid;
