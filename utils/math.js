export const average = (arr) =>
  Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100;
