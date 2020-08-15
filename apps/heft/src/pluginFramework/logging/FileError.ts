// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

export const enum FileErrorFormat {
  Unix,
  VisualStudio
}

const CLASS_ID: string = 'bab8800e-d52b-4e83-9379-8123be97d83d';

/**
 * An `Error` subclass that should be thrown to report an unexpected state that specifically references
 * a location in a file.
 *
 * @public
 */
export class FileError extends Error {
  /**
   * Use this instance property to reliably detect if an instance of a class is an instance of FileError
   */
  private readonly _classId: string = CLASS_ID;
  public readonly filePath: string;
  public readonly line: number;
  public readonly column: number | undefined;

  /**
   * Constructs a new instance of the {@link FileError} class.
   *
   * @param message - A message describing the error.
   */
  public constructor(message: string, filePath: string, line: number, column?: number) {
    super(message);

    this.filePath = filePath.replace(/\\/g, '/');
    this.line = line;
    this.column = column;

    // Manually set the prototype, as we can no longer extend built-in classes like Error, Array, Map, etc.
    // https://github.com/microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    //
    // Note: the prototype must also be set on any classes which extend this one
    (this as any).__proto__ = FileError.prototype; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  public static [Symbol.hasInstance](obj: FileError | undefined): boolean {
    return obj?._classId === CLASS_ID;
  }

  /** @override */
  public toString(format: FileErrorFormat = FileErrorFormat.Unix): string {
    let formattedFileLocation: string;
    switch (format) {
      case FileErrorFormat.Unix: {
        if (this.column !== undefined) {
          formattedFileLocation = `:${this.line}:${this.column}`;
        } else {
          formattedFileLocation = `:${this.line}`;
        }

        break;
      }

      case FileErrorFormat.VisualStudio: {
        if (this.column !== undefined) {
          formattedFileLocation = `(${this.line},${this.column})`;
        } else {
          formattedFileLocation = `(${this.line})`;
        }

        break;
      }

      default: {
        throw new Error(`Unknown format: ${format}`);
      }
    }

    return `${this.filePath}${formattedFileLocation} - ${this.message}`;
  }
}