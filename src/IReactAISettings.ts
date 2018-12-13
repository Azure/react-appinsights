// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { History } from "history";
export default interface IReactAISettings {
  instrumentationKey: string;
  initialContext?: { [key: string]: any };
  history?: History;
  debug?: boolean;
}
