import { useSelectedLine } from "../contexts/SelectedLine";
import GridAlignScale from "./AlignScale";
import NoteContainer from "./NoteContainer/NoteContainer";

type GridProps = {
  scale: number,
  alignCount: number,
};

const Grid = ({
  scale,
  alignCount
}: GridProps) => {
  const [ selectedLine, ] = useSelectedLine()!;

  return (
    <div className="note-grid-container">
      <GridAlignScale grid={alignCount} />
      <NoteContainer line={selectedLine} scale={scale} />
      {!selectedLine && <div className="note-grid-placeholder">Select a line to continue</div>}
    </div>
  );
};

export default Grid;
