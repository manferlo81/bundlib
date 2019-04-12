import { Plugin } from "rollup";
import ts from "rollup-plugin-typescript2";
import typescript from "typescript";

interface TranspileOptions {
  cacheRoot: string;
  sourcemap: boolean;
  types?: string | null | false | void;
}

const transpile = ({ cacheRoot, sourcemap, types }: TranspileOptions): Plugin => ts({
  typescript,
  cacheRoot,
  useTsconfigDeclarationDir: true,
  tsconfigDefaults: {
    compilerOptions: {
      moduleResolution: "node",
      esModuleInterop: true,
    },
    include: [
      "src/**/*.*",
    ],
  },
  tsconfigOverride: {
    compilerOptions: {
      target: "esnext",
      module: "esnext",
      sourceMap: sourcemap,
      declaration: !!types,
      declarationDir: !!types ? types : null,
    },
  },
}) as Plugin;

export default transpile;
