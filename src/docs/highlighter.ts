/**
 * Syntax highlighting with TanStack Highlight: synchronous, and each token only
 * carries a class (`th-keyword`, …). `src/styles/m3e.css` maps those classes to
 * M3 color roles, so code follows the active color scheme (light, dark, any
 * seed). Only the languages the docs use are registered.
 */
import {
  createHighlighter,
  type HighlightToken,
} from "@tanstack/highlight/core"
import { css } from "@tanstack/highlight/languages/css"
import { json } from "@tanstack/highlight/languages/json"
import { plaintext } from "@tanstack/highlight/languages/plaintext"
import { shell } from "@tanstack/highlight/languages/shell"
import { tsx } from "@tanstack/highlight/languages/tsx"

export type CodeLang = "tsx" | "css" | "bash" | "json" | "text"
export type { HighlightToken }

const highlighter = createHighlighter({
  languages: [css, json, plaintext, shell, tsx],
  fallbackLanguage: "plaintext",
})

const LANG: Record<CodeLang, string> = {
  tsx: "tsx",
  css: "css",
  bash: "shell",
  json: "json",
  text: "plaintext",
}

const cache = new Map<string, HighlightToken[]>()

/** the tokens of a snippet; newlines stay inside the token values */
export function tokenize(code: string, lang: CodeLang): HighlightToken[] {
  const key = `${lang}\0${code}`
  let tokens = cache.get(key)
  if (!tokens) {
    tokens = highlighter.tokenize(code, { lang: LANG[lang] }).tokens
    cache.set(key, tokens)
  }
  return tokens
}
