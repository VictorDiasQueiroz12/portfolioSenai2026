export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path = '') => base + '/' + path.replace(/^\//, '');
export const optimized = (path: string) =>
  url(
    'optimized/' +
      path
        .split('/')
        .pop()!
        .replace(/\.[^.]+$/, '.webp'),
  );
