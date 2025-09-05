#!/usr/bin/env node

import { action } from './action';
import { handleCLI } from './command/handle-cli-args';

void handleCLI(process.argv.slice(2), action);
