#!/usr/bin/env node

import { action } from './action';
import { handleCLI } from './command/handle-cli-args';
import { consoleLog, consoleWarn } from './tools/console';

void handleCLI(process.argv.slice(2), action, consoleLog, consoleWarn);
