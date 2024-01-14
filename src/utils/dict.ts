import { getRandomElement } from './array';

export function getRandomKey(
  dict: Record<string | number | symbol, unknown>,
): string | number | symbol {
  return getRandomElement(Object.keys(dict));
}

export function getRandomValue<T>(
  dict: Record<string | number | symbol, T>,
): T {
  return dict[getRandomElement(Object.keys(dict))];
}
