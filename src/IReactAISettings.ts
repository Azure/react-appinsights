// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { History } from "history";

/**
 * Settings to initialize a ReactAI instance.
 *
 * @export
 * @interface IReactAISettings
 */
export default interface IReactAISettings {

  /**
   * Context/custom dimensions for initialization.
   * You can also do this post initialization using ReactAI.setContext()
   *
   * @type {{ [key: string]: any }}
   * @memberof IReactAISettings
   */
  initialContext?: { [key: string]: any };

  /**
   * React router history for enabling Application Insights PageView tracking.
   *
   * @type {History}
   * @memberof IReactAISettings
   */
  history?: History;

  /**
   * Debug mode.
   * Enable this when developing to see debug messages from the library displayed on the console.
   *
   * @type {boolean}
   * @memberof IReactAISettings
   */
  debug?: boolean;
}
