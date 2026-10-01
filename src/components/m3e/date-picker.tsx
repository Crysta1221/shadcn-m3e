"use client"

import * as React from "react"
import type { DateRange, Matcher } from "react-day-picker"

import { Button } from "@/components/m3e/button"
import { Calendar } from "@/components/m3e/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/m3e/dialog"
import { Icon } from "@/components/m3e/icon"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/m3e/popover"
import { ScrollArea } from "@/components/m3e/scroll-area"
import { TextField } from "@/components/m3e/text-field"
import { cn } from "@/lib/m3e/cn"

/*
 * M3 date pickers (Compose DatePickerModalTokens):
 *   modal   360dp wide, surface-container-high, extra-large corners, level 3.
 *           A 120dp header (128dp for a range) with the title (label large)
 *           and the chosen date (headline large; title large for a range), a
 *           divider, the month row, the calendar, then Cancel / OK.
 *   docked  the calendar in a popup under a text field.
 * Days are 40dp circles; the month row opens a list of years (72×36dp
 * chips). The pencil in the header switches to typing the date.
 */

/* ---------- dates ---------- */

const pad = (n: number) => String(n).padStart(2, "0")

/** mm/dd/yyyy */
export function formatDateInput(date: Date | undefined) {
  return date
    ? `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`
    : ""
}

/** mm/dd/yyyy, or null when it is not a real date */
export function parseDateInput(text: string): Date | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text.trim())
  if (!m) return null
  const [month, day, year] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null
}

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, 1)

function short(date: Date, locale?: string, weekday = false) {
  return new Intl.DateTimeFormat(locale, {
    weekday: weekday ? "short" : undefined,
    month: "short",
    day: "numeric",
  }).format(date)
}

/* ---------- pieces ---------- */

function YearList({
  selected,
  start,
  end,
  onSelect,
}: {
  selected: number
  start: number
  end: number
  onSelect: (year: number) => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    ref.current
      ?.querySelector("[data-selected-year]")
      ?.scrollIntoView({ block: "center" })
  }, [])
  const years = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <ScrollArea className="h-72">
      <div
        ref={ref}
        role="listbox"
        aria-label="Year"
        className="grid grid-cols-3 justify-items-center gap-y-2 px-6 py-2"
      >
        {years.map((year) => (
          <Button
            key={year}
            role="option"
            aria-selected={year === selected}
            data-selected-year={year === selected ? "" : undefined}
            variant={year === selected ? "filled" : "text"}
            className={cn(
              "h-9 w-[72px] px-0 text-body-large",
              year !== selected && "text-on-surface-variant"
            )}
            onClick={() => onSelect(year)}
          >
            {year}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}

/* ---------- modal ---------- */

type PickerBase = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** the element that opens the picker, e.g. `<Button>Pick a date</Button>` */
  trigger?: React.ReactElement
  /** the small label in the header */
  title?: string
  /** for month and weekday names (BCP 47, e.g. "ja-JP") */
  locale?: string
  /** dates that can not be picked */
  disabled?: Matcher | Matcher[]
  /** first and last year of the year list */
  startYear?: number
  endYear?: number
  /** open on the text input instead of the calendar */
  defaultView?: "calendar" | "input"
}

export type DatePickerModalProps = PickerBase &
  (
    | {
        mode?: "single"
        value?: Date
        onConfirm?: (date: Date) => void
      }
    | {
        mode: "range"
        value?: DateRange
        onConfirm?: (range: { from: Date; to: Date }) => void
      }
  )

type BodyProps = Required<Pick<PickerBase, "startYear" | "endYear">> &
  Pick<PickerBase, "title" | "locale" | "disabled" | "defaultView"> & {
    mode: "single" | "range"
    value: Date | DateRange | undefined
    onConfirm: (value: Date | { from: Date; to: Date }) => void
    close: () => void
  }

const invalidDateText = (text: string) => text !== "" && !parseDateInput(text)

function PickerBody({
  mode,
  value,
  title,
  locale,
  disabled,
  startYear,
  endYear,
  defaultView = "calendar",
  onConfirm,
  close,
}: BodyProps) {
  const isRange = mode === "range"
  const [single, setSingle] = React.useState<Date | undefined>(
    !isRange && value instanceof Date ? value : undefined
  )
  const [range, setRange] = React.useState<DateRange | undefined>(
    isRange && !(value instanceof Date) ? value : undefined
  )
  const [month, setMonth] = React.useState(() =>
    startOfMonth(value instanceof Date ? value : (value?.from ?? new Date()))
  )
  const [view, setView] = React.useState(defaultView)
  const [years, setYears] = React.useState(false)
  const [texts, setTexts] = React.useState<[string, string]>(["", ""])
  const firstField = React.useRef<HTMLInputElement>(null)

  // typing was asked for: the cursor goes to the first field
  React.useEffect(() => {
    if (view === "input") firstField.current?.focus()
  }, [view])

  const complete = isRange ? !!range?.from && !!range?.to : !!single
  const from = isRange ? range?.from : single
  const to = isRange ? range?.to : undefined

  const headline = isRange
    ? `${from ? short(from, locale) : "Start date"} – ${to ? short(to, locale) : "End date"}`
    : single
      ? short(single, locale, true)
      : "Enter date"

  const goInput = () => {
    setTexts([formatDateInput(from), formatDateInput(to)])
    setYears(false)
    setView("input")
  }
  const goCalendar = () => {
    if (from) setMonth(startOfMonth(from))
    setView("calendar")
  }

  // typing: a valid date is taken over, anything else clears the choice
  const type = (which: 0 | 1, text: string) => {
    const next: [string, string] =
      which === 0 ? [text, texts[1]] : [texts[0], text]
    setTexts(next)
    const a = parseDateInput(next[0])
    if (!isRange) return setSingle(a ?? undefined)
    const b = parseDateInput(next[1])
    setRange({ from: a ?? undefined, to: b ?? undefined })
  }
  const backwards = isRange && !!from && !!to && to < from

  const calendarProps = {
    month,
    onMonthChange: setMonth,
    hideNavigation: true,
    disabled,
    className: "w-full px-3 pb-2",
    classNames: { root: "w-full", month_caption: "hidden", nav: "hidden" },
    formatters: {
      formatWeekdayName: (d: Date) =>
        d.toLocaleDateString(locale, { weekday: "narrow" }),
    },
  } as const

  return (
    <>
      <div
        className={cn(
          "flex flex-col justify-between pt-4 pr-3 pb-3 pl-6",
          isRange ? "h-32" : "h-[120px]"
        )}
      >
        <DialogTitle className="text-label-large text-on-surface-variant">
          {title ?? (isRange ? "Select dates" : "Select date")}
        </DialogTitle>
        <div className="flex items-end justify-between gap-2">
          <p
            className={cn(
              "min-w-0 text-on-surface-variant",
              isRange ? "text-title-large" : "text-headline-large"
            )}
          >
            {headline}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-on-surface-variant"
            aria-label={
              view === "calendar"
                ? "Switch to text input"
                : "Switch to calendar"
            }
            onClick={view === "calendar" ? goInput : goCalendar}
          >
            <Icon name={view === "calendar" ? "edit" : "calendar_today"} />
          </Button>
        </div>
      </div>
      <div className="h-px bg-outline-variant" />

      {view === "calendar" ? (
        <>
          <div className="flex h-12 items-center justify-between pr-3 pl-3">
            <Button
              variant="text"
              size="sm"
              aria-expanded={years}
              className="text-on-surface-variant"
              onClick={() => setYears((y) => !y)}
            >
              {month.toLocaleDateString(locale, {
                month: "long",
                year: "numeric",
              })}
              <Icon
                name="arrow_drop_down"
                className={cn(
                  "transition-transform motion-spatial-fast",
                  years && "rotate-180"
                )}
              />
            </Button>
            {!years && (
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Previous month"
                  className="text-on-surface-variant"
                  onClick={() => setMonth((m) => addMonths(m, -1))}
                >
                  <Icon name="chevron_left" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Next month"
                  className="text-on-surface-variant"
                  onClick={() => setMonth((m) => addMonths(m, 1))}
                >
                  <Icon name="chevron_right" />
                </Button>
              </div>
            )}
          </div>
          {years ? (
            <YearList
              selected={month.getFullYear()}
              start={startYear}
              end={endYear}
              onSelect={(y) => {
                setMonth(new Date(y, month.getMonth(), 1))
                setYears(false)
              }}
            />
          ) : isRange ? (
            <Calendar
              {...calendarProps}
              mode="range"
              selected={range}
              onSelect={setRange}
            />
          ) : (
            <Calendar
              {...calendarProps}
              mode="single"
              required
              selected={single}
              onSelect={setSingle}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4 px-6 py-6">
          <TextField
            label={isRange ? "Start date" : "Date"}
            placeholder="mm/dd/yyyy"
            supportingText="mm/dd/yyyy"
            inputMode="numeric"
            ref={firstField}
            value={texts[0]}
            error={invalidDateText(texts[0])}
            errorText="Invalid date format."
            onChange={(e) => type(0, e.target.value)}
          />
          {isRange && (
            <TextField
              label="End date"
              placeholder="mm/dd/yyyy"
              supportingText="mm/dd/yyyy"
              inputMode="numeric"
              value={texts[1]}
              error={invalidDateText(texts[1]) || backwards}
              errorText={
                backwards
                  ? "End date is before the start."
                  : "Invalid date format."
              }
              onChange={(e) => type(1, e.target.value)}
            />
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 px-6 pt-2 pb-6">
        <DialogClose render={<Button variant="text" />}>Cancel</DialogClose>
        <Button
          variant="text"
          disabled={!complete || backwards}
          onClick={() => {
            if (isRange && range?.from && range.to)
              onConfirm({ from: range.from, to: range.to })
            else if (!isRange && single) onConfirm(single)
            close()
          }}
        >
          OK
        </Button>
      </div>
    </>
  )
}

/**
 * The modal date picker: a dialog with a calendar, or a text input, that
 * confirms with OK. `mode="range"` picks two dates.
 *
 * ```tsx
 * <DatePickerModal
 *   trigger={<Button>Pick a date</Button>}
 *   value={date}
 *   onConfirm={setDate}
 * />
 * ```
 */
function DatePickerModal(props: DatePickerModalProps) {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    trigger,
    startYear = 1900,
    endYear = 2100,
    ...rest
  } = props
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent
        showCloseButton={false}
        className="w-[360px] max-w-[calc(100%-2rem)] gap-0 overflow-hidden p-0 sm:max-w-[360px]"
      >
        <PickerBody
          mode={rest.mode ?? "single"}
          value={rest.value}
          onConfirm={(v) => {
            if (v instanceof Date) {
              if (rest.mode !== "range") rest.onConfirm?.(v)
            } else if (rest.mode === "range") {
              rest.onConfirm?.(v)
            }
          }}
          title={rest.title}
          locale={rest.locale}
          disabled={rest.disabled}
          defaultView={rest.defaultView}
          startYear={startYear}
          endYear={endYear}
          close={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

/* ---------- docked ---------- */

export type DatePickerProps = {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
  label?: string
  placeholder?: string
  locale?: string
  disabled?: boolean
  /** dates that can not be picked */
  disabledDates?: Matcher | Matcher[]
  className?: string
}

/**
 * The docked date picker: a text field you can type a date into, and a
 * calendar in a popup under it.
 */
function DatePicker({
  value,
  defaultValue,
  onValueChange,
  label = "Date",
  placeholder = "mm/dd/yyyy",
  disabled,
  disabledDates,
  className,
}: DatePickerProps) {
  const controlled = value !== undefined
  const [internal, setInternal] = React.useState(defaultValue)
  const date = controlled ? value : internal
  const [text, setText] = React.useState(formatDateInput(date))
  const [seen, setSeen] = React.useState(date)
  const [open, setOpen] = React.useState(false)
  const anchor = React.useRef<HTMLDivElement>(null)

  // the date changed from outside: show it
  if (seen?.getTime() !== date?.getTime()) {
    setSeen(date)
    setText(formatDateInput(date))
  }

  const commit = (next: Date | undefined) => {
    if (!controlled) setInternal(next)
    onValueChange?.(next)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div ref={anchor} className={cn("w-64", className)}>
        <TextField
          label={label}
          placeholder={placeholder}
          inputMode="numeric"
          disabled={disabled}
          value={text}
          error={text !== "" && !parseDateInput(text)}
          errorText="Invalid date format."
          onChange={(e) => {
            const next = e.target.value
            setText(next)
            const parsed = parseDateInput(next)
            if (parsed) commit(parsed)
            else if (next === "") commit(undefined)
          }}
          trailingIcon={
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Choose date"
                  className="text-on-surface-variant"
                />
              }
            >
              <Icon name="calendar_today" />
            </PopoverTrigger>
          }
        />
      </div>
      <PopoverContent
        anchor={anchor}
        align="start"
        sideOffset={4}
        className="w-auto gap-0 rounded-xl bg-surface-container-high p-0 shadow-elevation-3"
      >
        <Calendar
          mode="single"
          required
          selected={date}
          defaultMonth={date}
          disabled={disabledDates}
          className="p-3"
          onSelect={(next) => {
            commit(next)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker, DatePickerModal }
