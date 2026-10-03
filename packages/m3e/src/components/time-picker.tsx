import * as React from "react"
import { cn } from "@/lib/m3e/cn"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"

/*
 * M3 time picker (Compose TimePicker / TimeInput tokens): a 28dp-cornered
 * surface-container-high card, elevation 3.
 *   dial   — 256dp surface-container-highest circle; a 48dp primary handle on a
 *            2dp track. Choosing the hour moves on to the minutes.
 *   input  — two 96×72dp fields (Display Medium) with supporting labels.
 * The hour/minute selectors are 96×80dp, 8dp corners: primary-container when
 * active. The AM/PM selector is a 52×80dp outlined pair; the chosen half is
 * tertiary-container.
 */
export type TimeValue = { hours: number; minutes: number }

type Mode = "dial" | "input"
type Field = "hours" | "minutes"

const DIAL = 256
const HANDLE = 48
const pad = (n: number) => String(n).padStart(2, "0")

function polar(angleDeg: number, radius: number) {
  const a = (angleDeg * Math.PI) / 180
  return {
    x: DIAL / 2 + radius * Math.sin(a),
    y: DIAL / 2 - radius * Math.cos(a),
  }
}

type TimePickerProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  value?: TimeValue
  defaultValue?: TimeValue
  onValueChange?: (value: TimeValue) => void
  /** 24-hour clock; default 12-hour with AM/PM */
  hour24?: boolean
  mode?: Mode
  onModeChange?: (mode: Mode) => void
  title?: string
  onCancel?: () => void
  onConfirm?: (value: TimeValue) => void
}

function TimePicker({
  value: valueProp,
  defaultValue = { hours: 9, minutes: 30 },
  onValueChange,
  hour24 = false,
  mode: modeProp,
  onModeChange,
  title = "Select time",
  onCancel,
  onConfirm,
  className,
  ...props
}: TimePickerProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const [innerMode, setInnerMode] = React.useState<Mode>("dial")
  const [field, setField] = React.useState<Field>("hours")
  const value = valueProp ?? inner
  const mode = modeProp ?? innerMode
  const dial = React.useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = React.useState(false)

  const commit = (next: TimeValue) => {
    setInner(next)
    onValueChange?.(next)
  }
  const pm = value.hours >= 12
  const shownHours = hour24 ? value.hours : value.hours % 12 || 12

  const setHour = (h: number) => {
    // keep AM/PM when choosing on a 12-hour dial
    const hours = hour24 ? h : (h % 12) + (pm ? 12 : 0)
    commit({ ...value, hours })
  }
  const setPeriod = (toPm: boolean) => {
    if (toPm === pm) return
    commit({ ...value, hours: (value.hours + 12) % 24 })
  }

  const fromPointer = (e: React.PointerEvent, finish: boolean) => {
    const box = dial.current!.getBoundingClientRect()
    const dx = e.clientX - (box.left + box.width / 2)
    const dy = e.clientY - (box.top + box.height / 2)
    let deg = (Math.atan2(dx, -dy) * 180) / Math.PI
    if (deg < 0) deg += 360
    if (field === "minutes") {
      commit({ ...value, minutes: Math.round(deg / 6) % 60 })
    } else {
      const step = Math.round(deg / 30) % 12 // 0 = top
      const innerRing = hour24 && Math.hypot(dx, dy) < (DIAL / 2) * 0.62
      // 24h: outer ring 12,1..11 · inner ring 0,13..23
      const hours = hour24
        ? innerRing
          ? step === 0
            ? 0
            : step + 12
          : step === 0
            ? 12
            : step
        : step === 0
          ? 12
          : step
      setHour(hour24 ? hours % 24 : hours)
    }
    if (finish && field === "hours") setField("minutes")
  }

  const labels =
    field === "hours"
      ? hour24
        ? [
            ...Array.from({ length: 12 }, (_, i) => ({
              text: String(i === 0 ? 12 : i),
              angle: i * 30,
              r: 100,
              v: i === 0 ? 12 : i,
            })),
            ...Array.from({ length: 12 }, (_, i) => ({
              text: pad(i === 0 ? 0 : i + 12),
              angle: i * 30,
              r: 64,
              v: i === 0 ? 0 : i + 12,
            })),
          ]
        : Array.from({ length: 12 }, (_, i) => ({
            text: String(i === 0 ? 12 : i),
            angle: i * 30,
            r: 100,
            v: i === 0 ? 12 : i,
          }))
      : Array.from({ length: 12 }, (_, i) => ({
          text: pad(i * 5),
          angle: i * 30,
          r: 100,
          v: i * 5,
        }))

  const selectedAngle =
    field === "minutes" ? value.minutes * 6 : (shownHours % 12) * 30
  const selectedRadius =
    field === "hours" && hour24 && (value.hours === 0 || value.hours > 12)
      ? 64
      : 100
  // keep the angle continuous so the handle takes the short way round (59 → 0)
  // (React-approved "adjust state during render": the previous target is state)
  const [angle, setAngle] = React.useState(selectedAngle)
  const nextAngle =
    angle + ((((selectedAngle - angle) % 360) + 540) % 360) - 180
  if (Math.abs(nextAngle - angle) > 0.001) setAngle(nextAngle)
  const onTickLabel = field === "minutes" && value.minutes % 5 !== 0

  const box = (f: Field) =>
    cn(
      "grid h-20 w-24 cursor-pointer place-items-center rounded-sm text-display-large tabular-nums focus-ring transition-colors motion-effects-fast outline-none",
      mode === "input" && "h-[72px] text-display-medium",
      field === f
        ? "bg-primary-container text-on-primary-container"
        : "bg-surface-container-highest text-on-surface"
    )

  return (
    <div
      role="group"
      aria-label={title}
      data-slot="time-picker"
      className={cn(
        "flex w-fit flex-col gap-5 rounded-2xl bg-surface-container-high p-6 shadow-elevation-3",
        className
      )}
      {...props}
    >
      <p className="text-label-medium text-on-surface-variant">{title}</p>

      <div className="flex items-start gap-3">
        <div className="flex items-center gap-1">
          {mode === "dial" ? (
            <button
              type="button"
              className={box("hours")}
              onClick={() => setField("hours")}
            >
              {pad(shownHours)}
            </button>
          ) : (
            <div className="flex flex-col gap-1">
              <input
                inputMode="numeric"
                aria-label="Hour"
                className={cn(box("hours"), "w-24 text-center")}
                value={pad(shownHours)}
                onFocus={() => setField("hours")}
                onChange={(e) => {
                  const n = parseInt(
                    e.target.value.replace(/\D/g, "").slice(-2),
                    10
                  )
                  if (Number.isNaN(n)) return
                  if (hour24 ? n <= 23 : n >= 1 && n <= 12) setHour(n)
                }}
              />
              <span className="text-body-small text-on-surface-variant">
                Hour
              </span>
            </div>
          )}
          <span
            className={cn(
              "w-6 text-center text-on-surface",
              mode === "input"
                ? "pb-6 text-display-large"
                : "text-display-large"
            )}
          >
            :
          </span>
          {mode === "dial" ? (
            <button
              type="button"
              className={box("minutes")}
              onClick={() => setField("minutes")}
            >
              {pad(value.minutes)}
            </button>
          ) : (
            <div className="flex flex-col gap-1">
              <input
                inputMode="numeric"
                aria-label="Minute"
                className={cn(box("minutes"), "w-24 text-center")}
                value={pad(value.minutes)}
                onFocus={() => setField("minutes")}
                onChange={(e) => {
                  const n = parseInt(
                    e.target.value.replace(/\D/g, "").slice(-2),
                    10
                  )
                  if (!Number.isNaN(n) && n <= 59)
                    commit({ ...value, minutes: n })
                }}
              />
              <span className="text-body-small text-on-surface-variant">
                Minute
              </span>
            </div>
          )}
        </div>

        {!hour24 && (
          <div
            role="radiogroup"
            aria-label="AM or PM"
            className={cn(
              "flex w-[52px] flex-col overflow-hidden rounded-sm border border-outline",
              mode === "dial" ? "h-20" : "h-[72px]"
            )}
          >
            {(["AM", "PM"] as const).map((p) => {
              const on = (p === "PM") === pm
              return (
                <button
                  key={p}
                  role="radio"
                  aria-checked={on}
                  type="button"
                  onClick={() => setPeriod(p === "PM")}
                  className={cn(
                    "flex-1 cursor-pointer text-title-medium focus-ring-inset transition-colors motion-effects-fast outline-none",
                    on
                      ? "bg-tertiary-container text-on-tertiary-container"
                      : "text-on-surface-variant hover:bg-on-surface/8",
                    p === "AM" && "border-b border-outline"
                  )}
                >
                  {p}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {mode === "dial" && (
        <div
          ref={dial}
          role="slider"
          tabIndex={0}
          aria-label={field === "hours" ? "Hours" : "Minutes"}
          aria-valuenow={field === "hours" ? shownHours : value.minutes}
          aria-valuemin={field === "hours" ? (hour24 ? 0 : 1) : 0}
          aria-valuemax={field === "hours" ? (hour24 ? 23 : 12) : 59}
          onKeyDown={(e) => {
            const d =
              e.key === "ArrowUp" || e.key === "ArrowRight"
                ? 1
                : e.key === "ArrowDown" || e.key === "ArrowLeft"
                  ? -1
                  : 0
            if (!d) return
            e.preventDefault()
            if (field === "minutes")
              commit({ ...value, minutes: (value.minutes + d + 60) % 60 })
            else commit({ ...value, hours: (value.hours + d + 24) % 24 })
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            setDragging(true)
            fromPointer(e, false)
          }}
          onPointerMove={(e) => e.buttons && fromPointer(e, false)}
          onPointerUp={(e) => {
            fromPointer(e, true)
            setDragging(false)
          }}
          onPointerCancel={() => setDragging(false)}
          className="relative touch-none self-center rounded-full bg-surface-container-highest outline-none select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          style={{ width: DIAL, height: DIAL }}
        >
          {/* track and handle turn together about the centre */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-1/2 left-1/2 size-0",
              !dragging && "transition-transform motion-spatial-fast"
            )}
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <span
              className={cn(
                "absolute bottom-0 -left-px w-0.5 bg-primary",
                !dragging && "transition-[height] motion-spatial-fast"
              )}
              style={{ height: selectedRadius }}
            />
            <span
              className={cn(
                "absolute top-0 left-0 grid place-items-center rounded-full bg-primary",
                !dragging && "transition-transform motion-spatial-fast"
              )}
              style={{
                width: HANDLE,
                height: HANDLE,
                transform: `translate(-50%, ${-selectedRadius - HANDLE / 2}px)`,
              }}
            >
              {onTickLabel && (
                <span className="size-1 rounded-full bg-on-primary" />
              )}
            </span>
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full bg-primary"
          />
          <div key={field} className="animate-in duration-200 fade-in-0">
            {labels.map((l) => {
              const p = polar(l.angle, l.r)
              const selected =
                field === "hours"
                  ? (hour24 ? value.hours : shownHours) === l.v
                  : value.minutes === l.v
              return (
                <span
                  key={`${l.r}-${l.text}`}
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute grid size-12 -translate-1/2 place-items-center text-body-large tabular-nums",
                    selected ? "text-on-primary" : "text-on-surface"
                  )}
                  style={{ left: p.x, top: p.y }}
                >
                  {l.text}
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex items-center">
        <Button
          variant="text"
          size="icon"
          aria-label={
            mode === "dial" ? "Switch to text input" : "Switch to dial"
          }
          className="text-on-surface-variant"
          onClick={() => {
            const next = mode === "dial" ? "input" : "dial"
            setInnerMode(next)
            onModeChange?.(next)
          }}
        >
          <Icon name={mode === "dial" ? "keyboard" : "schedule"} />
        </Button>
        <div className="flex-1" />
        {(onCancel || onConfirm) && (
          <div className="flex gap-2">
            <Button variant="text" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="text" onClick={() => onConfirm?.(value)}>
              OK
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export { TimePicker }
