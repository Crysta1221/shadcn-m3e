/* The shadcn M3E components by name. `FILE_OF` (which module each name comes from) is generated
 * from the source and light; `COMPONENTS` loads the components themselves and is only needed
 * where a part is drawn. */
import type { ComponentType } from "react";
import { MODULES } from "./components.generated";
import * as recharts from "recharts";
import { Contained } from "./contained";
import { SnackbarPreview } from "./snackbar";
import { EXTERNAL } from "./externals";
import { FILE_OF } from "./files.generated";

export { FILE_OF };

type AnyComponent = ComponentType<Record<string, unknown>>;

export const COMPONENTS: Record<string, AnyComponent> = {};
for (const [name, file] of Object.entries(FILE_OF)) {
  const value = MODULES[file]?.[name];
  if ((typeof value === "function" || typeof value === "object") && value !== null) COMPONENTS[name] = value as AnyComponent;
}
/* drawn on the canvas only, never printed */
COMPONENTS.Contained = Contained as AnyComponent;
COMPONENTS.SnackbarPreview = SnackbarPreview as AnyComponent;
for (const name of Object.keys(EXTERNAL)) COMPONENTS[name] = (recharts as unknown as Record<string, AnyComponent>)[name];
