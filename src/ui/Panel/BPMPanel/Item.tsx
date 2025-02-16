import App from '@/App/App';
import ChartBPM from "@/Chart/BPM";
import BeatInput from './BeatInput';
import NumberInput from '@/ui/components/NumberInput';
import { useCallback } from "react";
import { BeatArray } from "@/utils/types";
import { Button } from "@blueprintjs/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type BPMListItemProps = {
  bpm: ChartBPM,
  onChanged: (beat?: BeatArray, bpm?: number) => void,
};

const BPMListItem = ({
  bpm,
  onChanged,
}: BPMListItemProps) => {

  const handleUpdate = useCallback((beat?: BeatArray, bpm?: number) => {
    onChanged(beat, bpm);
  }, [onChanged]);

  const handleDelete = () => {
    App.chart!.removeBPM(bpm.id);
  };

  return (
    <div className="bpm-list-item">
      <div className="bpm-props">
        <div className="bpm-prop">
          <div className="bpm-prop-name">Time</div>
          <div className="bpm-prop-input">
            <BeatInput
              beat={bpm.beat}
              onInput={(e) => handleUpdate(e)}
            />
          </div>
        </div>
        <div className="bpm-prop">
          <div className="bpm-prop-name">BPM</div>
          <div className="bpm-prop-input">
            <NumberInput
              defaultValue={bpm.bpm}
              min={1}
              step={0.001}
              onInput={(e) => handleUpdate((void 0), e)}
            />
          </div>
        </div>
      </div>
      <div className="bpm-actions">
        <Button onClick={handleDelete}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </div>
    </div>
  )
};

export default BPMListItem;
