import type { CanonicalObject, ToolObjectMapping } from "../data/types";

interface MappingTableProps {
  canonicalObject: CanonicalObject;
  sourceMapping: ToolObjectMapping | null;
  targetMapping: ToolObjectMapping | null;
}

export function MappingTable({
  canonicalObject,
  sourceMapping,
  targetMapping,
}: MappingTableProps) {
  const allFields = canonicalObject.commonFields;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Canonical Field
            </th>
            {sourceMapping && (
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source: {sourceMapping.toolObjectName}
              </th>
            )}
            {targetMapping && (
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target: {targetMapping.toolObjectName}
              </th>
            )}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Confidence
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {allFields.map((field) => {
            const sourceField = sourceMapping?.fields.find(
              (f) => f.canonicalFieldId === field.id
            );
            const targetField = targetMapping?.fields.find(
              (f) => f.canonicalFieldId === field.id
            );
const notes = [
              sourceField?.notes,
              targetField?.notes,
            ]
              .filter(Boolean)
              .join("; ");

            return (
              <tr key={field.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{field.name}</div>
                  <div className="text-gray-500 text-xs">{field.type}</div>
                </td>
                {sourceMapping && (
                  <td className="px-4 py-3">
                    {sourceField ? (
                      <div>
                        <span className="font-mono text-indigo-700 text-xs">
                          {sourceField.toolFieldName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Not mapped</span>
                    )}
                  </td>
                )}
                {targetMapping && (
                  <td className="px-4 py-3">
                    {targetField ? (
                      <div>
                        <span className="font-mono text-indigo-700 text-xs">
                          {targetField.toolFieldName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Not mapped</span>
                    )}
                  </td>
                )}
                <td className="px-4 py-3">
                  <ConfidenceBadge level={sourceField?.confidence || targetField?.confidence || "low"} />
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 max-w-xs">
                  {notes || "-"}
                </td>
              </tr>
            );
          })}
          {/* Show unmapped sections */}
          {!sourceMapping && !targetMapping && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                Select a source tool to see field mappings
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ConfidenceBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    high: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        styles[level] || "bg-gray-100 text-gray-800"
      }`}
    >
      {level}
    </span>
  );
}
