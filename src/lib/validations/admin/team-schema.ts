import { z } from "zod";

// Accepts strings (from FormData) but converts to array of strings
export const CreateTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional().nullable(),
  member_ids: z.preprocess(
    (value) => {
      if (value == undefined) return [];
      if (typeof value === "string") return [value]; // single value from combo
      if (Array.isArray(value)) return value;
      return [];
    },
    z.array(z.string()).min(1, "You must assign at least one member to the team"),
  ),
});

export const EditTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional().nullable(),
  member_ids: z.preprocess(
    (value) => {
      if (value == undefined) return [];
      if (typeof value === "string") return [value]; // single value from combo
      if (Array.isArray(value)) return value;
      return [];
    },
    z.array(z.string()).min(1, "You must assign at least one member to the team"),
  ),
});

export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type UpdateTeamInput = z.infer<typeof EditTeamSchema>;
