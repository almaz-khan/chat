export function toPusherKey(key: string): string {
  return key.replace(/:/g, "__");
}
