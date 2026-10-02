import * as React from "react"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { ScrollArea } from "@/components/m3e/scroll-area"
import { cn } from "@/lib/utils"

import { tokenize, type CodeLang, type HighlightToken } from "./highlighter"

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

function Highlighted({ tokens }: { tokens: HighlightToken[] }) {
  return tokens.map((t, i) =>
    t.className ? (
      <span key={i} className={`th-${t.className}`}>
        {t.value}
      </span>
    ) : (
      t.value
    )
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
  const tokens = React.useMemo(() => tokenize(text, lang), [text, lang])

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
          <code>
            <Highlighted tokens={tokens} />
          </code>
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
