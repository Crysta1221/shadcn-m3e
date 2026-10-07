import * as React from "react"

/**
 * Renders a prose string with `` `code` `` spans as <code>. Unmatched
 * backticks are left as plain text.
 */
function InlineText({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  const re = /`([^`]+)`/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(<code key={key++}>{m[1]}</code>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

export { InlineText }
