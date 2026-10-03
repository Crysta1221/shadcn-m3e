import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/m3e/empty"

export const meta = {
  title: "Empty state",
  layout: "block",
}

export default function Demo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon name="inbox" />
        </EmptyMedia>
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>New messages will show up here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="tonal">Compose</Button>
      </EmptyContent>
    </Empty>
  )
}
