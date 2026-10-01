import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/m3e/card"

export const meta = {
  title: "Interactive",
  description: "Hover, focus and press feedback for clickable cards.",
}

export default function Demo() {
  return (
    <Card variant="elevated" interactive tabIndex={0} className="w-64">
      <CardHeader>
        <CardTitle>Clickable</CardTitle>
        <CardDescription>Try hovering me.</CardDescription>
      </CardHeader>
    </Card>
  )
}
