import ChartNote from "@/Chart/Note";
import { EditPanelItem } from "./List";
import { EasingNames } from "@/utils/easings";
import { NoteType } from "@/Chart/types";
import ChartKeyframe from "@/Chart/Keyframe";

export const KeyframePanelBuilderSingle = (keyframe: ChartKeyframe): EditPanelItem[] => {
  const valueItem: EditPanelItem = {
    label: 'Value',
    type: 'number',
    key: 'value',
    props: {
      defaultValue: keyframe.value,
    }
  };

  const result: EditPanelItem[] = [
    {
      label: 'Time',
      type: 'beat',
      key: 'beat',
      props: {
        defaultValue: keyframe.beat,
      },
    },
    valueItem,
    {
      label: 'Continuous',
      type: 'boolean',
      key: 'continuous',
      props: {
        defaultValue: keyframe.continuous,
      }
    }
  ];

  if (keyframe.type === 'alpha') {
    valueItem.props.min = 0;
    valueItem.props.max = 255;
    valueItem.props.step = 1;
  }

  if (keyframe.type !== 'speed') result.push({
    label: 'Easing',
    type: 'dropdown',
    key: 'easing',
    props: {
      type: 'number',
      defaultValue: keyframe.easing,
      options: (EasingNames.map((name, index) => {
        return {
          label: name,
          value: index,
        }
      }))
    },
  });

  return result;
};

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
      defaultValue: note.positionX,
      step: 0.1,
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
