import { Icon } from "@/components/m3e/icon"
import { ExtendedFab, Fab } from "@/components/m3e/fab"
import {
  NavigationRail,
  NavigationRailHeader,
  NavigationRailItem,
} from "@/components/m3e/navigation"

export const meta = {
  title: "Collapsed and expanded",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex h-96 gap-4">
      <div className="overflow-hidden rounded-lg border border-outline-variant">
        <NavigationRail>
          <NavigationRailHeader>
            <Fab aria-label="Compose">
              <Icon name="edit" />
            </Fab>
          </NavigationRailHeader>
          <NavigationRailItem icon="home" label="Home" active />
          <NavigationRailItem icon="chat" label="Chat" badge={3} />
          <NavigationRailItem icon="settings" label="Settings" />
        </NavigationRail>
      </div>
      <div className="overflow-hidden rounded-lg border border-outline-variant">
        <NavigationRail expanded>
          <NavigationRailHeader>
            <ExtendedFab icon={<Icon name="edit" />}>Compose</ExtendedFab>
          </NavigationRailHeader>
          <NavigationRailItem icon="home" label="Home" active />
          <NavigationRailItem icon="chat" label="Chat" badge={3} />
          <NavigationRailItem icon="settings" label="Settings" />
        </NavigationRail>
      </div>
    </div>
  )
}
