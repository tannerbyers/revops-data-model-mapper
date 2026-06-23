import { useState } from "react";
import { ToolSelector } from "../components/ToolSelector";
import { ObjectFilter } from "../components/ObjectFilter";
import { SearchFilter } from "../components/SearchFilter";
import { MappingTable } from "../components/MappingTable";
import { canonicalObjects } from "../data/canonicalObjects";
import { getTool } from "../data/tools";
import type { ToolObjectMapping } from "../data/types";

export function HomePage() {
  const [sourceToolId, setSourceToolId] = useState("");
  const [targetToolId, setTargetToolId] = useState("");
  const [objectFilter, setObjectFilter] = useState("");
  const [search, setSearch] = useState("");

  const sourceTool = getTool(sourceToolId);
  const targetTool = getTool(targetToolId);

  let objectsToShow = canonicalObjects;
  if (objectFilter) {
    objectsToShow = objectsToShow.filter((o) => o.id === objectFilter);
  }
  if (search) {
    const q = search.toLowerCase();
    objectsToShow = objectsToShow.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.commonAliases.some((a) => a.toLowerCase().includes(q)) ||
        o.commonFields.some((f) => f.name.toLowerCase().includes(q))
    );
  }

  function getMapping(
    tool: typeof sourceTool,
    canonicalId: string
  ): ToolObjectMapping | null {
    if (!tool) return null;
    return tool.objects.find((o) => o.canonicalObjectId === canonicalId) ?? null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">RevOps Data Model Mapper</h1>
        <p className="mt-1 text-gray-500">
          Compare CRM and GTM data models across common RevOps tools.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ToolSelector
          label="Source Tool"
          value={sourceToolId}
          onChange={setSourceToolId}
        />
        <ToolSelector
          label="Target Tool (optional)"
          value={targetToolId}
          onChange={setTargetToolId}
          excludeToolId={sourceToolId}
        />
        <ObjectFilter value={objectFilter} onChange={setObjectFilter} />
        <SearchFilter value={search} onChange={setSearch} />
      </div>

      {sourceTool && (
        <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-2 mb-6 text-sm text-blue-800">
          <strong>Source:</strong> {sourceTool.name}
          {targetTool && (
            <> &middot; <strong>Target:</strong> {targetTool.name}</>
          )}
          &middot; Showing {objectsToShow.length} canonical object{objectsToShow.length !== 1 ? "s" : ""}
        </div>
      )}

      <div className="space-y-8">
        {objectsToShow.map((canonicalObj) => {
          const sourceMapping = getMapping(sourceTool, canonicalObj.id);
          const targetMapping = getMapping(targetTool, canonicalObj.id);

          return (
            <section
              key={canonicalObj.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {canonicalObj.name}
                </h2>
                <p className="text-sm text-gray-500">{canonicalObj.description}</p>
              </div>

              <div className="p-4">
                {!sourceTool && !targetTool ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">Select a source tool above to see field mappings.</p>
                  </div>
                ) : (
                  <MappingTable
                    canonicalObject={canonicalObj}
                    sourceMapping={sourceMapping}
                    targetMapping={targetMapping}
                  />
                )}
              </div>
            </section>
          );
        })}
      </div>

      {objectsToShow.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No results match your search criteria.</p>
        </div>
      )}
    </div>
  );
}