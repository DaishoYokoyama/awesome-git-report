import { existsSync, statSync } from "fs";
import z from "zod";
import { isValidTimezone } from "../utils/date";

export const AppOption = z
  .object({
    fromDate: z.string().date(),
    toDate: z.string().date(),
    timezone: z
      .string()
      .refine((tz) => isValidTimezone(tz), { message: "Invalid timezone" }),
    repository: z
      .string()
      .optional()
      .refine(
        (path) => {
          if (!path) return true;
          try {
            return existsSync(path) && statSync(path).isDirectory();
          } catch {
            return false;
          }
        },
        { message: "Repository path does not exist or is not a directory" }
      ),
    output: z.string(),
    language: z
      .enum(["ja", "en", "cn"])
      .default("ja")
      .describe("Language for commit summary generation"),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    message: "from-date must be before to-date",
  });

export type AppOption = z.infer<typeof AppOption>;
