import { google } from "@ai-sdk/google";
import { generateObject, GenerateObjectResult } from "ai";
import { readFileSync } from "fs";
import { join } from "path";
import {
  DefaultLogFields,
  DiffNameStatus,
  DiffResultTextFile,
  GitError,
  GitResponseError,
  LogResult,
  simpleGit,
} from "simple-git";
import {
  CommitSummary,
  GitCommitFileDiff,
  GitCommitWithDiffs,
} from "../models";

export const getGitCommits = async (
  fromDate: string,
  toDate: string,
  repository?: string
): Promise<LogResult<DefaultLogFields>> => {
  try {
    const git = simpleGit(repository || process.cwd());
    const isRepo = await git.checkIsRepo();

    if (!isRepo) {
      throw new Error("Current directory is not a git repository");
    }

    return await git.log({
      "--since": fromDate,
      "--until": toDate,
      "--date": "iso",
    });
  } catch (error) {
    if (error instanceof GitError) {
      throw new Error(`Git command failed: ${error.message}`);
    }

    if (error instanceof Error) {
      if (
        error.message.includes("not a git repository") ||
        error.message.includes("not inside a work tree")
      ) {
        throw new Error("Current directory is not a git repository");
      }
      throw new Error(`Git command failed: ${error.message}`);
    }

    throw error;
  }
};

export const getCommitWithDiffs = async (
  commitHash: string,
  repository?: string
): Promise<GitCommitWithDiffs> => {
  try {
    const git = simpleGit(repository || process.cwd());

    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      throw new Error("Current directory is not a git repository");
    }

    const commitInfo = await git.log(["-1", commitHash]);
    const commitData = commitInfo.latest;

    if (!commitData) {
      throw new Error(`Commit ${commitHash} not found`);
    }

    let isInitialCommit = false;

    try {
      await git.raw(["rev-parse", `${commitHash}^`]);
    } catch (error) {
      if (error instanceof GitError) {
        isInitialCommit = true;
      } else {
        throw error;
      }
    }

    const diffSummary = isInitialCommit
      ? await git.diffSummary(["--root", commitHash])
      : await git.diffSummary([`${commitHash}^`, commitHash]);

    const diffs: GitCommitFileDiff[] = [];

    const getFileDiff = (fileName: string) =>
      isInitialCommit
        ? git.show([commitHash, "--", fileName])
        : git.diff([`${commitHash}^`, commitHash, "--", fileName]);

    const getFileStatus = (file: any): DiffNameStatus => {
      if (isInitialCommit) return DiffNameStatus.ADDED;

      if ("insertions" in file && "deletions" in file) {
        const { insertions, deletions } = file as DiffResultTextFile;
        if (insertions > 0 && deletions === 0) return DiffNameStatus.ADDED;
        if (insertions === 0 && deletions > 0) return DiffNameStatus.DELETED;
      }
      return DiffNameStatus.MODIFIED;
    };

    for (const file of diffSummary.files) {
      try {
        const [fileDiff, status] = await Promise.all([
          getFileDiff(file.file),
          Promise.resolve(getFileStatus(file)),
        ]);

        diffs.push({
          filePath: file.file,
          status,
          diff: fileDiff,
        });
      } catch (error) {
        const message =
          error instanceof GitError
            ? `Failed to get diff for file ${file.file}: ${error.message}`
            : `Failed to get diff for file ${file.file}`;
        throw new Error(message);
      }
    }

    return {
      commitHash,
      commitMessage: commitData.message,
      author: commitData.author_name,
      date: commitData.date,
      diffs,
    };
  } catch (error) {
    if (error instanceof GitError) {
      throw new Error(`Git command failed: ${error.message}`);
    }
    if (error instanceof GitResponseError) {
      throw new Error(`Git response error: ${error.message}`);
    }
    if (error instanceof Error) {
      throw new Error(`Failed to get commit diffs: ${error.message}`);
    }
    throw error;
  }
};

export const summarizeCommit = async (
  commit: GitCommitWithDiffs,
  language: "ja" | "en" | "cn" = "ja"
): Promise<GenerateObjectResult<CommitSummary>> => {
  const structuredData = {
    hash: commit.commitHash,
    message: commit.commitMessage,
    author: commit.author,
    date: commit.date,
    diffs: commit.diffs,
  };

  const data = JSON.stringify(structuredData, null);

  const prompt = readFileSync(
    join(__dirname, "..", "prompts", `${language}.md`),
    "utf8"
  );

  const result = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: CommitSummary,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "text", text: data },
        ],
      },
    ],
  });

  return result;
};
