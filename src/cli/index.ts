#!/usr/bin/env node

import { displayName, version } from '../../package.json';
import { action } from './action';
import { handleCLI } from './command/handle-cli-args';

handleCLI((options) => {
  void action(displayName, version, options);
});
