export function calculateScrollTop(
  startY: number,
  currentY: number,
  startScrollTop: number,
): number {
  return startScrollTop - (currentY - startY);
}
