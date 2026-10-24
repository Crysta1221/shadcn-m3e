import { Avatar, AvatarFallback } from "@/components/m3e/avatar"
import { Fab } from "@/components/m3e/fab"
import { Icon } from "@/components/m3e/icon"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/m3e/item"
import {
  NavigationRail,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationBar,
  NavigationBarItem,
} from "@/components/m3e/navigation"
import { SearchBar } from "@/components/m3e/search"

export const meta = {
  title: "Inbox",
  description:
    "A navigation rail with the compose button in its header, a search bar, and a list of messages.",
  frame: 520,
  uses: ["navigation-rail", "fab", "search", "item", "avatar"],
}

const MAIL = [
  ["Aiko Tanaka", "Lunch on Friday?", "Are you free around noon?", "9:41"],
  [
    "Design review",
    "Notes from today",
    "Three decisions and two open questions.",
    "8:05",
  ],
  ["Ken Ito", "Re: Invoice 1042", "Thanks, paid this morning.", "Mon"],
  ["Mika Sato", "Trip photos", "Uploaded the whole album.", "Sun"],
  ["Build bot", "Release 0.4 is live", "All checks passed.", "Sat"],
]

export default function Demo() {
  return (
    <div className="@container/inbox h-full">
      <div className="relative flex h-full flex-col @xl/inbox:flex-row">
        <NavigationRail className="hidden bg-surface-container-low @xl/inbox:flex">
          <NavigationRailHeader>
            <Fab aria-label="Compose">
              <Icon name="edit" />
            </Fab>
          </NavigationRailHeader>
          <NavigationRailItem icon="inbox" label="Inbox" badge={3} active />
          <NavigationRailItem icon="star" label="Starred" />
          <NavigationRailItem icon="send" label="Sent" />
          <NavigationRailItem icon="delete" label="Trash" />
        </NavigationRail>
        <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
          <SearchBar placeholder="Search mail" />
          <ItemGroup>
            {MAIL.map(([from, subject, preview, time]) => (
              <Item
                key={subject}
                variant="segmented"
                // oxlint-disable-next-line jsx-a11y/control-has-associated-label -- Item children fill the button via `render`
                render={<button type="button" />}
              >
                <ItemMedia>
                  <Avatar>
                    <AvatarFallback>{from[0]}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{from}</ItemTitle>
                  <ItemDescription>
                    {subject} — {preview}
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="text-label-small text-on-surface-variant">
                  {time}
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </div>
        <Fab
          aria-label="Compose"
          className="absolute right-4 bottom-20 @xl/inbox:hidden"
        >
          <Icon name="edit" />
        </Fab>
        <NavigationBar className="shrink-0 @xl/inbox:hidden">
          <NavigationBarItem icon="inbox" label="Inbox" active />
          <NavigationBarItem icon="star" label="Starred" />
          <NavigationBarItem icon="send" label="Sent" />
          <NavigationBarItem icon="delete" label="Trash" />
        </NavigationBar>
      </div>
    </div>
  )
}
