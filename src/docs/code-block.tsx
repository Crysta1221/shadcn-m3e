import * as React from "react"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { ScrollArea } from "@/components/m3e/scroll-area"
import { cn } from "@/lib/utils"

import { peek, tokenize, type CodeLang, type ThemedToken } from "./highlighter"

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn("text-on-surface-variant", className)}
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      <Icon name={copied ? "check" : "content_copy"} size={18} />
    </Button>
  )
}

/** Shiki font style flags: 1 italic, 2 bold, 4 underline */
function tokenStyle(t: ThemedToken): React.CSSProperties {
  const s = t.fontStyle ?? 0
  return {
    color: t.color,
    fontStyle: s & 1 ? "italic" : undefined,
    fontWeight: s & 2 ? 600 : undefined,
    textDecoration: s & 4 ? "underline" : undefined,
  }
}

function Highlighted({ tokens }: { tokens: ThemedToken[][] }) {
  return (
    <>
      {tokens.map((line, i) => (
        <React.Fragment key={i}>
          {line.map((t, j) => (
            <span key={j} style={tokenStyle(t)}>
              {t.content}
            </span>
          ))}
          {i < tokens.length - 1 && "\n"}
        </React.Fragment>
      ))}
    </>
  )
}

function CodeBlock({
  code,
  lang = "tsx",
  className,
  copy = true,
  maxHeight,
}: {
  code: string
  lang?: CodeLang
  className?: string
  copy?: boolean
  /** cap the height and scroll vertically, e.g. "18rem" */
  maxHeight?: string
}) {
  const text = code.replace(/\n+$/, "")
  const [tokens, setTokens] = React.useState(() => peek(text, lang))

  React.useEffect(() => {
    let alive = true
    tokenize(text, lang).then(
      (t) => alive && setTokens(t),
      () => {} // fall back to plain text
    )
    return () => {
      alive = false
    }
  }, [text, lang])

  return (
    <div
      data-slot="code-block"
      data-lang={lang}
      className={cn(
        "relative rounded-md bg-surface-container-highest text-on-surface",
        className
      )}
    >
      <ScrollArea
        scrollbars={maxHeight ? "both" : "horizontal"}
        className={cn(
          "rounded-[inherit]",
          maxHeight &&
            "[&>[data-slot=scroll-area-viewport]]:max-h-(--code-max-h)"
        )}
        style={maxHeight ? { "--code-max-h": maxHeight } : undefined}
      >
        <pre className="w-max min-w-full p-4 pr-12 font-mono text-body-small leading-relaxed">
          <code>{tokens ? <Highlighted tokens={tokens} /> : text}</code>
        </pre>
      </ScrollArea>
      {copy && (
        <CopyButton
          text={text}
          className="absolute top-2 right-2 bg-surface-container-highest"
        />
      )}
    </div>
  )
}

export { CodeBlock, CopyButton }
