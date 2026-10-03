import { AppBar } from "@/components/m3e/app-bar"
import { Button } from "@/components/m3e/button"
import { Fab } from "@/components/m3e/fab"
import { Icon } from "@/components/m3e/icon"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/m3e/item"
import { NavigationBar, NavigationBarItem } from "@/components/m3e/navigation"

export const meta = {
  title: "Phone screen",
  description:
    "The pieces of a mobile screen at 360px: a top app bar, a list, a floating action button, and a navigation bar at the bottom.",
  frame: 600,
  uses: ["app-bar", "item", "fab", "navigation-bar"],
}

const TRIPS = [
  ["Kyoto", "Mar 12 – 18", "flight"],
  ["Lisbon", "Jun 2 – 9", "flight"],
  ["Hakone", "Aug 21 – 22", "directions_train"],
  ["Reykjavik", "Nov 3 – 10", "flight"],
]

export default function Demo() {
  return (
    <div className="relative mx-auto flex h-full w-[360px] flex-col border-x border-outline-variant bg-surface">
      <AppBar
        title="Trips"
        leading={
          <Button variant="text" size="icon" aria-label="Menu">
            <Icon name="menu" />
          </Button>
        }
        trailing={
          <Button variant="text" size="icon" aria-label="Search">
            <Icon name="search" />
          </Button>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <ItemGroup>
          {TRIPS.map(([place, dates, icon]) => (
            <Item
              key={place}
              variant="segmented"
              // oxlint-disable-next-line jsx-a11y/control-has-associated-label -- Item children fill the button via `render`
              render={<button type="button" />}
            >
              <ItemMedia>
                <Icon name={icon} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{place}</ItemTitle>
                <ItemDescription>{dates}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </div>
      <Fab aria-label="New trip" className="absolute right-4 bottom-24">
        <Icon name="add" />
      </Fab>
      <NavigationBar>
        <NavigationBarItem icon="explore" label="Explore" />
        <NavigationBarItem icon="luggage" label="Trips" active />
        <NavigationBarItem icon="bookmark" label="Saved" />
      </NavigationBar>
    </div>
  )
}
