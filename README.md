# RevOps Data Model Mapper

A client-side web app that maps CRM and GTM tool data models to a shared canonical revenue data model. Built for RevOps consultants at DecoupleDev to use in sales calls and client engagements.

**Live site:** [https://decoupledev.github.io/revops-data-model-mapper/](https://decoupledev.github.io/revops-data-model-mapper/)

## What it does

- Maps 10+ CRM and sales engagement tools to 8 canonical objects
- Compares two tools side-by-side with consulting notes
- Shows the canonical revenue data model as an educational reference
- Exports mapping reports in CSV, JSON, Markdown, and Mermaid ERD formats
- All client-side — no backend, no database, no API calls

## Supported tools

| Tool | Category |
|---|---|
| Salesforce | CRM |
| HubSpot | CRM |
| Apollo | Sales Engagement |
| Outreach | Sales Engagement |
| Pipedrive | CRM |
| Zoho CRM | CRM |
| Microsoft Dynamics 365 Sales | CRM |
| Close | CRM |
| Attio | CRM |
| Freshsales | CRM |

## Canonical objects

1. Account
2. Contact
3. Lead
4. Opportunity
5. Activity
6. Campaign / Sequence
7. User / Owner
8. Product / Line Item

## Local setup

```bash
# Clone the repository
git clone https://github.com/DecoupleDev/revops-data-model-mapper.git
cd revops-data-model-mapper

# Install dependencies
npm install

# Start development server
npm run dev
```

## Commands

```bash
# TypeScript type check
npm run typecheck

# Lint
npm run lint

# Unit tests (Vitest)
npm test

# Watch mode for tests
npm run test:watch

# Build for production
npm run build

# Preview production build
npm run preview

# Playwright smoke tests (requires build + preview running)
npx playwright test
```

## Deployment

The app deploys automatically to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch.

The Vite `base` path is set to `/revops-data-model-mapper/` to match the GitHub Pages URL.

To deploy manually:

```bash
npm run build
npx serve dist  # or use gh-pages package
```

## How to add a new tool mapping

1. Create a new file at `src/data/tools/<tool-name>.ts`
2. Export a `ToolDefinition` object following the TypeScript types in `src/data/types.ts`
3. Add the import and entry to the array in `src/data/tools/index.ts`
4. Run `npm run typecheck` and `npm test` to verify
5. The tool will automatically appear in all selectors and export formats

Example structure:

```typescript
import type { ToolDefinition } from "../types";

export const myTool: ToolDefinition = {
  id: "my-tool",
  name: "My Tool",
  category: "crm",
  description: "...",
  notes: [],
  objects: [
    {
      id: "mt_account",
      toolObjectName: "Account",
      canonicalObjectId: "account",
      description: "...",
      confidence: "high",
      fields: [
        {
          toolFieldName: "Name",
          canonicalFieldId: "account_name",
          type: "string",
          required: true,
          confidence: "high",
        },
      ],
      relationships: [],
      notes: [],
    },
  ],
};
```

## How to update canonical objects

Edit `src/data/canonicalObjects.ts`. Each object follows the `CanonicalObject` type:

- `id`: unique identifier
- `name`: display name
- `description`: explanation of the object
- `commonAliases`: alternative names across tools
- `commonFields`: standard fields with id, name, description, type, required
- `relationships`: relationships to other canonical objects
- `implementationNotes`: notes for implementation
- `migrationQuestions`: questions to ask during migration

## TypeScript types

The core types are in `src/data/types.ts`:

- `Confidence`: `"high" | "medium" | "low"`
- `CanonicalObject`: canonical data model object
- `CanonicalField`: field definition within a canonical object
- `ToolDefinition`: a CRM/revenue tool with its object mappings
- `ToolObjectMapping`: how a tool object maps to a canonical object
- `ToolFieldMapping`: how a tool field maps to a canonical field
- `ToolRelationshipMapping`: how tool relationships map to canonical relationships

## Project structure

```
src/
  data/
    types.ts              # TypeScript types
    canonicalObjects.ts   # 8 canonical objects
    tools/
      index.ts            # Tool registry
      salesforce.ts
      hubspot.ts
      apollo.ts
      outreach.ts
      pipedrive.ts
      zoho.ts
      dynamics.ts
      close.ts
      attio.ts
      freshsales.ts
  components/
    Layout.tsx            # App shell with header/footer
    ToolSelector.tsx      # Tool dropdown selector
    ObjectFilter.tsx      # Canonical object filter
    SearchFilter.tsx      # Search/filter input
    MappingTable.tsx      # Field mapping table
  pages/
    HomePage.tsx          # Main mapper page
    ComparePage.tsx       # Side-by-side comparison
    ModelPage.tsx         # Canonical model reference
    ExportPage.tsx        # Report export page
  export/
    exporters.ts          # CSV, JSON, Markdown, Mermaid exports
  test/
    setup.ts              # Test setup
    data.test.ts          # Data integrity tests
    export.test.ts        # Export function tests
  App.tsx                 # Root component with routing
  main.tsx                # Entry point
e2e/
  smoke.spec.ts           # Playwright smoke tests
.github/workflows/
  ci.yml                  # CI: typecheck, lint, test, build
  deploy-pages.yml        # Deploy to GitHub Pages
```

## Limitations and disclaimer

This tool provides a standard-model comparison for research and planning. It is intentionally a first-pass mapping — not an exhaustive schema analysis.

Real client systems include:
- Custom fields and custom objects
- Automations and workflows
- Permission models and sharing rules
- Historical data quality issues
- Business-specific naming conventions

Always perform implementation review before migration or integration.

The app is fully client-side with no backend, no database, no authentication, and no external API calls. All data is stored in static TypeScript files.

## Built by DecoupleDev

A RevOps consulting toolkit by [DecoupleDev](https://decoupledev.com).