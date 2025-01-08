
export const FillZero = (number: number, length = 2) => {
  let result = `${number}`;
  while (result.length < length) {
    result = `0${result}`;
  }
  return result;
};
