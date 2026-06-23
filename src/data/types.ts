export type Confidence = "high" | "medium" | "low";

export interface CanonicalField {
  id: string;
  name: string;
  description: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "datetime"
    | "enum"
    | "currency"
    | "relationship"
    | "array"
    | "unknown";
  required?: boolean;
}

export interface CanonicalRelationship {
  id: string;
  name: string;
  description: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType:
    | "one-to-one"
    | "one-to-many"
    | "many-to-one"
    | "many-to-many"
    | "association";
}

export interface CanonicalObject {
  id: string;
  name: string;
  description: string;
  commonAliases: string[];
  commonFields: CanonicalField[];
  relationships: CanonicalRelationship[];
  implementationNotes: string[];
  migrationQuestions: string[];
}

export type ToolCategory =
  | "crm"
  | "sales-engagement"
  | "marketing-automation"
  | "revenue-intelligence"
  | "other";

export interface ToolFieldMapping {
  toolFieldName: string;
  canonicalFieldId: string;
  type: string;
  required?: boolean;
  confidence: Confidence;
  notes?: string;
}

export interface ToolRelationshipMapping {
  targetToolObjectName: string;
  canonicalRelationshipId?: string;
  relationshipType:
    | "one-to-one"
    | "one-to-many"
    | "many-to-one"
    | "many-to-many"
    | "association"
    | "lookup"
    | "unknown";
  confidence: Confidence;
  notes?: string;
}

export interface ToolObjectMapping {
  id: string;
  toolObjectName: string;
  canonicalObjectId: string;
  description: string;
  confidence: Confidence;
  aliases?: string[];
  fields: ToolFieldMapping[];
  relationships: ToolRelationshipMapping[];
  notes: string[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  officialDocsUrl?: string;
  notes: string[];
  objects: ToolObjectMapping[];
}

export interface ExportSelection {
  sourceToolId: string;
  targetToolId: string;
}

export interface ExportReport {
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