import { Icon } from "@/components/m3e/icon"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/m3e/item"

export const meta = {
  title: "Segmented list",
  description: "Hover or press a row to see its corners round up.",
  layout: "block",
}

export default function Demo() {
  return (
    <ItemGroup className="max-w-md">
      {[
        ["inbox", "Inbox", "12 new messages"],
        ["star", "Starred", "3 items"],
        ["send", "Sent", "Last sent today"],
      ].map(([icon, title, text]) => (
        // oxlint-disable-next-line jsx-a11y/control-has-associated-label -- Item children fill the button via `render`
        <Item key={title} variant="segmented" render={<button type="button" />}>
          <ItemMedia>
            <Icon name={icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <ItemDescription>{text}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}
