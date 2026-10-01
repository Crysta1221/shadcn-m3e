import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { CodeBlock } from "@/docs/code-block"
import { Label } from "@/components/m3e/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/m3e/select"
import { Slider } from "@/components/m3e/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/m3e/toggle-group"
import { useM3Theme } from "@/components/m3e/m3-theme-provider"
import { useImageTheme } from "@/components/m3e/use-image-theme"
import { SAMPLE_IMAGES } from "@/docs/sample-images"
import {
  CONTRAST_LEVELS,
  SCHEME_VARIANTS,
  SPEC_VERSIONS,
  generateScheme,
  isContrastLevel,
  isOneOf,
  schemePalettes,
  themeCss,
  type SpecVersion,
} from "@/lib/m3e/color"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/theme")({ component: ThemePage })

const SPEC_NOTE: Record<SpecVersion, string> = {
  "2021": "Material You / Compose (default)",
  "2025": "Expressive 2025 spec",
}

const MOTION_SCHEMES = ["expressive", "standard"] as const

/** black or white, whichever reads better on this color */
function readableOn(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const y =
    0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)
  return y > 150 ? "#000" : "#fff"
}

function Panel({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-surface-container-low p-6",
        className
      )}
    >
      <h2 className="text-title-large text-on-surface">{title}</h2>
      {children}
    </section>
  )
}

function ThemePage() {
  const { theme, updateTheme, setSeedColor, resetTheme } = useM3Theme()
  const {
    applyImage,
    pickSwatch,
    swatches,
    preview,
    loading: busy,
    error,
  } = useImageTheme()

  const opts = {
    source: theme.source,
    variant: theme.variant,
    contrast: theme.contrast,
    spec: theme.spec,
  } as const
  const css = React.useMemo(
    () => themeCss(opts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme.source, theme.variant, theme.contrast, theme.spec]
  )
  const palettes = React.useMemo(
    () => schemePalettes(opts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme.source, theme.variant, theme.contrast, theme.spec]
  )
  const light = React.useMemo(
    () => generateScheme({ ...opts, dark: false }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme.source, theme.variant, theme.contrast, theme.spec]
  )
  const dark = React.useMemo(
    () => generateScheme({ ...opts, dark: true }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme.source, theme.variant, theme.contrast, theme.spec]
  )

  const ROLE_PAIRS = [
    ["primary", "on-primary"],
    ["primary-container", "on-primary-container"],
    ["secondary", "on-secondary"],
    ["secondary-container", "on-secondary-container"],
    ["tertiary", "on-tertiary"],
    ["tertiary-container", "on-tertiary-container"],
    ["error", "on-error"],
    ["surface-container", "on-surface"],
  ] as const

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2 py-6">
        <h1 className="text-display-small-emphasized text-on-surface">Theme</h1>
        <p className="text-body-large text-on-surface-variant">
          Build a Material 3 Expressive color scheme from a color or from an
          image (colors are picked with Vibrant), and copy the CSS.
        </p>
      </header>

      <Panel title="Source">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Label htmlFor="seed">Seed color</Label>
            <div className="flex items-center gap-3">
              <input
                id="seed"
                type="color"
                value={theme.source.primary}
                onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
                className="size-14 cursor-pointer rounded-md border border-outline bg-transparent p-1"
              />
              <code className="text-body-large text-on-surface-variant">
                {theme.source.primary}
              </code>
            </div>
            <p className="text-body-small text-on-surface-variant">
              Pick a single color, or extract from an image →
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="image">From an image</Label>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="tonal"
                render={
                  <label htmlFor="image">
                    <Icon name="upload" size={20} />
                    Choose image
                  </label>
                }
                nativeButton={false}
              />
              <input
                id="image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void applyImage(f)
                }}
              />
              {SAMPLE_IMAGES.map((s) => (
                <Button
                  key={s.name}
                  variant="outlined"
                  size="sm"
                  onClick={() => void applyImage(s.src)}
                >
                  {s.name}
                </Button>
              ))}
            </div>
            {busy && (
              <p className="text-body-small text-on-surface-variant">
                Reading colors…
              </p>
            )}
            {error && <p className="text-body-small text-error">{error}</p>}
          </div>
        </div>

        {preview && (
          <div className="flex flex-col gap-4 sm:flex-row">
            <img
              src={preview}
              alt="Source"
              className="h-40 w-full rounded-lg object-cover sm:w-64"
            />
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-label-large text-on-surface-variant">
                Swatches — pick one to make it the primary
              </p>
              <div className="flex flex-wrap gap-2">
                {swatches.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => pickSwatch(s.hex)}
                    className={cn(
                      "flex h-14 min-w-24 cursor-pointer flex-col justify-end rounded-md p-2 text-left text-label-small focus-ring outline-none",
                      theme.source.primary === s.hex &&
                        "ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low"
                    )}
                    style={{ background: s.hex, color: readableOn(s.hex) }}
                  >
                    <span>{s.name}</span>
                    <span>{s.hex}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Panel>

      <Panel title="Scheme">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Variant</Label>
            <Select
              value={theme.variant}
              onValueChange={(v) => {
                if (isOneOf(SCHEME_VARIANTS, v)) updateTheme({ variant: v })
              }}
              items={SCHEME_VARIANTS.map((v) => ({ value: v, label: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCHEME_VARIANTS.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-body-small text-on-surface-variant">
              baseline = the official M3 Expressive scheme · image = uses the
              picture&apos;s own swatches
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Contrast</Label>
            <ToggleGroup
              spacing={0}
              value={[theme.contrast]}
              onValueChange={(v) => {
                const c = v[0]
                if (isContrastLevel(c)) updateTheme({ contrast: c })
              }}
            >
              {Object.keys(CONTRAST_LEVELS).map((c) => (
                <ToggleGroupItem key={c} value={c} variant="filled">
                  {c}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Color spec</Label>
            <ToggleGroup
              spacing={0}
              value={[theme.spec]}
              onValueChange={(v) => {
                const s = v[0]
                if (isOneOf(SPEC_VERSIONS, s)) updateTheme({ spec: s })
              }}
            >
              {SPEC_VERSIONS.map((c) => (
                <ToggleGroupItem key={c} value={c} variant="filled">
                  {c}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <p className="text-body-small text-on-surface-variant">
              {SPEC_NOTE[theme.spec]}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Motion</Label>
            <ToggleGroup
              spacing={0}
              value={[theme.motion]}
              onValueChange={(v) => {
                const m = v[0]
                if (isOneOf(MOTION_SCHEMES, m)) updateTheme({ motion: m })
              }}
            >
              {MOTION_SCHEMES.map((m) => (
                <ToggleGroupItem key={m} value={m} variant="filled">
                  {m}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label>
              Shape scale{" "}
              <span className="text-on-surface-variant">
                × {theme.shapeScale.toFixed(2)}
              </span>
            </Label>
            <Slider
              min={0.25}
              max={1.75}
              step={0.05}
              value={[theme.shapeScale]}
              onValueChange={(v) =>
                updateTheme({ shapeScale: Array.isArray(v) ? v[0] : v })
              }
              className="max-w-lg"
            />
          </div>
        </div>
        <div>
          <Button variant="text" onClick={resetTheme}>
            <Icon name="restart_alt" size={20} />
            Reset to baseline
          </Button>
        </div>
      </Panel>

      <Panel title="Colors">
        <div className="grid gap-6 md:grid-cols-2">
          {(
            [
              ["Light", light],
              ["Dark", dark],
            ] as const
          ).map(([name, scheme]) => (
            <div key={name} className="flex flex-col gap-2">
              <p className="text-label-large text-on-surface-variant">{name}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {ROLE_PAIRS.map(([bg, fg]) => (
                  <div
                    key={bg}
                    className="flex h-14 flex-col justify-end rounded-sm p-2 text-label-small"
                    style={{ background: scheme[bg], color: scheme[fg] }}
                  >
                    {bg}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-label-large text-on-surface-variant">
            Tonal palettes
          </p>
          {Object.entries(palettes).map(([name, tones]) => (
            <div key={name} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-body-small text-on-surface-variant">
                {name}
              </span>
              <div className="flex flex-1 overflow-hidden rounded-sm">
                {tones.map((hex, i) => (
                  <span
                    key={i}
                    className="h-8 flex-1"
                    style={{ background: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="CSS">
        <p className="text-body-medium text-on-surface-variant">
          Paste into your stylesheet after{" "}
          <code>@import &quot;./styles/m3e.css&quot;</code> — or keep{" "}
          <code>M3ThemeProvider</code> and use <code>updateTheme()</code> at
          runtime.
        </p>
        <CodeBlock code={css} lang="css" maxHeight="18rem" />
      </Panel>
    </div>
  )
}
