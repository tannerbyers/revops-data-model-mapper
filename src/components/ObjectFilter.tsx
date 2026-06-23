import { canonicalObjects } from "../data/canonicalObjects";

interface ObjectFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function ObjectFilter({ value, onChange }: ObjectFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Canonical Object
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="">All objects</option>
        {canonicalObjects.map((obj) => (
          <option key={obj.id} value={obj.id}>
            {obj.name}
          </option>
        ))}
      </select>
    </div>
  );
}
