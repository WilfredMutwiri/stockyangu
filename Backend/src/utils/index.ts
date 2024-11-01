const utFileUrlRegex = /^https:\/\/utfs\.io\/(?:a\/([^\/]+)\/|f\/)([^\/]+)$/;

function removeEmpty<T extends Record<string, unknown>>(
  obj: T
): Partial<{ [K in keyof T]: Exclude<T[K], null | undefined> }> {
  const result: Partial<{ [K in keyof T]: Exclude<T[K], null | undefined> }> =
    {};

  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined) {
      // @ts-expect-error
      result[key] = value;
    }
  }

  return result;
}

export { utFileUrlRegex, removeEmpty };
