import { canonicalObjects } from "../data/canonicalObjects";

export function ModelPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Canonical Revenue Data Model</h1>
        <p className="mt-1 text-gray-500">
          The standard objects, fields, and relationships used as the reference model for mapping.
        </p>
      </div>

      <div className="space-y-8">
        {canonicalObjects.map((obj) => (
          <section
            key={obj.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{obj.name}</h2>
              <p className="text-sm text-gray-500">{obj.description}</p>
            </div>

            <div className="p-4 space-y-6">
              {/* Aliases */}
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Common Aliases
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {obj.commonAliases.map((alias) => (
                    <span
                      key={alias}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700"
                    >
                      {alias}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fields */}
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Common Fields
                </span>
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-xs font-medium text-gray-500">Field</th>
                        <th className="text-left py-2 text-xs font-medium text-gray-500">Type</th>
                        <th className="text-left py-2 text-xs font-medium text-gray-500">Required</th>
                        <th className="text-left py-2 text-xs font-medium text-gray-500">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {obj.commonFields.map((field) => (
                        <tr key={field.id} className="hover:bg-gray-50">
                          <td className="py-2 pr-4 font-mono text-xs text-indigo-700">
                            {field.name}
                          </td>
                          <td className="py-2 pr-4 text-xs text-gray-600">{field.type}</td>
                          <td className="py-2 pr-4 text-xs">
                            {field.required ? (
                              <span className="text-green-600 font-medium">Yes</span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </td>
                          <td className="py-2 text-xs text-gray-500">{field.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Relationships */}
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Relationships
                </span>
                <div className="mt-2 space-y-1">
                  {obj.relationships.length > 0 ? (
                    obj.relationships.map((rel) => (
                      <div key={rel.id} className="text-xs text-gray-600 flex items-center gap-2">
                        <span className="font-medium">{rel.name}</span>
                        <span className="text-gray-400">({rel.relationshipType})</span>
                        <span className="text-gray-400">&mdash;</span>
                        <span className="text-gray-500">{rel.description}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">No relationships defined</p>
                  )}
                </div>
              </div>

              {/* Implementation Notes */}
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Implementation Notes
                </span>
                <ul className="mt-2 space-y-1">
                  {obj.implementationNotes.map((note, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-indigo-400 mt-0.5">&bull;</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Migration Questions */}
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Migration Questions
                </span>
                <ul className="mt-2 space-y-1">
                  {obj.migrationQuestions.map((q, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2">
                      <span className="text-amber-500 mt-0.5">?</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}