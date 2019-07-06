
function setProp<T>(name: string, value: T, target: Record<string, T>): Record<string, T> {
  target[name] = value;
  return target;
}

export default setProp;
