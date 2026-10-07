import { describe, expect, it } from "vitest";

import { segmentedFits } from "./choices";

describe("segmentedFits", () => {
  it("keeps two short setting words side by side", () => {
    expect(segmentedFits(["横", "縦"])).toBe(true);
    expect(segmentedFits(["連結", "標準"])).toBe(true);
  });

  it("keeps three short width words side by side", () => {
    expect(segmentedFits(["グループ", "狭い", "広い"])).toBe(true);
  });

  it("sends a row of style names to a select", () => {
    expect(segmentedFits(["塗りつぶし", "浮き上がり", "枠線"])).toBe(false);
    expect(
      segmentedFits(["グループ", "塗りつぶし", "トーナル", "浮き上がり", "枠線", "テキスト"]),
    ).toBe(false);
  });

  it("sends one long label among short ones to a select", () => {
    expect(segmentedFits(["チェックボックス", "スイッチ", "なし"])).toBe(false);
  });
});
