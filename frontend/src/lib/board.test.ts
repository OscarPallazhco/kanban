import { describe, expect, it } from "vitest";
import { initialColumns, moveCard } from "./board";

describe("moveCard", () => {
  it("moves a card into the target column and removes it from its source", () => {
    const result = moveCard(initialColumns, "card-1", "done");
    expect(result.find((column) => column.id === "ideas")?.cards).toHaveLength(1);
    expect(result.find((column) => column.id === "done")?.cards.at(-1)?.id).toBe("card-1");
  });

  it("leaves the board unchanged when the card does not exist", () => {
    expect(moveCard(initialColumns, "missing", "done")).toBe(initialColumns);
  });
});