import type { ViewTransitionProps } from "react";

/**
 * Page-level view transition props. A navigation tagged "sheet" lays the new
 * page over the old like a drawing sheet; "morph" leaves the page itself
 * still so a shared photograph can carry the eye across.
 */
export const SHEET_ENTER: Pick<ViewTransitionProps, "enter" | "exit" | "default"> = {
  enter: { sheet: "sheet", default: "none" },
  exit: { sheet: "sheet", default: "none" },
  default: "none",
};
