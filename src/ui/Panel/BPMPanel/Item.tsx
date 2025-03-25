import Chart from '@/Chart/Chart';
import ChartBPM from "@/Chart/BPM";
import BeatInput from '@/ui/components/BeatInput';
import NumberInput from '@/ui/components/NumberInput';
import { useCallback } from "react";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const handleUpdate = useCallback((beat?: BeatArray, bpm?: number) => {
    onChanged(beat, bpm);
  }, [onChanged]);

  const handleDelete = () => {
    Chart.removeBPM(bpm.id);
  };

  return (
    <div className="bpm-list-item">
      <div className="bpm-props">
        <div className="bpm-prop">
          <div className="bpm-prop-name">{t('common.time')}</div>
          <div className="bpm-prop-input">
            <BeatInput
              beat={bpm.beat}
              onInput={(e) => handleUpdate(e)}
              className='bpm-input-beat'
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
              dragStep={1}
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
