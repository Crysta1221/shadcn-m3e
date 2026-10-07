/**
 * Renders a prose string with `` `code` `` spans as <code>. Unmatched
 * backticks are left as plain text.
 */
function InlineText({ text }: { text: string }) {
  // The capturing group keeps the code spans in the result, at odd indices.
  return text
    .split(/`([^`]+)`/)
    .map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))
}

export { InlineText }
