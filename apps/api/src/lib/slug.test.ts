import { describe, expect, it } from "vitest";
import { slugifyName, withRandomSuffix } from "./slug";

describe("slugifyName", () => {
  it("lowercases and hyphenates company names", () => {
    expect(slugifyName("Acme Ltd")).toBe("acme-ltd");
  });

  it("returns workspace for empty-ish input", () => {
    expect(slugifyName("   ")).toBe("workspace");
  });
});

describe("withRandomSuffix", () => {
  it("appends a suffix to avoid slug collisions", () => {
    const result = withRandomSuffix("acme-ltd");
    expect(result).toMatch(/^acme-ltd-[a-z0-9]+$/);
  });
});
