const generate = () => ({
  output: [{ code: 'module.exports = 10' }],
})

export const rollup = (): unknown => ({ generate })
