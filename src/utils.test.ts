import { sortArray } from "./utils";

describe("test", () => {
  it("sorts alphabetically correct", () => {
    const array = [{ id: "a" }, { id: "ab" }, { id: "A" }, { id: "AB" }];
    sortArray(array, "id", "asc");
    expect(array).toEqual([
      { id: "a" },
      { id: "A" },
      { id: "ab" },
      { id: "AB" },
    ]);
    sortArray(array, "id", "desc");
    expect(array).toEqual([
      { id: "ab" },
      { id: "AB" },
      { id: "a" },
      { id: "A" },
    ]);
  });

  it("sorts numbers", () => {
    const array = [{ id: 1 }, { id: 10 }, { id: 2 }, { id: 20 }];
    sortArray(array, "id", "asc");
    expect(array).toEqual([{ id: 1 }, { id: 2 }, { id: 10 }, { id: 20 }]);
    sortArray(array, "id", "desc");
    expect(array).toEqual([{ id: 20 }, { id: 10 }, { id: 2 }, { id: 1 }]);
  });
});
