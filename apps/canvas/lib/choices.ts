/** The inspector's content width: a 320px panel, 12px of padding on each side,
 *  and a little room for the scrollbar. Choice labels are measured against this,
 *  not against the window. */
const ROW = 280;
const GAP = 3;
/** horizontal padding of a segmented cell that carries a word (`0 14px`) */
const PAD = 28;

/** Approximate width of a label at the segmented control's 13px size.
 *  CJK and other full-width letters take an em; Latin is narrower. */
function textWidth(label: string): number {
  let w = 0;
  for (const ch of label) {
    const code = ch.codePointAt(0) ?? 0;
    w += code > 0xff ? 13 : 7.5;
  }
  return w;
}

/** Whether these labels still read when the inspector lays them out side by side.
 *  A segmented cell grows to an equal share of the row, so the longest label has
 *  to fit that share. More than three choices, or a style name like 塗りつぶし,
 *  would be clipped — those belong in a select. Two or three short words
 *  (横 / 縦, 狭い / 広い) stay a segmented control. */
export function segmentedFits(labels: string[]): boolean {
  if (labels.length === 1) return true;
  if (labels.length < 2 || labels.length > 3) return false;
  const cell = (ROW - (labels.length - 1) * GAP) / labels.length - PAD;
  return labels.every((label) => textWidth(label) <= cell);
}
