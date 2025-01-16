const ValidTempo = [
  1,
  2, 4, 8, 16,
  3, 6, 12
];

const switchScaleColor = (beat: number) => {
  switch (beat) {
    case 1:
      return '';
    case 2:
      return 'red';
    case 4:
      return 'blue';
    case 8:
      return 'yellow';
    case 16:
      return 'purple-dark';
    case 3:
      return 'purple';
    case 6:
      return 'yellow-dark';
    case 12:
      return 'brown';
    default:
      return 'red';
  }
};

export const getScaleColor = (tempo: number, index: number) => {
  const beat = index % tempo;
  for (const validTempo of ValidTempo) {
    if ((beat * validTempo) % tempo === 0) return switchScaleColor(validTempo);
  }
  return 'red';
};
