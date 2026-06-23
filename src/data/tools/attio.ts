import type { ToolDefinition } from "../types";

export const attio: ToolDefinition = {
  id: "attio",
  name: "Attio",
  category: "crm",
  description:
    "Attio is a modern, flexible CRM built for relationship-driven businesses. It uses an object-attribute model with dynamic schemas and strong API-first design.",
  officialDocsUrl: "https://docs.attio.com/",
  notes: [
    "Attio uses a flexible schema where objects and attributes can be customized freely.",
    "It does not use the traditional Lead object; contacts are the primary person entity.",
    "Attio is API-first with a modern GraphQL and REST API.",
  ],
  objects: [
    {
      id: "att_company",
      toolObjectName: "Company",
      canonicalObjectId: "account",
      description: "Organization or company record",
      confidence: "high",
      aliases: ["Organization", "Account"],
      fields: [
        {
          toolFieldName: "name",
          canonicalFieldId: "account_name",
          type: "string",
          required: true,
          confidence: "high",
        },
        {
          toolFieldName: "website",
          canonicalFieldId: "account_website",
          type: "string",
          confidence: "high",
        },
        {
          toolFieldName: "domain",
          canonicalFieldId: "account_domain",
          type: "string",
          confidence: "high",
        },
        {
          toolFieldName: "industry",
          canonicalFieldId: "account_industry",
          type: "string",
          confidence: "high",
        },
        {
          toolFieldName: "phone_number",
          canonicalFieldId: "account_phone",
          type: "string",
          confidence: "high",
        },
        {
          toolFieldName: "created_at",
          canonicalFieldId: "account_created_date",
          type: "datetime",
          confidence: "high",
        },
      ],
      relationships: [
        {
          targetToolObjectName: "Person",
          canonicalRelationshipId: "account_has_contacts",
          relationshipType: "one-to-many",
          confidence: "high",
        },
        {
          targetToolObjectName: "Deal",
          canonicalRelationshipId: "account_has_opportunities",
          relationshipType: "one-to-many",
          confidence: "high",
        },
      ],
      notes: [
        "Attio Company is equivalent to Account in traditional CRMs.",
        "Custom attributes can be added to any object dynamically.",
      ],
    },
    {
      id: "att_person",
      toolObjectName: "Person",
      canonicalObjectId: "contact",
      description: "Individual person record",
      confidence: "high",
      aliases: ["Contact", "Individual"],
      fields: [
        {
          toolFieldName: "first_name",
          canonicalFieldId: "contact_first_name",
          type: "string",
          confidence: "high",
        },
        {
          toolFieldName: "last_name",
          canonicalFieldId: "contact_last_name",
          type: "string",
          required: true,
          confidence: "high",
        },
        {
          toolFieldName: "email_addresses",
          canonicalFieldId: "contact_email",
          type: "array",
          confidence: "high",
          notes: "Stored as array of email objects with type and address",
        },
        {
          toolFieldName: "phone_numbers",
          canonicalFieldId: "contact_phone",
          type: "array",
          confidence: "high",
          notes: "Stored as array of phone objects",
        },
        {
          toolFieldName: "job_title",
          canonicalFieldId: "contact_job_title",
          type: "string",
          confidence: "high",
        },
        {
          toolFieldName: "created_at",
          canonicalFieldId: "contact_created_date",
          type: "datetime",
          confidence: "high",
        },
      ],
      relationships: [
        {
          targetToolObjectName: "Company",
          canonicalRelationshipId: "contact_belongs_to_account",
          relationshipType: "many-to-one",
          confidence: "high",
        },
      ],
      notes: [
        "Attio does not have a separate Lead object; Person serves the role of both Contact and Lead.",
        "Email and phone are stored as arrays supporting multiple values per person.",
      ],
    },
    {
      id: "att_deal",
      toolObjectName: "Deal",
      canonicalObjectId: "opportunity",
      description: "Sales deal or opportunity in pipeline",
      confidence: "high",
      aliases: ["Opportunity"],
      fields: [
        {
          toolFieldName: "name",
          canonicalFieldId: "opportunity_name",
          type: "string",
          required: true,
          confidence: "high",
        },
        {
          toolFieldName: "value",
          canonicalFieldId: "opportunity_amount",
          type: "number",
          confidence: "high",
        },
        {
          toolFieldName: "status",
          canonicalFieldId: "opportunity_stage",
          type: "string",
          confidence: "high",
        },
        {
          toolFieldName: "close_date",
          canonicalFieldId: "opportunity_close_date",
          type: "date",
          confidence: "high",
        },
        {
          toolFieldName: "created_at",
          canonicalFieldId: "opportunity_created_date",
          type: "datetime",
          confidence: "high",
        },
      ],
      relationships: [
        {
          targetToolObjectName: "Company",
          canonicalRelationshipId: "opportunity_belongs_to_account",
          relationshipType: "many-to-one",
          confidence: "high",
        },
        {
          targetToolObjectName: "Person",
          canonicalRelationshipId: "opportunity_has_contacts",
          relationshipType: "many-to-many",
          confidence: "high",
        },
      ],
      notes: [
        "Deals in Attio are highly customizable with dynamic attributes.",
        "Pipeline stages and statuses are user-defined.",
      ],
    },
    {
      id: "att_activity",
      toolObjectName: "Activity",
      canonicalObjectId: "activity",
      description: "Activity records for communications and interactions",
      confidence: "high",
      aliases: ["Note", "Email", "Call", "Event"],
      fields: [
        {
          toolFieldName: "type",
          canonicalFieldId: "activity_type",
          type: "string",
          required: true,
          confidence: "high",
          notes: "Note, Email, Call, Meeting, etc.",
        },
        {
          toolFieldName: "occurred_at",
          canonicalFieldId: "activity_date",
          type: "datetime",
          confidence: "high",
        },
        {
          toolFieldName: "body",
          canonicalFieldId: "activity_description",
          type: "string",
          confidence: "high",
        },
        {
          toolFieldName: "created_at",
          canonicalFieldId: "activity_created_date",
          type: "datetime",
          confidence: "high",
        },
      ],
      relationships: [
        {
          targetToolObjectName: "Person",
          canonicalRelationshipId: "activity_associated_to_contact",
          relationshipType: "many-to-one",
          confidence: "high",
        },
        {
          targetToolObjectName: "Company",
          canonicalRelationshipId: "activity_associated_to_account",
          relationshipType: "many-to-one",
          confidence: "high",
        },
        {
          targetToolObjectName: "Deal",
          canonicalRelationshipId: "activity_associated_to_opportunity",
          relationshipType: "many-to-one",
          confidence: "high",
        },
      ],
      notes: [
        "Attio supports rich activity tracking with flexible associations.",
        "Activities can be linked to multiple objects simultaneously.",
      ],
    },
    {
      id: "att_list",
      toolObjectName: "List",
      canonicalObjectId: "campaign",
      description:
        "Lists (similar to campaigns/sequences) for organizing people and deals",
      confidence: "medium",
      aliases: ["Campaign", "Sequence", "Segment"],
      fields: [
        {
          toolFieldName: "name",
          canonicalFieldId: "campaign_name",
          type: "string",
          required: true,
          confidence: "high",
        },
        {
          toolFieldName: "created_at",
          canonicalFieldId: "campaign_start_date",
          type: "datetime",
          confidence: "high",
        },
      ],
      relationships: [
        {
          targetToolObjectName: "Person",
          canonicalRelationshipId: "campaign_has_leads",
          relationshipType: "many-to-many",
          confidence: "medium",
          notes: "Lists can include people and deals",
        },
      ],
      notes: [
        "Attio Lists are flexible groupings that can serve campaign-like functions.",
        "Lists are not equivalent to traditional marketing campaigns but can be adapted.",
      ],
    },
    {
      id: "att_user",
      toolObjectName: "Workspace Member",
      canonicalObjectId: "user",
      description: "User with access to the Attio workspace",
      confidence: "medium",
      aliases: ["User", "Team Member"],
      fields: [
        {
          toolFieldName: "name",
          canonicalFieldId: "user_name",
          type: "string",
          required: true,
          confidence: "high",
        },
        {
          toolFieldName: "email_address",
          canonicalFieldId: "user_email",
          type: "string",
          required: true,
          confidence: "high",
        },
      ],
      relationships: [],
      notes: [
        "Attio workspace members map to CRM users.",
        "Role-based permissions are available but less granular than enterprise CRMs.",
      ],
    },
  ],
};