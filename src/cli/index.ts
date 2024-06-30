#!/usr/bin/env node

import { displayName, version } from '../../package.json';
import { action } from './action';
import { handleCLI } from './command/handle-cli-args';

handleCLI(({ dev, watch, silent }) => {
  void action(displayName, version, !!dev, !!watch, !!silent);
});
