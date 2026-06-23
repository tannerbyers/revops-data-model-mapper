import { describe, it, expect } from "vitest";
import { exportCsv, exportJson, exportMarkdown, exportMermaid } from "../export/exporters";
import { canonicalObjects } from "../data/canonicalObjects";
import { getTool } from "../data/tools";
import type { ExportData } from "../export/exporters";

const sourceTool = getTool("salesforce");
const targetTool = getTool("hubspot");

if (!sourceTool || !targetTool) {
  throw new Error("Test tools not found");
}

const testData: ExportData = {
  sourceTool,
  targetTool,
  timestamp: "2025-01-01T00:00:00.000Z",
  canonicalObjects,
  mappings: canonicalObjects.map((obj) => ({
    canonicalObject: obj,
    sourceMapping: sourceTool.objects.find((o) => o.canonicalObjectId === obj.id) ?? null,
    targetMapping: targetTool.objects.find((o) => o.canonicalObjectId === obj.id) ?? null,
  })),
};

describe("exportCsv", () => {
  it("contains expected headers", () => {
    const result = exportCsv(testData);
    expect(result).toContain("canonical_object");
    expect(result).toContain("source_tool");
    expect(result).toContain("source_field");
    expect(result).toContain("target_field");
    expect(result).toContain("confidence");
  });

  it("contains source and target tool names", () => {
    const result = exportCsv(testData);
    expect(result).toContain("Salesforce");
    expect(result).toContain("HubSpot");
  });

  it("produces multiple rows", () => {
    const result = exportCsv(testData);
    const lines = result.trim().split("\n");
    expect(lines.length).toBeGreaterThan(1); // header + at least one data row
  });
});

describe("exportJson", () => {
  it("parses correctly as valid JSON", () => {
    const result = exportJson(testData);
    expect(() => JSON.parse(result)).not.toThrow();
    const parsed = JSON.parse(result);
    expect(parsed.reportType).toBe("RevOps Data Model Mapping Report");
  });

  it("contains selected tool names", () => {
    const result = exportJson(testData);
    expect(result).toContain("Salesforce");
    expect(result).toContain("HubSpot");
  });

  it("contains generated timestamp", () => {
    const result = exportJson(testData);
    expect(result).toContain("generatedAt");
    expect(result).toContain("2025-01-01");
  });
});

describe("exportMarkdown", () => {
  it("contains selected tool names", () => {
    const result = exportMarkdown(testData);
    expect(result).toContain("Salesforce");
    expect(result).toContain("HubSpot");
  });

  it("contains report header", () => {
    const result = exportMarkdown(testData);
    expect(result).toContain("# RevOps Data Model Mapping Report");
  });

  it("contains Executive Summary section", () => {
    const result = exportMarkdown(testData);
    expect(result).toContain("Executive Summary");
  });

  it("contains Migration Questions section", () => {
    const result = exportMarkdown(testData);
    expect(result).toContain("Migration Questions");
  });
});

describe("exportMermaid", () => {
  it("contains erDiagram", () => {
    const result = exportMermaid(testData);
    expect(result).toContain("erDiagram");
  });

  it("contains object names as entities", () => {
    const result = exportMermaid(testData);
    expect(result).toContain("ACCOUNT");
    expect(result).toContain("CONTACT");
  });

  it("contains relationship syntax", () => {
    const result = exportMermaid(testData);
    expect(result).toMatch(/\|\|--o\{/);
    expect(result).toMatch(/: ".*"/); // relationship labels
  });
});
