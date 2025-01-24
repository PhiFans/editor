import ChartNote from "@/Chart/Note";
import { EditPanelItem } from "./List";
import { NoteType } from "@/Chart/types";
import ChartKeyframe from "@/Chart/Keyframe";

export const KeyframePanelBuilderSingle = (keyframe: ChartKeyframe): EditPanelItem[] => ([
  {
    label: 'Time',
    type: 'beat',
    key: 'beat',
    props: {
      defaultValue: keyframe.beat,
    },
  },
  {
    label: 'Value',
    type: 'number',
    key: 'value',
    props: {
      defaultValue: keyframe.value,
    }
  },
  {
    label: 'Continuous',
    type: 'boolean',
    key: 'continuous',
    props: {
      defaultValue: keyframe.continuous,
    }
  },
  {
    label: 'Easing',
    type: 'dropdown',
    key: 'easing',
    props: {
      defaultValue: `${keyframe.easing}`,
      options: [
        {
          label: 'Linear',
          value: '1',
        },
        {
          label: 'EaseIn',
          value: '2',
        },
        {
          label: 'EaseOut',
          value: '3',
        },
        {
          label: 'EaseInOut',
          value: '4',
        },
      ]
    },
  }
]);

export const NotePanelBuilderSingle = (note: ChartNote): EditPanelItem[] => ([
  {
    label: 'Type',
    type: 'dropdown',
    key: 'type',
    props: {
      type: 'number',
      options: [
        {
          label: 'Tap',
          value: NoteType.TAP,
        },
        {
          label: 'Drag',
          value: NoteType.DRAG,
        },
        {
          label: 'Hold',
          value: NoteType.HOLD,
        },
        {
          label: 'Flick',
          value: NoteType.FLICK,
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
