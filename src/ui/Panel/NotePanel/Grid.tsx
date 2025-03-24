import { useTranslation } from "react-i18next";
import { useSelectedItem } from "../../contexts/SelectedItem";
import GridAlignScale from "./AlignScale";
import NoteContainer from "./NoteContainer/NoteContainer";

const Grid = () => {
  const { t } = useTranslation();
  const [ selectedItem, ] = useSelectedItem()!;

  return (
    <div className="note-grid-container">
      <GridAlignScale />
      <NoteContainer line={selectedItem ? selectedItem.line : null} />
      {!selectedItem && (
        <div className="note-grid-placeholder">
          {t('note_panel.no_line_selected')}
        </div>
      )}
    </div>
  );
};

export default Grid;
