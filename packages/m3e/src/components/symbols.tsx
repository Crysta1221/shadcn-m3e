/*
 * The Material Symbols Rounded glyphs the components use internally, from the
 * bundled icon data (see icon-registry.ts). They render as <svg>, so container
 * rules such as [&_svg]:size-5 size them.
 */
import { Icon, type IconProps } from "@iconify/react/offline"

import { warnIfMissing } from "./icon-registry"

type SymbolProps = Omit<IconProps, "icon">

function symbol(icon: string) {
  warnIfMissing(`material-symbols:${icon}`)
  const Component = (props: SymbolProps) => (
    <Icon
      icon={`material-symbols:${icon}`}
      aria-hidden
      data-icon={icon}
      {...props}
    />
  )
  Component.displayName = icon
  return Component
}

export const ArrowDownwardIcon = symbol("arrow-downward-rounded")
export const ArrowDropDownIcon = symbol("arrow-drop-down-rounded")
export const CancelIcon = symbol("cancel-outline-rounded")
export const CheckCircleIcon = symbol("check-circle-outline-rounded")
export const CheckIcon = symbol("check-rounded")
export const ChevronLeftIcon = symbol("chevron-left-rounded")
export const ChevronRightIcon = symbol("chevron-right-rounded")
export const CloseIcon = symbol("close-rounded")
export const InfoIcon = symbol("info-outline-rounded")
export const KeyboardArrowDownIcon = symbol("keyboard-arrow-down-rounded")
export const KeyboardArrowUpIcon = symbol("keyboard-arrow-up-rounded")
export const MenuIcon = symbol("menu-rounded")
export const MoreHorizIcon = symbol("more-horiz")
export const ProgressActivityIcon = symbol("progress-activity")
export const RemoveIcon = symbol("remove-rounded")
export const SearchIcon = symbol("search-rounded")
export const WarningIcon = symbol("warning-outline-rounded")
