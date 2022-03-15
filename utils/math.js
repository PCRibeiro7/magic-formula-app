export const average = (arr) =>
  Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) / 100;

export const median = (arr) => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};
