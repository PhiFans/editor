import { useCallback } from "react";
import Chart from '@/Chart/Chart';
import ChartBPM from "@/Chart/BPM";
import BPMListItem from "./Item";
import { BeatArray } from "@/utils/types";

type BPMListProps = {
  bpms: ChartBPM[],
};

const BPMList = ({
  bpms
}: BPMListProps) => {
  const handleBPMChanged = useCallback((id: string, beat?: BeatArray, bpm?: number) => {
    if (!Chart.info) return;
    Chart.editBPM(id, beat, bpm);
  }, []);

  return (
    <div className="bpm-list">
      {bpms.map((bpm) => (
        <BPMListItem
          bpm={bpm}
          onChanged={(newBeat, newBPM) => handleBPMChanged(bpm.id, newBeat, newBPM)}
          key={bpm.id}
        />
      ))}
    </div>
  );
};

export default BPMList;
