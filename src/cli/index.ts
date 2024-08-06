#!/usr/bin/env node

import { action } from './action';
import { handleCLI } from './command/handle-cli-args';

handleCLI(action);
