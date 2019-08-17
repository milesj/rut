export function formatValue(value: unknown): string {
  const typeOf = typeof value;

  if (typeOf === 'string') {
    return `"${value}"`;
  } else if (typeOf === 'number' || typeOf === 'boolean') {
    return String(value);
  }

  return `\`${String(value)}\``;
}
