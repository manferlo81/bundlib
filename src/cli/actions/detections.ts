import type { PkgAnalyzed } from '../../api';
import { green } from '../tools/colors';
import { binaryPlugins, bublePlugin, optionalPlugins } from './optional-modules';

function createDetectionMessage(what: string, detected: boolean, using: string) {
  const detectedString = detected ? 'detected' : 'not detected';
  return `${what} ${detectedString}, using ${using}`;
}

function createPluginDetectionMessage(moduleName: string, detected: boolean, pluginName: string) {
  const formattedModuleName = green.bold(moduleName);
  const formattedPluginName = green.bold(pluginName);
  return createDetectionMessage(formattedModuleName, detected, `plugin ${formattedPluginName}`);
}

export function getDetections(analyzed: PkgAnalyzed, watchMode?: boolean): string[] {

  const { installed: { babel, eslint, chokidar: chokidarInstalled, typescript }, bin: buildingBinary } = analyzed;
  const usingChokidar = watchMode && chokidarInstalled;

  const bublePluginMessage = !babel && createPluginDetectionMessage('@babel/core', false, bublePlugin);

  const pluginMessages = [babel, eslint, typescript].map((installed) => {
    if (!installed) return;
    const { id } = installed;
    const plugin = optionalPlugins[id];
    return createPluginDetectionMessage(id, true, plugin);
  });

  const binaryPluginsMessage = buildingBinary && createDetectionMessage(`${green.bold('Binary')} build`, true, `plugin ${binaryPlugins.map((name) => green.bold(name)).join(' and ')}`);
  const chokidarMessage = usingChokidar && createDetectionMessage(green.bold(usingChokidar.id), true, 'it to watch for file change');

  const detections = [
    bublePluginMessage,
    ...pluginMessages,
    binaryPluginsMessage,
    chokidarMessage,
  ];

  return detections.filter<string>(Boolean as unknown as <T>(value: T) => value is Exclude<T, null | undefined | false | ''>);

}
