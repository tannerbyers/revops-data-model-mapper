import type { CanonicalObject, ToolObjectMapping, ToolDefinition } from "../data/types";

export interface ExportData {
  sourceTool: ToolDefinition;
  targetTool: ToolDefinition;
  timestamp: string;
  canonicalObjects: CanonicalObject[];
  mappings: Array<{
    canonicalObject: CanonicalObject;
    sourceMapping: ToolObjectMapping | null;
    targetMapping: ToolObjectMapping | null;
  }>;
}

export function exportCsv(data: ExportData): string {
  const headers = [
    "canonical_object",
    "source_tool",
    "source_object",
    "source_field",
    "target_tool",
    "target_object",
    "target_field",
    "confidence",
    "notes",
  ];

  const rows: string[] = [headers.join(",")];

  for (const mapping of data.mappings) {
    const canonicalName = mapping.canonicalObject.name;

    for (const field of mapping.canonicalObject.commonFields) {
      const sourceField = mapping.sourceMapping?.fields.find(
        (f) => f.canonicalFieldId === field.id
      );
      const targetField = mapping.targetMapping?.fields.find(
        (f) => f.canonicalFieldId === field.id
      );

      const confidence = sourceField?.confidence || targetField?.confidence || "unknown";
      const notes = [sourceField?.notes, targetField?.notes].filter(Boolean).join("; ");

      const row = [
        escapeCsv(canonicalName),
        escapeCsv(data.sourceTool.name),
        escapeCsv(mapping.sourceMapping?.toolObjectName || ""),
        escapeCsv(sourceField?.toolFieldName || ""),
        escapeCsv(data.targetTool.name),
        escapeCsv(mapping.targetMapping?.toolObjectName || ""),
        escapeCsv(targetField?.toolFieldName || ""),
        escapeCsv(confidence),
        escapeCsv(notes),
      ];
      rows.push(row.join(","));
    }
  }

  return rows.join("\n");
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportJson(data: ExportData): string {
  return JSON.stringify(
    {
      reportType: "RevOps Data Model Mapping Report",
      generatedAt: data.timestamp,
      sourceTool: {
        id: data.sourceTool.id,
        name: data.sourceTool.name,
      },
      targetTool: {
        id: data.targetTool.id,
        name: data.targetTool.name,
      },
      mappings: data.mappings.map((m) => ({
        canonicalObject: {
          id: m.canonicalObject.id,
          name: m.canonicalObject.name,
          description: m.canonicalObject.description,
        },
        sourceMapping: m.sourceMapping
          ? {
              toolObjectName: m.sourceMapping.toolObjectName,
              fields: m.sourceMapping.fields.map((f) => ({
                toolFieldName: f.toolFieldName,
                canonicalFieldId: f.canonicalFieldId,
                confidence: f.confidence,
              })),
            }
          : null,
        targetMapping: m.targetMapping
          ? {
              toolObjectName: m.targetMapping.toolObjectName,
              fields: m.targetMapping.fields.map((f) => ({
                toolFieldName: f.toolFieldName,
                canonicalFieldId: f.canonicalFieldId,
                confidence: f.confidence,
              })),
            }
          : null,
      })),
    },
    null,
    2
  );
}

export function exportMarkdown(data: ExportData): string {
  const lines: string[] = [];

  lines.push("# RevOps Data Model Mapping Report");
  lines.push("");
  lines.push(`**Source Tool:** ${data.sourceTool.name}`);
  lines.push(`**Target Tool:** ${data.targetTool.name}`);
  lines.push(`**Generated:** ${data.timestamp}`);
  lines.push("");

  lines.push("## Executive Summary");
  lines.push("");
  const mappedCount = data.mappings.filter((m) => m.sourceMapping && m.targetMapping).length;
  lines.push(
    `This report compares the data models of ${data.sourceTool.name} and ${data.targetTool.name} against a canonical revenue data model. `
  );
  lines.push(
    `Of ${data.canonicalObjects.length} canonical objects, ${mappedCount} are mapped in both tools.`
  );
  lines.push("");

  lines.push("## Object Mapping");
  lines.push("");
  lines.push("| Canonical Object | Source Object | Target Object | Mapped |");
  lines.push("|---|---|---|---|");
  for (const m of data.mappings) {
    const sourceName = m.sourceMapping?.toolObjectName || "-";
    const targetName = m.targetMapping?.toolObjectName || "-";
    const mapped = m.sourceMapping && m.targetMapping ? "Yes" : "Partial";
    lines.push(`| ${m.canonicalObject.name} | ${sourceName} | ${targetName} | ${mapped} |`);
  }
  lines.push("");

  lines.push("## Field Mapping Notes");
  lines.push("");
  for (const m of data.mappings) {
    if (!m.sourceMapping && !m.targetMapping) continue;
    lines.push(`### ${m.canonicalObject.name}`);
    lines.push("");
    lines.push("| Canonical Field | Source Field | Target Field | Confidence |");
    lines.push("|---|---|---|---|");
    for (const field of m.canonicalObject.commonFields) {
      const sourceField = m.sourceMapping?.fields.find((f) => f.canonicalFieldId === field.id);
      const targetField = m.targetMapping?.fields.find((f) => f.canonicalFieldId === field.id);
      const confidence = sourceField?.confidence || targetField?.confidence || "-";
      lines.push(
        `| ${field.name} | ${sourceField?.toolFieldName || "-"} | ${targetField?.toolFieldName || "-"} | ${confidence} |`
      );
    }
    lines.push("");
  }

  lines.push("## Relationship Notes");
  lines.push("");
  for (const m of data.mappings) {
    if (m.sourceMapping && m.targetMapping) {
      lines.push(`- **${m.canonicalObject.name}**: Mapped in both tools.`);
      for (const rel of m.sourceMapping.relationships) {
        lines.push(`  - ${rel.targetToolObjectName} (${rel.relationshipType})`);
      }
    } else if (m.sourceMapping) {
      lines.push(`- **${m.canonicalObject.name}**: Only in ${data.sourceTool.name}. May not exist in ${data.targetTool.name}.`);
    } else if (m.targetMapping) {
      lines.push(`- **${m.canonicalObject.name}**: Only in ${data.targetTool.name}. May not exist in ${data.sourceTool.name}.`);
    }
  }
  lines.push("");

  lines.push("## Migration Questions");
  lines.push("");
  for (const obj of data.canonicalObjects) {
    for (const q of obj.migrationQuestions) {
      lines.push(`- [ ] ${q}`);
    }
  }
  lines.push("");

  lines.push("## Assumptions and Limitations");
  lines.push("");
  lines.push(
    "- This mapping is based on standard objects and fields. Custom fields and custom objects require additional mapping."
  );
  lines.push(
    "- Field types may differ between platforms (e.g., picklist vs string)."
  );
  lines.push(
    "- Relationship models (e.g., lookup vs junction object) may require middleware transformation."
  );
  lines.push(
    "- Real client systems often include automations, permissions, and historical data issues that require implementation review."
  );

  return lines.join("\n");
}

export function exportMermaid(data: ExportData): string {
  const lines: string[] = [];

  lines.push("erDiagram");

  // Collect all objects that have mappings
  const mappedCanonical = data.mappings.filter(
    (m) => m.sourceMapping || m.targetMapping
  );

  // Define entities
  for (const m of mappedCanonical) {
    const objName = m.canonicalObject.name.toUpperCase().replace(/[\s/]+/g, "_");
    lines.push(`  ${objName} {`);
    for (const field of m.canonicalObject.commonFields.slice(0, 5)) {
      lines.push(`    ${field.type} ${field.name.replace(/[\s/]+/g, "_")}`);
    }
    lines.push("  }");
  }

  lines.push("");

  // Define relationships from canonical objects
  for (const m of mappedCanonical) {
    const objName = m.canonicalObject.name.toUpperCase().replace(/[\s/]+/g, "_");
    for (const rel of m.canonicalObject.relationships) {
      const targetObj = data.canonicalObjects.find((o) => o.id === rel.targetObjectId);
      if (!targetObj) continue;
      const targetName = targetObj.name.toUpperCase().replace(/[\s/]+/g, "_");
      if (rel.relationshipType === "one-to-many") {
        lines.push(`  ${objName} ||--o{ ${targetName} : "${rel.name}"`);
      } else if (rel.relationshipType === "many-to-one") {
        lines.push(`  ${objName} }o--|| ${targetName} : "${rel.name}"`);
      } else if (rel.relationshipType === "many-to-many") {
        lines.push(`  ${objName} }o--o{ ${targetName} : "${rel.name}"`);
      } else if (rel.relationshipType === "one-to-one") {
        lines.push(`  ${objName} ||--|| ${targetName} : "${rel.name}"`);
      } else {
        lines.push(`  ${objName} -- ${targetName} : "${rel.name}"`);
      }
    }
  }

  return lines.join("\n");
}