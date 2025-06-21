/**
 * Clamps a number between a minimum and maximum value.
 * @param val Value to clamp
 * @param min Bottom limit
 * @param max Top limit
 * @returns Clamped value between min and max
 */
export function clamp(val: number, min: number, max: number): number {
  return val > max ? max : val < min ? min : val;
}
