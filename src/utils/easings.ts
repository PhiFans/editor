
type EasingFn = (x: number) => number;

/**
 * All these easings comes from https://easings.net/
 * @see https://easings.net/
 */
const Easings: EasingFn[] = [
  /** 0: Linear */
  (x) => x,
  /** 1: In Sine */
  (x) => 1 - Math.cos((x * Math.PI) / 2),
  /** 2: Out Sine */
  (x) => Math.sin((x * Math.PI) / 2),
  /** 3: In Out Sine */
  (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  /** 4: In Quad */
  (x) => x * x,
  /** 5: Out Quad */
  (x) => 1 - (1 - x) * (1 - x),
  /** 6: In Out Quad */
  (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
  /** 7: In Cubic */
  (x) => x * x * x,
  /** 8: Out Cubic */
  (x) => 1 - Math.pow(1 - x, 3),
  /** 9: In Out Cubic */
  (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  /** 10: In Quart */
  (x) => x * x * x * x,
  /** 11: Out Quart */
  (x) => 1 - Math.pow(1 - x, 4),
  /** 12: In Out Quart */
  (x) => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
  /** 13: In Quint */
  (x) => x * x * x * x * x,
  /** 14: Out Quint */
  (x) => 1 - Math.pow(1 - x, 5),
  /** 15: In Out Quint */
  (x) => x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2,
  /** 16: In Expo */
  (x) => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
  /** 17: Out Expo */
  (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
  /** 18: In Out Expo */
  (x) => (x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2),
  /** 19: In Circ */
  (x) => 1 - Math.sqrt(1 - Math.pow(x, 2)),
  /** 20: Out Circ */
  (x) => Math.sqrt(1 - Math.pow(x - 1, 2)),
  /** 21: In Out Circ */
  (x) => (x < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2),
  /** 22: In Back */
  (x) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return c3 * x * x * x - c1 * x * x
  },
  /** 23: Out Back */
  (x) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
  /** 24: In Out Back */
  (x) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  },
  /** 25: In Elastic */
  (x) => {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
      ? 0
      : x === 1
      ? 1
      : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
  },
  /** 26: Out Elastic */
  (x) => {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  },
  /** 27: In Out Elastic */
  (x) => {
    const c5 = (2 * Math.PI) / 4.5;

    return x === 0
      ? 0
      : x === 1
      ? 1
      : x < 0.5
      ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
      : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
  },
  /** 28: In Bounce */
  (x) => 1 - Easings[29](1 - x),
  /** 29: Out Bounce */
  (x) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  },
  /** 30: In Out Bounce */
  (x) => (x < 0.5
    ? (1 - Easings[29](1 - 2 * x)) / 2
    : (1 + Easings[29](2 * x - 1)) / 2)
];

const EasingNames: string[] = [
  'Linear',
  'In Sine',
  'Out Sine',
  'In Out Sine',
  'In Quad',
  'Out Quad',
  'In Out Quad',
  'In Cubic',
  'Out Cubic',
  'In Out Cubic',
  'In Quart',
  'Out Quart',
  'In Out Quart',
  'In Quint',
  'Out Quint',
  'In Out Quint',
  'In Expo',
  'Out Expo',
  'In Out Expo',
  'In Circ',
  'Out Circ',
  'In Out Circ',
  'In Back',
  'Out Back',
  'In Out Back',
  'In Elastic',
  'Out Elastic',
  'In Out Elastic',
  'In Bounce',
  'Out Bounce',
  'In Out Bounce',
];

export default Easings;
export { EasingNames };
export type { Easings };
