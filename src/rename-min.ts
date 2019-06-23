import renamePre from "./rename-pre";

function renameMin(filename: string): string {
  return renamePre(filename, "min");
}

export default renameMin;
