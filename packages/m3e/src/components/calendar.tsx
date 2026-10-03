"use client"

import * as React from "react"
import { cn } from "@/lib/m3e/cn"
import {
  ArrowDropDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/m3e/symbols"
import {
  DayPicker,
  getDefaultClassNames,
  type CustomComponents,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "@/components/m3e/button"

const CalendarRoot: CustomComponents["Root"] = ({
  className,
  rootRef,
  ...props
}) => (
  <div
    data-slot="calendar"
    ref={rootRef}
    className={cn(className)}
    {...props}
  />
)

const CalendarChevron: CustomComponents["Chevron"] = ({
  className,
  orientation,
  ...props
}) => {
  if (orientation === "left")
    return <ChevronLeftIcon className={cn("size-4", className)} {...props} />
  if (orientation === "right")
    return <ChevronRightIcon className={cn("size-4", className)} {...props} />
  return <ArrowDropDownIcon className={cn("size-4", className)} {...props} />
}

const CalendarWeekNumber: CustomComponents["WeekNumber"] = ({
  children,
  ...props
}) => (
  <td {...props}>
    <div className="flex size-(--cell-size) items-center justify-center text-center">
      {children}
    </div>
  </td>
)

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()
  const dayButton: CustomComponents["DayButton"] = React.useCallback(
    (dayProps: Parameters<CustomComponents["DayButton"]>[0]) => (
      <CalendarDayButton locale={locale} {...dayProps} />
    ),
    [locale]
  )

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-transparent p-3 text-on-surface [--cell-radius:9999px] [--cell-size:--spacing(10)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-38",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-38",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-label-large",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-surface-container opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "text-title-small text-on-surface-variant select-none",
          captionLayout === "label"
            ? "text-body-medium"
            : "flex items-center gap-1 rounded-(--cell-radius) text-body-medium [&>svg]:size-3.5 [&>svg]:text-on-surface-variant",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-body-large text-on-surface select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-body-small text-on-surface-variant select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative h-(--cell-size) min-w-(--cell-size) flex-1 p-0 text-center select-none",
          defaultClassNames.day
        ),
        // the band behind a range: the half of the start / end cell that faces
        // the range, the whole middle cell, rounded at the ends of a week
        range_start: cn(
          "bg-linear-to-r from-transparent from-50% to-secondary-container to-50% last:rounded-r-full has-[button[data-range-end=true]]:bg-none",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "bg-secondary-container first:rounded-l-full last:rounded-r-full",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "bg-linear-to-l from-transparent from-50% to-secondary-container to-50% first:rounded-l-full has-[button[data-range-start=true]]:bg-none",
          defaultClassNames.range_end
        ),
        today: cn(
          "text-primary [&_button:not([data-selected-single=true],[data-range-start=true],[data-range-end=true])]:border [&_button:not([data-selected-single=true],[data-range-start=true],[data-range-end=true])]:border-primary",
          defaultClassNames.today
        ),
        outside: cn(
          "text-on-surface-variant aria-selected:text-on-surface-variant",
          defaultClassNames.outside
        ),
        disabled: cn("text-on-surface opacity-38", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: dayButton,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 mx-auto flex size-(--cell-size) flex-col gap-1 border-0 text-body-large leading-none font-normal text-on-surface group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:outline-3 group-data-[focused=true]/day:outline-offset-2 group-data-[focused=true]/day:outline-secondary data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-primary data-[range-end=true]:text-on-primary data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-on-secondary-container data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-primary data-[range-start=true]:text-on-primary data-[selected-single=true]:bg-primary data-[selected-single=true]:text-on-primary [&>span]:text-body-small [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
