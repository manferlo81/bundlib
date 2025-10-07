#!/usr/bin/env node

import { action } from './actions/action'
import { createActionContext } from './actions/context'
import { handleCLI } from './command/handle-cli-args'

const actionContext = createActionContext()
void handleCLI(process.argv.slice(2), action, actionContext)
