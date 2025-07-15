#!/usr/bin/env node

import { LanguageModelUsage } from "ai";
import { Command } from "commander";
import { endOfDay, startOfDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { writeFileSync } from "fs";
import ora from "ora";
import { AppOption } from "./models";
import { getSystemTimezone } from "./utils/date";
import {
  getCommitWithDiffs,
  getGitCommits,
  summarizeCommit,
} from "./utils/git";

const program = new Command();

program.version("0.0.1");
program.description("Awesome Git Report");
program.helpOption("-h, --help", "show help for command");

program.option(
  "-f, --from-date <from-date>",
  "from date (YYYY-MM-DD) ISO 8601 format"
);
program.option(
  "-t, --to-date <to-date>",
  "to date (YYYY-MM-DD) ISO 8601 format"
);
program.option(
  "-z, --timezone <timezone>",
  "timezone (e.g., Asia/Tokyo, UTC, America/New_York). If not specified, uses system timezone.",
  getSystemTimezone()
);
program.option(
  "-r, --repository <repository>",
  "path to git repository directory. If not specified, uses current directory."
);
program.option(
  "-o, --output <output>",
  "output file path for the summarized report (Markdown format). If not specified, outputs to console only.",
  "report.md"
);
program.option(
  "-l, --language <language>",
  "language for commit summary generation (ja, en, cn). If not specified, uses Japanese.",
  "ja"
);

program.parse();

(async () => {
  try {
    const options = program.opts();
    const parsed = AppOption.safeParse(options);

    if (!parsed.success) {
      console.error("Validation errors:");
      parsed.error.issues.forEach((issue) => {
        console.error(`- ${issue.path.join(".")}: ${issue.message}`);
      });
      process.exit(1);
    }

    const { fromDate, toDate, timezone, repository, language } = parsed.data;
    const outputPath = options.output;

    const fromDateISO = formatInTimeZone(
      startOfDay(fromDate),
      timezone,
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    );

    const toDateISO = formatInTimeZone(
      endOfDay(toDate),
      timezone,
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    );

    /********************************
     * Display options
     ********************************/

    console.log("--------------------------------");
    console.log("timezone:", timezone);
    console.log("fromDate:", fromDateISO);
    console.log("toDate:", toDateISO);
    console.log("language:", language);
    repository && console.log("repository:", repository);
    outputPath && console.log("output:", outputPath);
    console.log("--------------------------------");

    try {
      const commits = await getGitCommits(fromDateISO, toDateISO, repository);

      if (commits.all.length === 0) {
        console.log("No commits found in the specified date range.");
        return process.exit(0);
      }

      console.log(`Found ${commits.all.length} commit(s):`);
      console.log("--------------------------------");

      const lines = [
        "# Git Commit Report",
        "",
        `** FromDate - ToDate **: ${fromDateISO} - ${toDateISO}`,
        `** Timezone **: ${timezone}`,
        `** Total Commit Count **: ${commits.all.length}`,
        `** Repository **: ${repository}`,
        "",
        "## Commits",
        "",
      ];

      const usages: LanguageModelUsage[] = [];

      const spinner = ora("Generating report...").start();
      for (const [index, commit] of commits.all.entries()) {
        spinner.text = `Processing commit: ${index + 1}/${commits.all.length}`;

        const commitDetail = await getCommitWithDiffs(commit.hash, repository);
        const { object: summary, usage } = await summarizeCommit(
          commitDetail,
          language
        );

        usages.push(usage);
        lines.push(
          `### ${commitDetail.commitHash} - ${summary.changeOverview}`,
          "",
          `** Commit Message **: ${commitDetail.commitMessage}`,
          `** Author **: ${commitDetail.author}`,
          `** Date **: ${commitDetail.date}`,
          "",
          `#### Change overview`,
          summary.changeOverview,
          "",
          "#### Main changes",
          summary.mainChanges.join("\n"),
          "",
          "#### Affected files",
          summary.affectedFiles.map((file) => `- ${file.filePath}`).join("\n"),
          "",
          "---",
          ""
        );
      }

      const totalUsage = usages.reduce(
        (acc, usage) => {
          return {
            promptTokens: acc.promptTokens + usage.promptTokens,
            completionTokens: acc.completionTokens + usage.completionTokens,
          };
        },
        { promptTokens: 0, completionTokens: 0 }
      );

      writeFileSync(outputPath, lines.join("\n"), "utf8");
      spinner.succeed("Report generated successfully");
      console.log("Total usage:", totalUsage);
    } catch (gitError) {
      console.error(
        "Git error:",
        gitError instanceof Error ? gitError.message : gitError
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    process.exit(1);
  }
})();
