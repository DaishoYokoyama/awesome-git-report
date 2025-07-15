import { z } from "zod";

export const CommitSummary = z.object({
  changeOverview: z
    .string()
    .describe(
      "Change overview (1-2 line summary of what this commit accomplished based on commit message and changes)"
    ),

  mainChanges: z
    .array(z.string())
    .describe("Main changes (functional changes listed in bullet points)"),

  affectedFiles: z
    .array(
      z.object({
        filePath: z.string().describe("File path"),
        description: z.string().describe("Description of changes to this file"),
      })
    )
    .describe(
      "Affected files (concise description of changes to important files)"
    ),
});

export type CommitSummary = z.infer<typeof CommitSummary>;
