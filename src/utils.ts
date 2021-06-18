export function arraysEqual(a: any[], b: any[]): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function getAllFuncs(toCheck: any) {
  let props: any[] = [];
  let obj = toCheck;
  do {
    props = props.concat(Object.getOwnPropertyNames(obj));
  } while ((obj = Object.getPrototypeOf(obj)));

  return props.sort().filter(function (e, i, arr) {
    if (e !== arr[i + 1] && typeof toCheck[e] == "function") return true;
  });
}

export function groupBy(arr: any[], property: any) {
  return arr.reduce((acc, cur) => {
    acc[cur[property]] = [...(acc[cur[property]] || []), cur];
    return acc;
  }, {});
}

export function object_values_to_array_lengths(obj: any): any {
  let keys = Object.keys(obj);
  keys.forEach((key) => {
    obj[key] = obj[key].length;
  });
  return obj;
}

export function getRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
}
