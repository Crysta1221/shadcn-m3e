import { Marker, MarkerContent } from "@/components/m3e/marker"

export const meta = {
  title: "Separator",
  layout: "block",
}

export default function Demo() {
  return (
    <Marker variant="separator" className="max-w-sm">
      <MarkerContent>Today</MarkerContent>
    </Marker>
  )
}
