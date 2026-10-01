import { Icon } from "@/components/m3e/icon"
import {
  FabMenu,
  FabMenuContent,
  FabMenuItem,
  FabMenuTrigger,
} from "@/components/m3e/fab-menu"

export const meta = {
  title: "FAB menu",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex min-h-64 items-end justify-end">
      <FabMenu>
        <FabMenuContent>
          <FabMenuItem icon={<Icon name="mail" />}>Mail</FabMenuItem>
          <FabMenuItem icon={<Icon name="event" />}>Event</FabMenuItem>
          <FabMenuItem icon={<Icon name="task_alt" />}>Task</FabMenuItem>
        </FabMenuContent>
        <FabMenuTrigger />
      </FabMenu>
    </div>
  )
}
