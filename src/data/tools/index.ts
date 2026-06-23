import type { ToolDefinition } from "../types";
import { salesforce } from "./salesforce";
import { hubspot } from "./hubspot";
import { apollo } from "./apollo";
import { outreach } from "./outreach";
import { pipedrive } from "./pipedrive";
import { zoho } from "./zoho";
import { dynamics } from "./dynamics";
import { close } from "./close";
import { attio } from "./attio";
import { freshsales } from "./freshsales";

export const tools: ToolDefinition[] = [
  salesforce,
  hubspot,
  apollo,
  outreach,
  pipedrive,
  zoho,
  dynamics,
  close,
  attio,
  freshsales,
];

export function getTool(id: string): ToolDefinition | undefined {
  return tools.find((t) => t.id === id);
}

export function getToolByName(name: string): ToolDefinition | undefined {
  return tools.find((t) => t.name.toLowerCase() === name.toLowerCase());
}
