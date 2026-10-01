import { Button } from "@/components/m3e/button"
import { M3ThemeScope } from "@/components/m3e/m3-theme-scope"

const SEEDS = ["#00796B", "#E65100", "#5E35B1"]

export const meta = {
  title: "A scope",
  description:
    "M3ThemeScope gives a subtree its own scheme, whatever the page theme is. Light and dark still follow the page.",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {SEEDS.map((seed) => (
        <M3ThemeScope
          key={seed}
          source={{ primary: seed }}
          className="flex flex-col gap-3 rounded-lg bg-primary-container p-4 text-on-primary-container"
        >
          <p className="text-title-medium">{seed}</p>
          <p className="text-body-medium">
            Buttons inside pick up the scope&apos;s colors.
          </p>
          <div className="flex gap-2">
            <Button size="sm">Filled</Button>
            <Button size="sm" variant="tonal">
              Tonal
            </Button>
          </div>
        </M3ThemeScope>
      ))}
    </div>
  )
}
