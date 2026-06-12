/** Remove null/undefined and empty strings from nested objects for valid JSON-LD. */
export function compactObject(value) {
  if (Array.isArray(value)) {
    return value.map(compactObject).filter((item) => item != null && item !== '');
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, val]) => {
      const next = compactObject(val);
      if (next === undefined || next === null || next === '') return acc;
      if (Array.isArray(next) && next.length === 0) return acc;
      if (typeof next === 'object' && !Array.isArray(next) && Object.keys(next).length === 0) {
        return acc;
      }
      acc[key] = next;
      return acc;
    }, {});
  }
  return value;
}

export function withSchemaContext(payload) {
  return compactObject({
    '@context': 'https://schema.org',
    ...payload,
  });
}
