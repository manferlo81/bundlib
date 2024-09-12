import { extname } from 'node:path';
import { TS_ONLY_EXTENSIONS } from '../constants/extensions';

type Extension<E extends string> = `.${E}`;
type ListExtensionType<T extends ReadonlyArray<Extension<string>>> = T[number];
type FilenameWithExt<E extends Extension<string>> = `${string}${E}`;

export function fileExtensionMatch<E extends ReadonlyArray<Extension<string>>>(filename: string, extensions: E): filename is FilenameWithExt<ListExtensionType<E>> {
  // convert extensions to lowercase
  const lowercasedExtensions = extensions.map((ext) => ext.toLowerCase());

  // get lowercased file extension
  const lowercasedFileExt = extname(filename).toLowerCase();

  // return whether or not extensions contain file extension
  return lowercasedExtensions.includes(lowercasedFileExt);
}

type TypescriptExtensionList = typeof TS_ONLY_EXTENSIONS;
type TypescriptExtension = ListExtensionType<TypescriptExtensionList>;

export function fileIsTypescript(filename: string): filename is FilenameWithExt<TypescriptExtension> {
  // return whether or not filename is a typescript file
  return fileExtensionMatch(filename, TS_ONLY_EXTENSIONS);
}
