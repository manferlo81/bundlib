import ora, { Options as OraOptions, Ora } from "ora";
import { relative } from "path";

interface SpinnerResolve {
  (err?: Error | null, message?: string): Ora;
  ora: Ora;
}

export function spinner(options: OraOptions | string): SpinnerResolve {

  const instance = ora(options).start();

  const handler: SpinnerResolve = (err?, message?) => {
    return err ? instance.fail(err.message || (err.toString && err.toString())) : instance.succeed(message);
  };

  handler.ora = instance;

  return handler;

}

export function buildSpinner(filename: string, cwd: string): SpinnerResolve {

  const relativeFilename = relative(cwd, filename);

  return spinner({
    text: relativeFilename,
    color: "cyan",
  });

}
