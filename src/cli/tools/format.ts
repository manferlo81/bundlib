import { createFormatter } from 'gen-unit';

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

export const formatSeconds = createFormatter({
  unit: 's',
  round: 2,
  find: [
    { exp: -1, pre: 'm' },
    { exp: 0, pre: '' },
  ],
  output: { space: 0 },
});

function formatMinutes(minutes: number) {
  const min = Math.floor(minutes);
  const sec = Math.round((minutes - min) * 60);
  if (!sec) return `${min}m`;
  return `${min}m ${sec}s`;
}

export function formatMS(milliseconds: number): string {
  if (milliseconds < 60000) return formatSeconds(milliseconds / 1000);
  return formatMinutes(milliseconds / 60000);
}
