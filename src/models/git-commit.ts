import { DiffNameStatus } from "simple-git";
import z from "zod";

export const GitCommitFileDiff = z.object({
  filePath: z.string(),
  status: z.nativeEnum(DiffNameStatus),
  diff: z.string().optional(),
});

export const GitCommitWithDiffs = z.object({
  commitHash: z.string(),
  commitMessage: z.string(),
  author: z.string(),
  date: z.string(),
  diffs: z.array(GitCommitFileDiff),
});

export type GitCommitFileDiff = z.infer<typeof GitCommitFileDiff>;
export type GitCommitWithDiffs = z.infer<typeof GitCommitWithDiffs>;
