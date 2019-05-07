import ora, { Color, Ora } from "ora";
import { relative } from "path";

export function spinner(text: string, color: Color = "white") {

  return ora({ text, color }).start();

}

export function buildSpinner(filename: string, cwd: string): Ora {

  const relativeFilename = relative(cwd, filename);

  return spinner(
    relativeFilename,
    "cyan",
  );

}
