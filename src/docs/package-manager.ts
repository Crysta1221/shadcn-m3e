import * as React from "react"

import { SITE_ORIGIN } from "./site"

export const PACKAGE_MANAGERS = ["npm", "pnpm", "bun", "yarn"] as const
export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

const KEY = "docs-package-manager"
const listeners = new Set<() => void>()

export const isPackageManager = (v: unknown): v is PackageManager =>
  typeof v === "string" && PACKAGE_MANAGERS.some((p) => p === v)

function read(): PackageManager {
  try {
    const v = localStorage.getItem(KEY)
    if (isPackageManager(v)) return v
  } catch {
    // storage is blocked: use the default
  }
  return "npm"
}

let current: PackageManager | null = null

/** the package manager the reader picked, shared by every command on the site */
export function usePackageManager() {
  const value = React.useSyncExternalStore<PackageManager>(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => (current ??= read()),
    () => "npm"
  )
  const set = React.useCallback((next: PackageManager) => {
    current = next
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // still applies for this visit
    }
    listeners.forEach((l) => l())
  }, [])
  return [value, set] as const
}

/** `npx …` written for a package manager */
export function withRunner(pm: PackageManager, command: string) {
  const runner = {
    npm: "npx",
    pnpm: "pnpm dlx",
    bun: "bunx --bun",
    yarn: "yarn dlx",
  }[pm]
  return command.replace(/^npx /gm, runner + " ")
}

/** `shadcn add …` for a package manager */
export function addCommand(pm: PackageManager, items: string[]) {
  return withRunner(pm, `npx shadcn@latest add ${items.join(" ")}`)
}

/** the URL of the hosted registry, for components.json */
export function registryUrl() {
  return `${SITE_ORIGIN}/r/{name}.json`
}
