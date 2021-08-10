import * as _ from "lodash";

function sortArray(data: Array<{}>, field: string, dir: "asc" | "desc"): void {
  data.sort((a: {}, b: {}) => {
    const rawA = _.get(a, field);
    const rawB = _.get(b, field);
    const isAsc = dir === "asc";

    const isNumberField = Number.isFinite(rawA) && Number.isFinite(rawB);
    if (isNumberField) {
      return basicSort(rawA, rawB, isAsc);
    }
    const isStringField = typeof rawA === "string" && typeof rawB === "string";
    if (isStringField) {
      const aParsed = rawA.toLowerCase();
      const bParsed = rawB.toLowerCase();
      return basicSort(aParsed, bParsed, isAsc);
    }
    const isDateField = rawA instanceof Date && rawB instanceof Date;
    if (isDateField) {
      return basicSort(rawA, rawB, isAsc);
    }
    return basicSort(!!rawA, !!rawB, isAsc);
  });
}

function basicSort(aValue: any, bValue: any, isAsc: boolean) {
  if (aValue > bValue) {
    return isAsc ? 1 : -1;
  }
  if (aValue < bValue) {
    return isAsc ? -1 : 1;
  }
  return 0;
}

export { sortArray };
