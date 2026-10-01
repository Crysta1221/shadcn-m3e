import { Bubble, BubbleContent, BubbleGroup } from "@/components/m3e/bubble"

export const meta = {
  title: "Variants",
  layout: "block",
}

export default function Demo() {
  return (
    <BubbleGroup className="max-w-sm">
      {(["default", "secondary", "muted", "tinted", "outline"] as const).map(
        (v) => (
          <Bubble key={v} variant={v}>
            <BubbleContent className="capitalize">{v}</BubbleContent>
          </Bubble>
        )
      )}
    </BubbleGroup>
  )
}
