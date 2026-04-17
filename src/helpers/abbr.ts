export const abbr = (str: string, n: number = 5) => {
  if (str.length <= n * 2) {
    return str;
  }
  return str.substring(0, n) + "..." + str.substring(str.length - n);
};
