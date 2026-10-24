import { Slider } from "@/components/m3e/slider"

export const meta = {
  title: "Value and range",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <Slider defaultValue={[40]} aria-label="Volume" />
      <Slider
        defaultValue={[20, 70]}
        getAriaLabel={(index) =>
          index === 0 ? "Minimum price" : "Maximum price"
        }
      />
      <Slider defaultValue={[60]} disabled aria-label="Unavailable volume" />
    </div>
  )
}
