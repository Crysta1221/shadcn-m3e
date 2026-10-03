import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/m3e/cn"

import { Icon } from "@/components/m3e/icon"
import { NotificationBadge } from "@/components/m3e/badge"
import { Ripple } from "@/components/m3e/ripple"

/*
 * M3 Expressive navigation bar and navigation rail (Compose
 * NavigationBar / NavigationRail tokens).
 *
 *   bar   — 64dp (tall: 80dp), surface-container. Items are vertical (a
 *           56×32dp indicator over the icon, label medium below) or, on wider
 *           windows, horizontal (icon and label in a 40dp-tall pill).
 *   rail  — collapsed 96dp (narrow 80dp), items vertical; expanded 220–360dp,
 *           items horizontal in a 56dp pill. `modal` floats the expanded rail
 *           on surface-container with large corners and elevation 2.
 *
 * The active item's indicator is secondary-container and fills its icon
 * (`<Icon fill="auto" />`); it grows in on the fast spatial spring.
 */
type NavLayout = "vertical" | "horizontal"
const NavContext = React.createContext<{
  layout: NavLayout
  rail: boolean
  compact?: boolean
}>({
  layout: "vertical",
  rail: false,
})

/* ---------- item ---------- */

type NavItemProps = useRender.ComponentProps<"button"> & {
  /** Material Symbols name or a node; strings are outlined and fill while active */
  icon: React.ReactNode
  label?: React.ReactNode
  active?: boolean
  /** true = dot, number/string = counter */
  badge?: boolean | number | string
  /** override the layout inherited from the bar / rail */
  layout?: NavLayout
}

function NavItem({
  icon,
  label,
  active,
  badge,
  layout: layoutProp,
  className,
  render,
  ...props
}: NavItemProps) {
  const ctx = React.useContext(NavContext)
  const layout = layoutProp ?? ctx.layout
  const horizontal = layout === "horizontal"
  const glyph =
    typeof icon === "string" ? <Icon name={icon} fill="auto" size={24} /> : icon

  const badgeNode =
    badge != null && badge !== false ? (
      <NotificationBadge
        className={cn(
          "absolute",
          badge === true
            ? horizontal
              ? "top-0 left-3.5"
              : "top-0.5 left-9"
            : horizontal
              ? "top-0 left-3.5"
              : "top-0 left-8"
        )}
        count={badge === true ? undefined : badge}
      />
    ) : null

  const indicatorState =
    "group-data-active/nav-item:bg-secondary-container group-focus-visible/nav-item:outline-3 group-focus-visible/nav-item:outline-offset-2 group-focus-visible/nav-item:outline-secondary"

  const content = horizontal ? (
    // icon and label share one pill (bar: 40dp, rail: 56dp)
    <span
      className={cn(
        "relative flex items-center gap-2 rounded-full px-4",
        ctx.rail ? (ctx.compact ? "h-10 w-full" : "h-14 w-full") : "h-10"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden rounded-full transition-[background-color] duration-75 ease-out group-hover/nav-item:bg-on-surface/8 group-data-active/nav-item:motion-effects-fast",
          indicatorState,
          "group-data-active/nav-item:group-hover/nav-item:bg-[color-mix(in_srgb,var(--md-sys-color-on-secondary-container)_8%,var(--md-sys-color-secondary-container))]"
        )}
      >
        <Ripple />
      </span>
      <span className="relative grid place-items-center text-on-surface-variant transition-colors motion-effects-fast group-data-active/nav-item:text-on-secondary-container">
        {glyph}
        {badgeNode}
      </span>
      {label != null && (
        <span className="relative max-w-full truncate text-label-large text-on-surface-variant transition-colors motion-effects-fast group-data-active/nav-item:text-on-secondary-container">
          {label}
        </span>
      )}
    </span>
  ) : (
    // icon in a 56×32dp indicator, label below
    <>
      <span className="relative grid h-8 w-14 place-items-center text-on-surface-variant transition-colors motion-effects-fast group-data-active/nav-item:text-on-secondary-container">
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 origin-center scale-x-0 overflow-hidden rounded-full bg-secondary-container transition-transform duration-100 ease-out group-data-active/nav-item:scale-x-100 group-data-active/nav-item:motion-spatial-fast",
            indicatorState
          )}
        >
          <Ripple />
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full transition-colors motion-effects-fast group-hover/nav-item:bg-on-surface/8 group-data-active/nav-item:group-hover/nav-item:bg-transparent"
        />
        <span className="relative">{glyph}</span>
        {badgeNode}
      </span>
      {label != null && (
        <span className="max-w-full truncate text-label-medium text-on-surface-variant transition-colors motion-effects-fast group-data-active/nav-item:text-label-medium-emphasized group-data-active/nav-item:text-on-surface">
          {label}
        </span>
      )}
    </>
  )

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: "button",
        "aria-current": active ? "page" : undefined,
        className: cn(
          "group/nav-item relative flex cursor-pointer items-center outline-none select-none",
          horizontal
            ? ctx.rail
              ? "w-full justify-start"
              : "h-full min-w-0 flex-1 justify-center"
            : cn(
                "flex-col justify-center gap-1 px-1",
                ctx.rail ? "h-16 w-full" : "min-w-0 flex-1 py-1.5"
              ),
          className
        ),
        children: content,
      },
      {
        ...props,
        "data-active": active || undefined,
      } as React.ComponentProps<"button">
    ),
    render,
    state: { slot: "nav-item", active: !!active },
  })
}

/* ---------- bar ---------- */

const navigationBarVariants = cva(
  "flex w-full items-stretch bg-surface-container text-on-surface",
  {
    variants: {
      height: {
        default: "h-16",
        tall: "h-20",
      },
      elevated: { true: "shadow-elevation-2", false: "" },
    },
    defaultVariants: { height: "default", elevated: false },
  }
)

type NavigationBarProps = React.ComponentProps<"nav"> &
  VariantProps<typeof navigationBarVariants> & {
    /** horizontal items (icon beside label) for medium windows */
    layout?: NavLayout
  }

function NavigationBar({
  className,
  height,
  elevated,
  layout = "vertical",
  ...props
}: NavigationBarProps) {
  return (
    <NavContext.Provider value={{ layout, rail: false }}>
      <nav
        data-slot="navigation-bar"
        data-layout={layout}
        className={cn(
          navigationBarVariants({ height, elevated }),
          layout === "horizontal" && "items-center gap-2 px-2",
          className
        )}
        {...props}
      />
    </NavContext.Provider>
  )
}

function NavigationBarItem(props: NavItemProps) {
  return <NavItem {...props} />
}

/* ---------- rail ---------- */

type NavigationRailProps = React.ComponentProps<"nav"> & {
  /** 220–360dp with horizontal items */
  expanded?: boolean
  /** 80dp instead of 96dp when collapsed */
  narrow?: boolean
  /** expanded rail floating over content */
  modal?: boolean
  /** 40dp items, for long lists (documentation, settings) */
  compact?: boolean
}

function NavigationRail({
  className,
  expanded,
  narrow,
  modal,
  compact,
  ...props
}: NavigationRailProps) {
  return (
    <NavContext.Provider
      value={{
        layout: expanded ? "horizontal" : "vertical",
        rail: true,
        compact,
      }}
    >
      <nav
        data-slot="navigation-rail"
        data-expanded={expanded || undefined}
        className={cn(
          "flex h-full shrink-0 scrollbar-thin flex-col gap-1 overflow-x-hidden overflow-y-auto pt-11 pb-4 transition-[width] motion-spatial-default",
          expanded
            ? "w-[220px] items-stretch px-4"
            : narrow
              ? "w-20 items-center"
              : "w-24 items-center",
          modal && expanded
            ? "rounded-r-lg bg-surface-container shadow-elevation-2"
            : "bg-surface",
          className
        )}
        {...props}
      />
    </NavContext.Provider>
  )
}

/** a menu button / FAB area above the items */
function NavigationRailHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-rail-header"
      className={cn(
        "flex flex-col gap-3 pb-6 group-data-expanded:items-stretch",
        "in-data-[expanded]:items-start",
        className
      )}
      {...props}
    />
  )
}

function NavigationRailItem(props: NavItemProps) {
  return <NavItem {...props} />
}

function NavigationRailSection({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-rail-section"
      className={cn(
        "hidden px-4 pt-4 pb-2 text-title-small text-on-surface-variant in-data-[expanded]:block",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  NavigationBar,
  NavigationBarItem,
  NavigationRail,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationRailSection,
  navigationBarVariants,
}
