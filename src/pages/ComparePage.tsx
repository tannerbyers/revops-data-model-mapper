import { useState } from "react";
import { ToolSelector } from "../components/ToolSelector";
import { getTool } from "../data/tools";
import { canonicalObjects } from "../data/canonicalObjects";
import type { ToolObjectMapping, CanonicalObject } from "../data/types";

interface ComparisonRow {
  canonicalObject: CanonicalObject;
  sourceMapping: ToolObjectMapping | null;
  targetMapping: ToolObjectMapping | null;
}

export function ComparePage() {
  const [toolA, setToolA] = useState("");
  const [toolB, setToolB] = useState("");

  const toolADef = getTool(toolA);
  const toolBDef = getTool(toolB);

  function getMapping(tool: typeof toolADef, canonicalId: string): ToolObjectMapping | null {
    if (!tool) return null;
    return tool.objects.find((o) => o.canonicalObjectId === canonicalId) ?? null;
  }

  const rows: ComparisonRow[] = canonicalObjects.map((obj) => ({
    canonicalObject: obj,
    sourceMapping: getMapping(toolADef, obj.id),
    targetMapping: getMapping(toolBDef, obj.id),
  }));

  const consultingNotes = generateConsultingNotes(toolADef, toolBDef, rows);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Compare Tools</h1>
        <p className="mt-1 text-gray-500">
          Side-by-side comparison of object mappings, naming differences, and gaps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <ToolSelector label="Tool A" value={toolA} onChange={setToolA} excludeToolId={toolB} />
        <ToolSelector label="Tool B" value={toolB} onChange={setToolB} excludeToolId={toolA} />
      </div>

      {!toolA || !toolB ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Select two tools to compare their data models.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {rows.map((row) => (
              <div
                key={row.canonicalObject.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{row.canonicalObject.name}</h3>
                    <p className="text-xs text-gray-500">{row.canonicalObject.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {row.sourceMapping && (
                      <span className="text-green-700 bg-green-50 px-2 py-1 rounded">
                        Mapped in {toolADef?.name}
                      </span>
                    )}
                    {row.targetMapping && (
                      <span className="text-green-700 bg-green-50 px-2 py-1 rounded">
                        Mapped in {toolBDef?.name}
                      </span>
                    )}
                  </div>
                </div>

                {!row.sourceMapping && !row.targetMapping ? (
                  <div className="px-4 py-4 text-sm text-gray-400 italic">
                    Not mapped in either tool.
                  </div>
                ) : (
                  <div className="p-4">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Canonical Field</th>
                          <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                            {toolADef?.name}
                          </th>
                          <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                            {toolBDef?.name}
                          </th>
                          <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">Match</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {row.canonicalObject.commonFields.map((field) => {
                          const aField = row.sourceMapping?.fields.find(
                            (f) => f.canonicalFieldId === field.id
                          );
                          const bField = row.targetMapping?.fields.find(
                            (f) => f.canonicalFieldId === field.id
                          );
                          const match =
                            aField && bField
                              ? aField.toolFieldName === bField.toolFieldName
                                ? "Same name"
                                : "Different name"
                              : "Not mapped";

                          const matchColor =
                            match === "Same name"
                              ? "text-green-600"
                              : match === "Different name"
                              ? "text-yellow-600"
                              : "text-red-500";

                          return (
                            <tr key={field.id} className="hover:bg-gray-50">
                              <td className="py-2 pr-4">{field.name}</td>
                              <td className="py-2 pr-4">
                                {aField ? (
                                  <span className="font-mono text-indigo-700 text-xs">
                                    {aField.toolFieldName}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 italic text-xs">-</span>
                                )}
                              </td>
                              <td className="py-2 pr-4">
                                {bField ? (
                                  <span className="font-mono text-indigo-700 text-xs">
                                    {bField.toolFieldName}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 italic text-xs">-</span>
                                )}
                              </td>
                              <td className={`py-2 text-xs font-medium ${matchColor}`}>{match}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Relationship comparison */}
                    {row.sourceMapping && row.targetMapping && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-xs font-medium text-gray-500 uppercase">Relationships</span>
                        <div className="mt-1 space-y-1">
                          {row.sourceMapping.relationships.map((rel, i) => {
                            const targetRel = row.targetMapping?.relationships.find(
                              (r) => r.canonicalRelationshipId === rel.canonicalRelationshipId
                            );
                            return (
                              <div key={i} className="text-xs text-gray-600">
                                {rel.targetToolObjectName}
                                {targetRel ? (
                                  <span className="text-green-600">
                                    {" "}&harr;{" "}{targetRel.targetToolObjectName}
                                  </span>
                                ) : (
                                  <span className="text-yellow-600"> (not in target)</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Consulting Notes */}
          <div className="mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
              <h3 className="font-semibold text-amber-900">{"\uD83D\uDCDD"} Consulting Notes</h3>
            </div>
            <div className="p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {consultingNotes}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function generateConsultingNotes(
  toolA: ReturnType<typeof getTool>,
  toolB: ReturnType<typeof getTool>,
  rows: ComparisonRow[]
): string {
  if (!toolA || !toolB) return "Select two tools to generate consulting notes.";

  const parts: string[] = [];
  parts.push(`Comparison: ${toolA.name} vs ${toolB.name}`);
  parts.push("=".repeat(40));
  parts.push("");

  const mappedInA = rows.filter((r) => r.sourceMapping).length;
  const mappedInB = rows.filter((r) => r.targetMapping).length;
  const mappedInBoth = rows.filter((r) => r.sourceMapping && r.targetMapping).length;

  parts.push(`Coverage:`);
  parts.push(`  - Objects mapped in ${toolA.name}: ${mappedInA}/8`);
  parts.push(`  - Objects mapped in ${toolB.name}: ${mappedInB}/8`);
  parts.push(`  - Objects mapped in both: ${mappedInBoth}/8`);
  parts.push("");

  // Naming differences
  const namingDiffs: string[] = [];
  for (const row of rows) {
    if (row.sourceMapping && row.targetMapping) {
      for (const field of row.canonicalObject.commonFields) {
        const aField = row.sourceMapping.fields.find((f) => f.canonicalFieldId === field.id);
        const bField = row.targetMapping.fields.find((f) => f.canonicalFieldId === field.id);
        if (aField && bField && aField.toolFieldName !== bField.toolFieldName) {
          namingDiffs.push(
            `  - "${field.name}": ${aField.toolFieldName} (${toolA.name}) vs ${bField.toolFieldName} (${toolB.name})`
          );
        }
      }
    }
  }

  if (namingDiffs.length > 0) {
    parts.push(`Notable naming differences:`);
    parts.push(...namingDiffs);
    parts.push("");
    parts.push(
      "These fields will require mapping configuration during integration or migration."
    );
    parts.push("");
  }

  // Gaps
  const gaps = rows.filter((r) => !r.sourceMapping || !r.targetMapping);
  if (gaps.length > 0) {
    parts.push(`Objects with gaps:`);
    for (const gap of gaps) {
      const missing = [];
      if (!gap.sourceMapping) missing.push(toolA.name);
      if (!gap.targetMapping) missing.push(toolB.name);
      parts.push(`  - ${gap.canonicalObject.name}: not mapped in ${missing.join(", ")}`);
    }
    parts.push("");
    parts.push(
      "Gaps may indicate the object does not exist natively or uses a different conceptual model."
    );
    parts.push("");
  }

  // Relationship differences
  parts.push(`Recommendations:`);
  parts.push(
    `  - Review the ${mappedInBoth} shared objects for detailed field-level mapping.`
  );
  parts.push(`  - Plan custom fields or middleware transformations for naming differences.`);
  parts.push(
    `  - Validate activity and sequence mappings as these vary most between platforms.`
  );
  parts.push(`  - Confirm account/contact association models are aligned.`);

  return parts.join("\n");
}