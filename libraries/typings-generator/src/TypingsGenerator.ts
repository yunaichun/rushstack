// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import {
  FileSystem,
  Terminal,
  ConsoleTerminalProvider,
  Path,
  NewlineKind
} from '@microsoft/node-core-library';
import * as glob from 'glob';
import * as path from 'path';
import { EOL } from 'os';
import * as chokidar from 'chokidar';

/**
 * @public
 */
export interface ITypingsGeneratorOptions<TTypingsResult = string> {
  srcFolder: string;
  fileExtensions: string[];
  generatedTsFolder: string;
  parseAndGenerateTypings: (fileContents: string, filePath: string) => TTypingsResult;
  terminal?: Terminal;
  filesToIgnore?: string[];
}

/**
 * This is a simple tool that generates .d.ts files for non-TS files.
 *
 * @public
 */
export class TypingsGenerator {
  protected _options: ITypingsGeneratorOptions;

  public constructor(options: ITypingsGeneratorOptions) {
    this._options = {
      ...options
    };

    if (!this._options.generatedTsFolder) {
      throw new Error('generatedTsFolder must be provided');
    }

    if (!this._options.srcFolder) {
      throw new Error('srcFolder must be provided');
    }

    if (Path.isUnder(this._options.srcFolder, this._options.generatedTsFolder)) {
      throw new Error('srcFolder must not be under generatedTsFolder');
    }

    if (Path.isUnder(this._options.generatedTsFolder, this._options.srcFolder)) {
      throw new Error('generatedTsFolder must not be under srcFolder');
    }

    if (!this._options.fileExtensions || this._options.fileExtensions.length === 0) {
      throw new Error('At least one file extension must be provided.');
    }

    if (!this._options.filesToIgnore) {
      this._options.filesToIgnore = [];
    }

    if (!this._options.terminal) {
      this._options.terminal = new Terminal(new ConsoleTerminalProvider({ verboseEnabled: true }));
    }

    this._options.fileExtensions = this._normalizeFileExtensions(this._options.fileExtensions);
  }

  public generateTypings(): void {
    FileSystem.ensureEmptyFolder(this._options.generatedTsFolder);

    const filesToIgnore: Set<string> = new Set<string>((this._options.filesToIgnore!).map((fileToIgnore) => {
      return path.resolve(this._options.srcFolder, fileToIgnore);
    }));

    const filePaths: string[] = glob.sync(
      path.join('**', `*+(${this._options.fileExtensions.join('|')})`),
      {
        cwd: this._options.srcFolder,
        absolute: true,
        nosort: true,
        nodir: true
      }
    );

    for (let filePath of filePaths) {
      filePath = path.resolve(this._options.srcFolder, filePath);

      if (filesToIgnore.has(filePath)) {
        continue;
      }

      this._parseFileAndGenerateTypings(filePath);
    }
  }

  public runWatcher(): void {
    FileSystem.ensureEmptyFolder(this._options.generatedTsFolder);

    const globBase: string = path.resolve(this._options.srcFolder, '**');

    const watcher: chokidar.FSWatcher = chokidar.watch(
      this._options.fileExtensions.map((fileExtension) => path.join(globBase, `*${fileExtension}`))
    );
    const boundGenerateTypingsFunction: (filePath: string) => void = this._parseFileAndGenerateTypings.bind(this);
    watcher.on('add', boundGenerateTypingsFunction);
    watcher.on('change', boundGenerateTypingsFunction);
    watcher.on('unlink', (filePath) => {
      const generatedTsFilePath: string = this._getTypingsFilePath(filePath);
      FileSystem.deleteFile(generatedTsFilePath);
    });
  }

  private _parseFileAndGenerateTypings(locFilePath: string): void {
    try {
      const fileContents: string = FileSystem.readFile(locFilePath);
      const typingsData: string = this._options.parseAndGenerateTypings(fileContents, locFilePath);
      const generatedTsFilePath: string = this._getTypingsFilePath(locFilePath);

      const prefixedTypingsData: string = [
        '// This file was generated by a tool. Modifying it will produce unexpected behavior',
        '',
        typingsData
      ].join(EOL);

      FileSystem.writeFile(
        generatedTsFilePath,
        prefixedTypingsData,
        { ensureFolderExists: true, convertLineEndings: NewlineKind.OsDefault }
      );

    } catch (e) {
      this._options.terminal!.writeError(
        `Error occurred parsing and generating typings for file "${locFilePath}": ${e}`
      );
    }
  }

  private _getTypingsFilePath(locFilePath: string): string {
    return path.resolve(
      this._options.generatedTsFolder,
      path.relative(this._options.srcFolder, `${locFilePath}.d.ts`)
    );
  }

  private _normalizeFileExtensions(fileExtensions: string[]): string[] {
    const result: string[] = [];
    for (const fileExtension of fileExtensions) {
      if (!fileExtension.startsWith('.')) {
        result.push(`.${fileExtension}`);
      } else {
        result.push(fileExtension);
      }
    }

    return result;
  }
}
