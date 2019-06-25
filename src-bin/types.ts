
export interface BundlibOptions {
  dev?: boolean;
  watch?: boolean;
}

export interface BuildCallbackObject {
  start?: () => void;
  end?: () => void;
  buildStart?: (filename: string) => void;
  buildEnd?: (writeInfo: { filename: string, duration: number, size: number }) => void;
  error?: (error: Error) => void;
}
