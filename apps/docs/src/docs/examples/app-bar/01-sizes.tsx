import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { AppBar } from "@/components/m3e/app-bar"

export const meta = {
  title: "Small, medium and large",
  layout: "block",
}

export default function Demo() {
  const back = (
    <Button variant="text" size="icon" aria-label="Back">
      <Icon name="arrow_back" />
    </Button>
  )
  const more = (
    <Button variant="text" size="icon" aria-label="More">
      <Icon name="more_vert" />
    </Button>
  )
  return (
    <div className="flex max-w-lg flex-col gap-4">
      <AppBar title="Inbox" leading={back} trailing={more} />
      <AppBar
        size="medium"
        title="Medium title"
        subtitle="Subtitle"
        leading={back}
        trailing={more}
      />
      <AppBar size="large" title="Large title" leading={back} trailing={more} />
    </div>
  )
}
