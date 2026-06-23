import { describe, it, expect } from "vitest";
import { canonicalObjects, getCanonicalObject } from "../data/canonicalObjects";
import { tools } from "../data/tools";

describe("canonical objects data integrity", () => {
  it("has at least 8 canonical objects", () => {
    expect(canonicalObjects.length).toBeGreaterThanOrEqual(8);
  });

  it("every canonical object has id, name, and description", () => {
    for (const obj of canonicalObjects) {
      expect(obj.id).toBeTruthy();
      expect(obj.name).toBeTruthy();
      expect(obj.description).toBeTruthy();
      expect(typeof obj.id).toBe("string");
      expect(typeof obj.name).toBe("string");
      expect(typeof obj.description).toBe("string");
    }
  });

  it("every canonical field has id, name, and type", () => {
    for (const obj of canonicalObjects) {
      for (const field of obj.commonFields) {
        expect(field.id).toBeTruthy();
        expect(field.name).toBeTruthy();
        expect(field.type).toBeTruthy();
        expect(typeof field.id).toBe("string");
        expect(typeof field.name).toBe("string");
        expect(typeof field.type).toBe("string");
      }
    }
  });

  it("each canonical object has unique IDs", () => {
    const ids = canonicalObjects.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each canonical field has unique IDs within its object", () => {
    for (const obj of canonicalObjects) {
      const fieldIds = obj.commonFields.map((f) => f.id);
      expect(new Set(fieldIds).size).toBe(fieldIds.length);
    }
  });
});

describe("tool mappings data integrity", () => {
  it("has at least 5 tools", () => {
    expect(tools.length).toBeGreaterThanOrEqual(5);
  });

  it("every tool has id, name, description, and category", () => {
    for (const tool of tools) {
      expect(tool.id).toBeTruthy();
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.category).toBeTruthy();
    }
  });

  it("every tool object maps to a valid canonical object", () => {
    for (const tool of tools) {
      for (const objMapping of tool.objects) {
        const canonicalObj = getCanonicalObject(objMapping.canonicalObjectId);
        expect(
          canonicalObj,
          `Tool "${tool.name}" object "${objMapping.toolObjectName}" maps to unknown canonical object "${objMapping.canonicalObjectId}"`
        ).toBeDefined();
      }
    }
  });

  it("every mapped field references a valid canonical field", () => {
    for (const tool of tools) {
      for (const objMapping of tool.objects) {
        const canonicalObj = getCanonicalObject(objMapping.canonicalObjectId);
        if (!canonicalObj) continue;
        const validFieldIds = new Set(canonicalObj.commonFields.map((f) => f.id));
        for (const fieldMapping of objMapping.fields) {
          expect(
            validFieldIds.has(fieldMapping.canonicalFieldId),
            `Tool "${tool.name}" object "${objMapping.toolObjectName}" field "${fieldMapping.toolFieldName}" references unknown canonical field "${fieldMapping.canonicalFieldId}"`
          ).toBe(true);
        }
      }
    }
  });

  it("every confidence value is valid", () => {
    const validConfidences = ["high", "medium", "low"];
    for (const tool of tools) {
      for (const objMapping of tool.objects) {
        expect(validConfidences).toContain(objMapping.confidence);
        for (const field of objMapping.fields) {
          expect(
            validConfidences,
            `Invalid confidence in ${tool.id}/${objMapping.id}/${field.toolFieldName}`
          ).toContain(field.confidence);
        }
        for (const rel of objMapping.relationships) {
          expect(
            validConfidences,
            `Invalid confidence in ${tool.id}/${objMapping.id}/relationship`
          ).toContain(rel.confidence);
        }
      }
    }
  });

  it("each tool has unique object IDs", () => {
    for (const tool of tools) {
      const objectIds = tool.objects.map((o) => o.id);
      expect(
        new Set(objectIds).size,
        `Tool "${tool.name}" has duplicate object IDs`
      ).toBe(objectIds.length);
    }
  });

  it("each tool has unique field IDs within its objects", () => {
    for (const tool of tools) {
      for (const obj of tool.objects) {
        const fieldIds = obj.fields.map((f) => f.canonicalFieldId + f.toolFieldName);
        expect(
          new Set(fieldIds).size,
          `Tool "${tool.name}" object "${obj.toolObjectName}" has duplicate field mappings`
        ).toBe(fieldIds.length);
      }
    }
  });
});
