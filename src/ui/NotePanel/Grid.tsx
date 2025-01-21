import { useSelectedLine } from "../contexts/SelectedLine";
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
  const [ selectedLine, ] = useSelectedLine()!;

  return (
    <div className="note-grid-container">
      <GridAlignScale grid={align} />
      <NoteContainer line={selectedLine} scale={scale} />
      {!selectedLine && <div className="note-grid-placeholder">Select a line to continue</div>}
    </div>
  );
};

export default Grid;
