/** JSON Schema for a tool's input parameters */
export interface ToolInputSchema {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
}

/** A single tool definition exposed by an API pack */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
}

/** Environment secrets/bindings passed from the gateway to packs that need them */
export type PackEnv = Record<string, string>;

/** The standard export shape for every stupid API pack */
export interface StupidApiExport {
  tools: ToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>, env?: PackEnv) => Promise<unknown>;
}
