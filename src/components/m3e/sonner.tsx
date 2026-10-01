"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { Button } from "@/components/m3e/button"
import { CloseIcon } from "@/components/m3e/symbols"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 snackbar with the sonner-style `toast()` API.
 *
 * Not a sonner wrapper: sonner stacks toasts, slides them in and expands them on
 * hover, none of which a snackbar does. This follows the M3 guidelines and the
 * Compose Material3 SnackbarHost instead:
 *
 *   - one snackbar at a time; the rest wait in a queue and appear after the
 *     current one has left. Calling toast() again with the same `id` updates
 *     it in place (a "snackbar with updated information replaces the outdated one")
 *   - no icon, a single text-button action, an optional trailing close button
 *   - without an action it leaves on its own after 4s (hover / focus pauses it);
 *     with an action it stays until the user acts or dismisses it
 *   - enters and leaves with a fade (fast effects spring) and a scale from 0.8
 *     (fast spatial spring), the Compose FadeInFadeOutWithScale
 *   - SnackbarTokens: inverse-surface, inverse-on-surface Body Medium, 4dp
 *     corners, elevation 3, 48dp tall (68dp with two lines), 12dp from the
 *     edges; 344–600dp wide on medium and larger screens, full width on compact
 *   - bottom center by default; raise it over a navigation bar / FAB with the
 *     `offset` prop or the --snackbar-offset CSS variable
 */

type SnackbarId = string | number

type SnackbarType =
  | "default"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "loading"

type DismissReason = "action" | "close" | "timeout" | "api"

interface SnackbarAction {
  label: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

interface SnackbarOptions {
  /** Reuse an id to update that snackbar (queued or showing) instead of adding another. */
  id?: SnackbarId
  /** A second line of supporting text. */
  description?: React.ReactNode
  /** ms before it leaves. Default 4000; Infinity when there is an action. */
  duration?: number
  /** The single text-button action. The snackbar leaves after it is pressed. */
  action?: SnackbarAction
  /** Show the trailing close button. */
  closeButton?: boolean
  /** Put a long action on its own line below the text. */
  actionOnNewLine?: boolean
  /** M3 advises against icons; pass one only if the message really needs it. */
  icon?: React.ReactNode
  className?: string
  /** Called when the user closed it (action, close button or toast.dismiss). */
  onDismiss?: (id: SnackbarId, reason: DismissReason) => void
  /** Called when it left because the duration ran out. */
  onAutoClose?: (id: SnackbarId) => void
}

interface SnackbarData extends SnackbarOptions {
  id: SnackbarId
  message: React.ReactNode
  type: SnackbarType
  /** changes for every newly shown snackbar (not on updates), used as the React key */
  uid: number
  /** bumps on every update so the timer restarts */
  revision: number
  closing: boolean
}

interface SnackbarState {
  current: SnackbarData | null
  queue: SnackbarData[]
}

/* ------------------------------------------------------------------ store */

let state: SnackbarState = { current: null, queue: [] }
const listeners = new Set<() => void>()
let counter = 0

const emit = (next: SnackbarState) => {
  state = next
  listeners.forEach((l) => l())
}
const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
const getSnapshot = () => state
const serverSnapshot: SnackbarState = { current: null, queue: [] }
const getServerSnapshot = () => serverSnapshot
const noopSubscribe = () => () => {}

function show(
  message: React.ReactNode,
  options: SnackbarOptions & { type?: SnackbarType } = {}
): SnackbarId {
  const id = options.id ?? `snackbar-${++counter}`
  const type = options.type ?? "default"
  const base = {
    ...options,
    id,
    message,
    type,
    duration:
      options.duration ?? (type === "loading" ? Infinity : options.duration),
  }

  const { current, queue } = state
  if (current && current.id === id && !current.closing) {
    emit({
      current: {
        ...base,
        uid: current.uid,
        revision: current.revision + 1,
        closing: false,
      },
      queue,
    })
    return id
  }
  const queued = queue.findIndex((q) => q.id === id)
  if (queued >= 0) {
    const next = queue.slice()
    next[queued] = {
      ...base,
      uid: queue[queued].uid,
      revision: 0,
      closing: false,
    }
    emit({ current, queue: next })
    return id
  }
  const data: SnackbarData = {
    ...base,
    uid: ++counter,
    revision: 0,
    closing: false,
  }
  emit(
    current ? { current, queue: [...queue, data] } : { current: data, queue }
  )
  return id
}

function close(id: SnackbarId, reason: DismissReason) {
  const { current, queue } = state
  if (current && current.id === id) {
    if (current.closing) return
    emit({ current: { ...current, closing: true }, queue })
    if (reason === "timeout") current.onAutoClose?.(id)
    else current.onDismiss?.(id, reason)
    return
  }
  const q = queue.find((item) => item.id === id)
  if (q) {
    emit({ current, queue: queue.filter((item) => item !== q) })
    q.onDismiss?.(id, reason)
  }
}

/** Called by the host once the leave animation has finished: bring in the next one. */
function finish(uid: number) {
  const { current, queue } = state
  if (!current || current.uid !== uid || !current.closing) return
  const [next, ...rest] = queue
  emit({ current: next ?? null, queue: rest })
}

function dismiss(id?: SnackbarId) {
  if (id !== undefined) {
    close(id, "api")
    return
  }
  const { current, queue } = state
  emit({ current, queue: [] })
  queue.forEach((q) => q.onDismiss?.(q.id, "api"))
  if (current) close(current.id, "api")
}

interface PromiseMessages<T> {
  loading?: React.ReactNode
  success?: React.ReactNode | ((result: T) => React.ReactNode)
  error?: React.ReactNode | ((error: unknown) => React.ReactNode)
  description?: React.ReactNode
  finally?: () => void
}

function promise<T>(
  source: Promise<T> | (() => Promise<T>),
  messages: PromiseMessages<T>
) {
  const id = `snackbar-${++counter}`
  if (messages.loading !== undefined)
    show(messages.loading, {
      id,
      type: "loading",
      description: messages.description,
    })
  const p = typeof source === "function" ? source() : source
  p.then((result) => {
    if (messages.success === undefined) {
      close(id, "api")
      return
    }
    const text =
      typeof messages.success === "function"
        ? messages.success(result)
        : messages.success
    show(text, { id, type: "success" })
  })
    .catch((error: unknown) => {
      if (messages.error === undefined) {
        close(id, "api")
        return
      }
      const text =
        typeof messages.error === "function"
          ? messages.error(error)
          : messages.error
      show(text, { id, type: "error" })
    })
    .finally(() => messages.finally?.())
  return { id, unwrap: () => p }
}

type Show = (message: React.ReactNode, options?: SnackbarOptions) => SnackbarId

const toast = Object.assign(
  ((message, options) => show(message, options)) as Show,
  {
    message: ((message, options) => show(message, options)) as Show,
    success: ((message, options) =>
      show(message, { ...options, type: "success" })) as Show,
    info: ((message, options) =>
      show(message, { ...options, type: "info" })) as Show,
    warning: ((message, options) =>
      show(message, { ...options, type: "warning" })) as Show,
    error: ((message, options) =>
      show(message, { ...options, type: "error" })) as Show,
    loading: ((message, options) =>
      show(message, { ...options, type: "loading" })) as Show,
    promise,
    dismiss,
  }
)

/* ------------------------------------------------------------------- view */

type SnackbarPosition = "bottom-center" | "bottom-left" | "bottom-right"

interface ToasterProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Where it sits at the bottom. Keep it in one place; never flush against an edge without margin. */
  position?: SnackbarPosition
  /** Extra distance from the bottom, e.g. a navigation bar's height. Number = px. Same as setting --snackbar-offset. */
  offset?: number | string
  /** ms before a snackbar without an action leaves. Default 4000. */
  duration?: number
  /** Give every snackbar a close button. */
  closeButton?: boolean
  /** Accessible name of the notification region. */
  label?: string
}

const EXIT_FALLBACK_MS = 700

function SnackbarView({
  data,
  hostDuration,
  hostCloseButton,
}: {
  data: SnackbarData
  hostDuration: number
  hostCloseButton: boolean
}) {
  const { id, closing, revision } = data
  const duration = data.duration ?? (data.action ? Infinity : hostDuration)
  const showClose = data.closeButton ?? hostCloseButton

  /* enter: mount closed, open on the next frame so the transition runs */
  const [entered, setEntered] = React.useState(false)
  React.useEffect(() => {
    let b = 0
    const a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setEntered(true))
    })
    return () => {
      cancelAnimationFrame(a)
      cancelAnimationFrame(b)
    }
  }, [])

  /* auto close; hovering or focusing the snackbar pauses the clock */
  const remaining = React.useRef(duration)
  const startedAt = React.useRef(0)
  const timer = React.useRef<number | undefined>(undefined)
  const holds = React.useRef(0)

  const stop = React.useCallback(() => {
    if (timer.current === undefined) return
    window.clearTimeout(timer.current)
    timer.current = undefined
    remaining.current -= Date.now() - startedAt.current
  }, [])
  const start = React.useCallback(() => {
    if (!Number.isFinite(remaining.current) || timer.current !== undefined)
      return
    startedAt.current = Date.now()
    timer.current = window.setTimeout(
      () => {
        timer.current = undefined
        close(id, "timeout")
      },
      Math.max(0, remaining.current)
    )
  }, [id])

  React.useEffect(() => {
    remaining.current = duration
    if (!closing && holds.current === 0) start()
    return () => {
      if (timer.current !== undefined) window.clearTimeout(timer.current)
      timer.current = undefined
    }
    // `revision` is not read above on purpose: an update restarts the clock
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision, duration, closing, start])

  const hold = () => {
    holds.current += 1
    stop()
  }
  const release = () => {
    holds.current = Math.max(0, holds.current - 1)
    if (holds.current === 0 && !closing) start()
  }

  /* leave: when the fade has finished (or a fallback), let the next one in */
  React.useEffect(() => {
    if (!closing) return undefined
    const t = window.setTimeout(() => finish(data.uid), EXIT_FALLBACK_MS)
    return () => window.clearTimeout(t)
  }, [closing, data.uid])

  const hasButtons = Boolean(data.action) || showClose
  const open = entered && !closing

  return (
    <div
      data-slot="snackbar"
      data-state={open ? "open" : "closed"}
      data-type={data.type}
      role={data.type === "error" ? "alert" : undefined}
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocus={hold}
      onBlur={release}
      onTransitionEnd={(e) => {
        if (
          closing &&
          e.target === e.currentTarget &&
          e.propertyName === "opacity"
        )
          finish(data.uid)
      }}
      className={cn(
        "pointer-events-auto flex w-full min-w-0 rounded-xs bg-inverse-surface text-inverse-on-surface shadow-elevation-3 min-[600px]:w-max min-[600px]:max-w-[600px] min-[600px]:min-w-[344px]",
        data.actionOnNewLine ? "flex-col" : "min-h-12 items-center",
        "scale-80 opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100",
        "[transition:scale_var(--md-sys-motion-spring-fast-spatial-duration)_var(--md-sys-motion-spring-fast-spatial),opacity_var(--md-sys-motion-spring-fast-effects-duration)_var(--md-sys-motion-spring-fast-effects)] motion-reduce:scale-100 motion-reduce:transition-opacity",
        data.className
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-3 py-3.5 pl-4 text-body-medium",
          hasButtons ? "pr-2" : "pr-4"
        )}
      >
        {data.icon ? (
          <span className="shrink-0 [&_svg:not([class*='size-'])]:size-6">
            {data.icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <div data-slot="snackbar-text">{data.message}</div>
          {data.description ? (
            <div data-slot="snackbar-description">{data.description}</div>
          ) : null}
        </div>
      </div>
      {hasButtons ? (
        <div
          className={cn(
            "flex shrink-0 items-center",
            data.actionOnNewLine ? "self-end pr-2 pb-1" : ""
          )}
        >
          {data.action ? (
            <Button
              variant="text"
              size="sm"
              data-slot="snackbar-action"
              className="px-3 text-inverse-primary"
              onClick={(e) => {
                data.action?.onClick?.(e)
                if (!e.defaultPrevented) close(id, "action")
              }}
            >
              {data.action.label}
            </Button>
          ) : null}
          {showClose ? (
            <Button
              variant="ghost"
              size="icon-sm"
              data-slot="snackbar-close"
              aria-label="Dismiss"
              className={cn(
                "text-inverse-on-surface",
                data.action ? "" : "mr-1"
              )}
              onClick={() => close(id, "close")}
            >
              <CloseIcon aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

/**
 * Render once near the root. Shows one snackbar at a time and queues the rest.
 * Drop-in for the shadcn `<Toaster />`; the sonner-only props (richColors, expand,
 * visibleToasts, ...) do not exist because a snackbar does not stack.
 */
function Toaster({
  position = "bottom-center",
  offset,
  duration = 4000,
  closeButton = false,
  label = "Notifications",
  className,
  style,
  ...props
}: ToasterProps) {
  const { current } = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const mounted = React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )
  if (!mounted) return null

  const extra = typeof offset === "number" ? `${offset}px` : offset

  return createPortal(
    <div
      data-slot="snackbar-host"
      data-position={position}
      role="region"
      aria-label={label}
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-100 flex px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom)+var(--snackbar-offset,0px))]",
        position === "bottom-center" && "justify-center",
        position === "bottom-left" && "justify-start",
        position === "bottom-right" && "justify-end",
        className
      )}
      style={{
        ...(extra === undefined ? null : { "--snackbar-offset": extra }),
        ...style,
      }}
      {...props}
    >
      {/* a persistent polite live region: its content is announced when it changes */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="contents"
      >
        {current ? (
          <SnackbarView
            key={current.uid}
            data={current}
            hostDuration={duration}
            hostCloseButton={closeButton}
          />
        ) : null}
      </div>
    </div>,
    document.body
  )
}

export { Toaster, toast }
export type {
  DismissReason,
  SnackbarAction,
  SnackbarId,
  SnackbarOptions,
  SnackbarPosition,
  SnackbarType,
  ToasterProps,
}
