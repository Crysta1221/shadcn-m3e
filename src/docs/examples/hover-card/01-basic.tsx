import { Avatar, AvatarFallback } from "@/components/m3e/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/m3e/hover-card"

export const meta = {
  title: "Rich tooltip",
}

export default function Demo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <a href="https://m3.material.io" className="text-primary underline">
            @material
          </a>
        }
      />
      <HoverCardContent className="flex gap-3">
        <Avatar>
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-title-small text-on-surface">Material Design</p>
          <p className="text-body-small text-on-surface-variant">
            Google's open-source design system.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
