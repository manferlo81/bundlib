import { createFormatter } from 'gen-unit';
import prettyMs from 'pretty-ms';

export const formatFileSize = createFormatter({
  unit: 'B',
  round: 2,
  find: {
    base: 1024,
    find: [
      { exp: 0, pre: '' },
      { exp: 1, pre: 'K' },
      { exp: 2, pre: 'M' },
    ],
  },
});

export function formatMS(duration: number) {
  return prettyMs(duration, { secondsDecimalDigits: 2 });
}
