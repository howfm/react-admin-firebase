import { hasUncaughtExceptionCaptureCallback } from "process";
import { sortArray } from "./utils";

describe("test", () => {
  it("sorts alphabetically correct", () => {
    const array = [
      { sortByMe: "a" },
      { sortByMe: "ab" },
      { sortByMe: "A" },
      { sortByMe: "AB" },
    ];
    sortArray(array, "sortByMe", "asc");
    expect(array).toEqual([
      { sortByMe: "a" },
      { sortByMe: "A" },
      { sortByMe: "ab" },
      { sortByMe: "AB" },
    ]);
    sortArray(array, "sortByMe", "desc");
    expect(array).toEqual([
      { sortByMe: "ab" },
      { sortByMe: "AB" },
      { sortByMe: "a" },
      { sortByMe: "A" },
    ]);
  });

  it("sorts numbers", () => {
    const array = [
      { sortByMe: 1 },
      { sortByMe: 10 },
      { sortByMe: 2 },
      { sortByMe: 20 },
    ];
    sortArray(array, "sortByMe", "asc");
    expect(array).toEqual([
      { sortByMe: 1 },
      { sortByMe: 2 },
      { sortByMe: 10 },
      { sortByMe: 20 },
    ]);
    sortArray(array, "sortByMe", "desc");
    expect(array).toEqual([
      { sortByMe: 20 },
      { sortByMe: 10 },
      { sortByMe: 2 },
      { sortByMe: 1 },
    ]);
  });
});
