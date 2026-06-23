import { useState, useCallback } from "react";
import { ToolSelector } from "../components/ToolSelector";
import { getTool } from "../data/tools";
import { canonicalObjects } from "../data/canonicalObjects";
import {
  exportCsv,
  exportJson,
  exportMarkdown,
  exportMermaid,
  type ExportData,
} from "../export/exporters";

type ExportFormat = "csv" | "json" | "markdown" | "mermaid";

export function ExportPage() {
  const [sourceToolId, setSourceToolId] = useState("");
  const [targetToolId, setTargetToolId] = useState("");
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const sourceTool = getTool(sourceToolId);
  const targetTool = getTool(targetToolId);

  const canExport = sourceToolId && targetToolId;

  const handleExport = useCallback(() => {
    if (!sourceTool || !targetTool) return;

    const data: ExportData = {
      sourceTool,
      targetTool,
      timestamp: new Date().toISOString(),
      canonicalObjects,
      mappings: canonicalObjects.map((obj) => ({
        canonicalObject: obj,
        sourceMapping: sourceTool.objects.find((o) => o.canonicalObjectId === obj.id) ?? null,
        targetMapping: targetTool.objects.find((o) => o.canonicalObjectId === obj.id) ?? null,
      })),
    };

    let result = "";
    switch (format) {
      case "csv":
        result = exportCsv(data);
        break;
      case "json":
        result = exportJson(data);
        break;
      case "markdown":
        result = exportMarkdown(data);
        break;
      case "mermaid":
        result = exportMermaid(data);
        break;
    }
    setOutput(result);
  }, [sourceTool, targetTool, format]);

  const handleDownload = useCallback(() => {
    if (!output) return;

    const extensions: Record<ExportFormat, string> = {
      csv: "csv",
      json: "json",
      markdown: "md",
      mermaid: "mmd",
    };
    const mimeTypes: Record<ExportFormat, string> = {
      csv: "text/csv",
      json: "application/json",
      markdown: "text/markdown",
      mermaid: "text/plain",
    };

    const blob = new Blob([output], { type: mimeTypes[format] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revops-mapping-${sourceToolId}-${targetToolId}.${extensions[format]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [output, format, sourceToolId, targetToolId]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Export Report</h1>
        <p className="mt-1 text-gray-500">
          Generate and download mapping reports in CSV, JSON, Markdown, or Mermaid ERD format.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <ToolSelector
            label="Source Tool"
            value={sourceToolId}
            onChange={setSourceToolId}
          />
          <ToolSelector
            label="Target Tool"
            value={targetToolId}
            onChange={setTargetToolId}
            excludeToolId={sourceToolId}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Export Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="markdown">Markdown</option>
              <option value="mermaid">Mermaid ERD</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={!canExport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Report
          </button>
          {output && (
            <>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
            </>
          )}
        </div>
      </div>

      {!canExport && (
        <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-gray-200">
          <p className="text-sm">Select a source and target tool to generate an export.</p>
        </div>
      )}

      {output && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              Preview ({format.toUpperCase()})
            </span>
          </div>
          <pre className="p-4 overflow-x-auto text-xs text-gray-700 font-mono whitespace-pre max-h-96">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}