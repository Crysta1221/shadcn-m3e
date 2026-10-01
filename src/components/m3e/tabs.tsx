"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/m3e/cn"

import { Ripple } from "@/components/m3e/ripple"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-4 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

/*
 * M3 tabs.
 *  default / primary: 3dp indicator under the label, active label in primary
 *  secondary / line:  2dp full-width indicator, active label in on-surface
 *  segmented:         M3E pill that slides between segments
 * The indicator is Base UI's Tabs.Indicator, moved by the spatial spring.
 */
const tabsListVariants = cva(
  "group/tabs-list relative inline-flex items-center text-on-surface-variant group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:items-stretch",
  {
    variants: {
      variant: {
        default:
          "w-full border-outline-variant group-data-horizontal/tabs:h-12 group-data-horizontal/tabs:border-b group-data-vertical/tabs:border-r",
        primary:
          "w-full border-outline-variant group-data-horizontal/tabs:h-12 group-data-horizontal/tabs:border-b group-data-vertical/tabs:border-r",
        secondary:
          "w-full border-outline-variant group-data-horizontal/tabs:h-12 group-data-horizontal/tabs:border-b group-data-vertical/tabs:border-r",
        line: "w-full border-outline-variant group-data-horizontal/tabs:h-12 group-data-horizontal/tabs:border-b group-data-vertical/tabs:border-r",
        segmented:
          "w-fit gap-0.5 rounded-full bg-surface-container p-1 group-data-horizontal/tabs:h-12 group-data-vertical/tabs:rounded-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  children,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      {children}
      <TabsIndicator />
    </TabsPrimitive.List>
  )
}

function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "pointer-events-none absolute z-0 transition-[left,width,top,height] duration-(--md-sys-motion-spring-default-spatial-duration) ease-spatial-default",
        // primary: under the label, 3dp, rounded top
        "group-data-[variant=default]/tabs-list:bg-primary group-data-[variant=primary]/tabs-list:bg-primary",
        "group-data-horizontal/tabs:group-data-[variant=default]/tabs-list:bottom-0 group-data-horizontal/tabs:group-data-[variant=default]/tabs-list:left-[calc(var(--active-tab-left)+16px)] group-data-horizontal/tabs:group-data-[variant=default]/tabs-list:h-[3px] group-data-horizontal/tabs:group-data-[variant=default]/tabs-list:w-[max(24px,calc(var(--active-tab-width)-32px))] group-data-horizontal/tabs:group-data-[variant=default]/tabs-list:rounded-t-[3px]",
        "group-data-horizontal/tabs:group-data-[variant=primary]/tabs-list:bottom-0 group-data-horizontal/tabs:group-data-[variant=primary]/tabs-list:left-[calc(var(--active-tab-left)+16px)] group-data-horizontal/tabs:group-data-[variant=primary]/tabs-list:h-[3px] group-data-horizontal/tabs:group-data-[variant=primary]/tabs-list:w-[max(24px,calc(var(--active-tab-width)-32px))] group-data-horizontal/tabs:group-data-[variant=primary]/tabs-list:rounded-t-[3px]",
        // secondary / line: full tab width, 2dp
        "group-data-[variant=line]/tabs-list:bg-primary group-data-[variant=secondary]/tabs-list:bg-primary",
        "group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:bottom-0 group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:left-(--active-tab-left) group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:h-0.5 group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:w-(--active-tab-width)",
        "group-data-horizontal/tabs:group-data-[variant=secondary]/tabs-list:bottom-0 group-data-horizontal/tabs:group-data-[variant=secondary]/tabs-list:left-(--active-tab-left) group-data-horizontal/tabs:group-data-[variant=secondary]/tabs-list:h-0.5 group-data-horizontal/tabs:group-data-[variant=secondary]/tabs-list:w-(--active-tab-width)",
        // vertical underline variants sit on the trailing edge
        "group-data-vertical/tabs:not-group-data-[variant=segmented]/tabs-list:top-(--active-tab-top) group-data-vertical/tabs:not-group-data-[variant=segmented]/tabs-list:right-0 group-data-vertical/tabs:not-group-data-[variant=segmented]/tabs-list:h-(--active-tab-height) group-data-vertical/tabs:not-group-data-[variant=segmented]/tabs-list:w-[3px] group-data-vertical/tabs:not-group-data-[variant=segmented]/tabs-list:rounded-l-[3px]",
        // segmented: a pill behind the active segment
        "group-data-[variant=segmented]/tabs-list:top-(--active-tab-top) group-data-[variant=segmented]/tabs-list:left-(--active-tab-left) group-data-[variant=segmented]/tabs-list:h-(--active-tab-height) group-data-[variant=segmented]/tabs-list:w-(--active-tab-width) group-data-[variant=segmented]/tabs-list:rounded-full group-data-[variant=segmented]/tabs-list:bg-secondary-container",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  children,
  ...props
}: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "state-layer relative z-1 inline-flex h-full flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden px-4 text-title-small whitespace-nowrap text-on-surface-variant focus-ring-inset transition-shape select-none disabled:pointer-events-none disabled:opacity-38 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        "group-data-vertical/tabs:min-h-12 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",
        "group-data-[variant=default]/tabs-list:data-active:text-primary group-data-[variant=primary]/tabs-list:data-active:text-primary",
        "group-data-[variant=line]/tabs-list:data-active:text-on-surface group-data-[variant=secondary]/tabs-list:data-active:text-on-surface",
        "group-data-[variant=segmented]/tabs-list:rounded-full group-data-[variant=segmented]/tabs-list:text-label-large group-data-[variant=segmented]/tabs-list:data-active:text-on-secondary-container",
        className
      )}
      {...props}
    >
      <Ripple />
      {children}
    </TabsPrimitive.Tab>
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-body-medium outline-none", className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
  tabsListVariants,
}
