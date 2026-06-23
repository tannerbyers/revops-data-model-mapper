import { tools } from "../data/tools";

interface ToolSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  excludeToolId?: string;
}

export function ToolSelector({ label, value, onChange, excludeToolId }: ToolSelectorProps) {
  const availableTools = tools.filter((t) => t.id !== excludeToolId);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="">-- Select a tool --</option>
        {availableTools.map((tool) => (
          <option key={tool.id} value={tool.id}>
            {tool.name}
          </option>
        ))}
      </select>
    </div>
  );
}
