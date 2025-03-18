import { ZodError } from "zod";

export function formatZodErrors(error: ZodError) {
  const formattedErrors: Record<string, string> = {};

  error.errors.forEach((err) => {
    // Handle array fields by converting path like items.0.name to items[0].name
    const path = err.path
      .map((p, i) => {
        if (typeof p === "number" && i > 0) {
          return `[${p}]`;
        }
        return p;
      })
      .join(".");

    formattedErrors[path] = err.message;
  });

  return formattedErrors;
}

export type ValidationErrors = ReturnType<typeof formatZodErrors>;
