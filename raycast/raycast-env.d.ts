/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Image Directory - Path to the directory containing images */
  "imageDirectory": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `browse-images` command */
  export type BrowseImages = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `browse-images` command */
  export type BrowseImages = {}
}

