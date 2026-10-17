/**
 * Helpers for reading home-block field values as the backend may send them.
 *
 * Dropdown (`items`) values arrive either as a scalar, as `{ value | key | id }`,
 * or wrapped in an array; `selected` product pickers may also be wrapped in
 * `{ source_value: [...] }`. Shared by the Brutal home blocks.
 */

export function scalar(value: unknown): string {
  if (Array.isArray(value)) return scalar(value[0]);
  if (value && typeof value === 'object') {
    const o = value as { value?: unknown; key?: unknown; id?: unknown };
    return scalar(o.value ?? o.key ?? o.id);
  }
  return value === null || value === undefined ? '' : String(value);
}

export function toIds(value: unknown): number[] {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'source_value' in value) {
    return toIds((value as { source_value?: unknown }).source_value);
  }
  return (Array.isArray(value) ? value : value === null || value === undefined || value === '' ? [] : [value])
    .map((x) => Number(scalar(x)))
    .filter((id) => Number.isFinite(id) && id > 0);
}

/** First id of a single-product picker, or `null`. */
export function firstId(value: unknown): number | null {
  return toIds(value)[0] ?? null;
}
