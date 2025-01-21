import ChartNote from "@/Chart/Note";
import { EditPanelItem } from "./List";
import { NoteType } from "@/Chart/types";

export const NotePanelBuilder = (note: ChartNote): EditPanelItem[] => ([
  {
    label: 'Type',
    type: 'dropdown',
    key: 'type',
    props: {
      options: [
        {
          label: 'Tap',
          value: `${NoteType.TAP}`,
        },
        {
          label: 'Drag',
          value: `${NoteType.DRAG}`,
        },
        {
          label: 'Hold',
          value: `${NoteType.HOLD}`,
        },
        {
          label: 'Flick',
          value: `${NoteType.FLICK}`,
        },
      ],
      defaultValue: note.type,
    },
  },
  {
    label: 'Time',
    type: 'beat',
    key: 'beat',
    props: {
      defaultValue: note.beat,
    },
  },
  {
    label: 'Speed',
    type: 'number',
    key: 'speed',
    props: {
      defaultValue: note.speed,
    },
  },
  {
    label: 'Above line',
    type: 'boolean',
    key: 'isAbove',
    props: {
      defaultValue: note.isAbove,
    },
  },
  {
    label: 'Position X',
    type: 'number',
    key: 'positionX',
    props: {
      defaultValue: note.positionX * 100,
    },
  },
  {
    label: 'Hold end time',
    type: 'beat',
    key: 'holdEndBeat',
    props: {
      defaultValue: note.holdEndBeat,
    },
  }
]);
