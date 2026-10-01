import * as React from "react"
import { cn } from "@/lib/m3e/cn"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { Ripple } from "@/components/m3e/ripple"

/*
 * M3 search (Compose SearchBar / SearchView tokens, m3.material.io/components/search).
 *
 *   SearchBar  — 56dp full pill, surface-container-high, elevation 3; a
 *                leading icon (search), Body Large input, trailing actions
 *                (avatar 30dp).
 *   SearchView — the bar opened into its results:
 *        docked      the bar grows downward into a container with extra-large
 *                    (28dp) corners; 56dp header, outline divider, results
 *        fullscreen  covers the window; 72dp header with a back arrow, no
 *                    corners
 * `SearchResult` is a 56dp list row for suggestions and history.
 */
type SearchViewProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  value?: string
  onValueChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
  /** replaces the search icon (docked) */
  leading?: React.ReactNode
  /** actions shown in the header (a clear button is added for you) */
  trailing?: React.ReactNode
  variant?: "docked" | "fullscreen"
  /** slim 44dp bar for dense headers */
  size?: "default" | "sm"
  onSubmit?: (value: string) => void
  "aria-label"?: string
}

function SearchView({
  value: valueProp,
  onValueChange,
  open: openProp,
  onOpenChange,
  placeholder = "Search",
  leading,
  trailing,
  variant = "docked",
  size = "default",
  onSubmit,
  className,
  children,
  "aria-label": ariaLabel = "Search",
  ...props
}: SearchViewProps) {
  const [innerValue, setInnerValue] = React.useState("")
  const [innerOpen, setInnerOpen] = React.useState(false)
  const value = valueProp ?? innerValue
  const open = openProp ?? innerOpen
  const ref = React.useRef<HTMLDivElement>(null)
  const input = React.useRef<HTMLInputElement>(null)
  const listId = React.useId()

  const setValue = (v: string) => {
    setInnerValue(v)
    onValueChange?.(v)
  }
  const setOpen = React.useCallback(
    (next: boolean) => {
      setInnerOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange]
  )

  React.useEffect(() => {
    if (!open) return undefined
    const onDown = (e: PointerEvent) => {
      if (
        variant === "docked" &&
        !(e.target instanceof Node && ref.current?.contains(e.target))
      )
        setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        input.current?.blur()
      }
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open, variant, setOpen])

  const full = variant === "fullscreen"
  const sm = size === "sm" && !full
  const header = (
    <div
      className={cn(
        "flex items-center gap-1 px-1",
        full ? "h-18" : sm ? "h-11" : "h-14"
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center text-on-surface",
          sm ? "size-10" : "size-12"
        )}
      >
        {full && open ? (
          <Button
            variant="text"
            size="icon"
            aria-label="Back"
            className="text-on-surface"
            onClick={() => setOpen(false)}
          >
            <Icon name="arrow_back" />
          </Button>
        ) : (
          (leading ?? <Icon name="search" />)
        )}
      </span>
      <input
        ref={input}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit?.(value)
          if (e.key === "ArrowDown")
            ref.current?.querySelector<HTMLElement>('[role="option"]')?.focus()
        }}
        className="h-full min-w-0 flex-1 bg-transparent text-body-large text-on-surface caret-primary outline-none placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="flex shrink-0 items-center gap-1 pr-1 text-on-surface-variant">
        {value && (
          <span
            className={cn(
              "flex items-center justify-center",
              sm ? "size-10" : "size-12"
            )}
          >
            <Button
              variant="text"
              size="icon"
              aria-label="Clear"
              className="text-on-surface-variant"
              onClick={() => {
                setValue("")
                input.current?.focus()
              }}
            >
              <Icon name="close" />
            </Button>
          </span>
        )}
        {trailing && (
          <span
            className={cn(
              "flex items-center justify-center",
              sm ? "h-10 min-w-10" : "h-12 min-w-12"
            )}
          >
            {trailing}
          </span>
        )}
      </div>
    </div>
  )

  const results = (
    <div
      id={listId}
      role="listbox"
      data-slot="search-results"
      className={cn(
        "overflow-y-auto overscroll-contain border-t border-outline",
        full ? "h-[calc(100dvh-4.5rem)]" : "max-h-80"
      )}
    >
      {children}
    </div>
  )

  if (full) {
    return (
      <div
        ref={ref}
        data-slot="search-view"
        data-variant="fullscreen"
        data-open={open || undefined}
        className={cn(
          open
            ? "fixed inset-0 z-50 bg-surface-container-high"
            : "relative rounded-full bg-surface-container-high shadow-elevation-3",
          "transition-shape motion-spatial-default",
          className
        )}
        {...props}
      >
        {header}
        {open && results}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      data-slot="search-view"
      data-variant="docked"
      data-open={open || undefined}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-surface-container-high shadow-elevation-3 transition-shape motion-spatial-default",
        className
      )}
      {...props}
    >
      {header}
      <div
        className={cn(
          "grid transition-[grid-template-rows] motion-spatial-default",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0 overflow-hidden">{open && results}</div>
      </div>
    </div>
  )
}

/** the closed bar on its own: a button that opens a SearchView elsewhere */
function SearchBar({
  className,
  children,
  placeholder = "Search",
  leading,
  trailing,
  ...props
}: React.ComponentProps<"button"> & {
  placeholder?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
}) {
  return (
    <button
      type="button"
      data-slot="search-bar"
      className={cn(
        "state-layer relative flex h-14 w-full cursor-text items-center gap-1 overflow-hidden rounded-full bg-surface-container-high px-1 text-left text-body-large shadow-elevation-3 focus-ring outline-none",
        className
      )}
      {...props}
    >
      <Ripple />
      <span className="flex size-12 shrink-0 items-center justify-center text-on-surface">
        {leading ?? <Icon name="search" />}
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate",
          children ? "text-on-surface" : "text-on-surface-variant"
        )}
      >
        {children ?? placeholder}
      </span>
      {trailing && (
        <span className="flex shrink-0 items-center gap-1 pr-1 text-on-surface-variant">
          {trailing && (
            <span className="flex h-12 min-w-12 items-center justify-center">
              {trailing}
            </span>
          )}
        </span>
      )}
    </button>
  )
}

function SearchResult({
  icon,
  trailing,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  icon?: React.ReactNode
  trailing?: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={false}
      data-slot="search-result"
      className={cn(
        "state-layer relative flex h-14 w-full cursor-pointer items-center gap-4 px-4 text-left text-body-large text-on-surface focus-ring-inset outline-none",
        className
      )}
      {...props}
    >
      <Ripple />
      {typeof icon === "string" ? (
        <Icon name={icon} className="text-on-surface-variant" />
      ) : (
        icon
      )}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing && (
        <span className="shrink-0 text-label-medium text-on-surface-variant">
          {trailing}
        </span>
      )}
    </button>
  )
}

export { SearchView, SearchBar, SearchResult }
