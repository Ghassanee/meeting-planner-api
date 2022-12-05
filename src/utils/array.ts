// find matching values in two arrays
export const findMatchingValues = (arr1: any, arr2: any) => {
  const result = arr1.filter((item: any) => arr2.includes(item));
  return result;
};
