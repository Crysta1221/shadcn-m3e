import { ToggleGroup, ToggleGroupItem } from "@/components/m3e/toggle-group"

export const meta = {
  title: "Connected",
  description: "spacing={0}. The selected item turns fully round.",
}

export default function Demo() {
  return (
    <ToggleGroup spacing={0} defaultValue={["week"]}>
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="year">Year</ToggleGroupItem>
    </ToggleGroup>
  )
}
