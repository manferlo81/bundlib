type GetDurationFunction = () => number

export function startTimer(): GetDurationFunction {
  const startedAt = Date.now()
  return () => {
    return Date.now() - startedAt
  }
}
