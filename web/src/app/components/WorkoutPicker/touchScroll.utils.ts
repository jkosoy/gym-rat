export function calculateScrollLeft(
  startX: number,
  currentX: number,
  startScrollLeft: number,
): number {
  return startScrollLeft - (currentX - startX);
}
