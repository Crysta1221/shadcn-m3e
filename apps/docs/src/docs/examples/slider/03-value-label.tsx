import { Slider } from "@/components/m3e/slider"
import { DirectionProvider } from "@base-ui/react/direction-provider"

export const meta = {
  title: "Value labels",
  description:
    "Drag or focus a handle to show its value. Escape dismisses the label.",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex max-w-md flex-col gap-8 py-4">
      <Slider
        defaultValue={[20, 70]}
        showValueLabel
        getAriaLabel={(index) =>
          index === 0 ? "Minimum price" : "Maximum price"
        }
        format={{
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }}
        locale="en-US"
      />
      <div className="flex h-48 justify-center">
        <Slider
          defaultValue={0.5}
          min={0}
          max={1}
          step={0.1}
          orientation="vertical"
          showValueLabel
          aria-label="Brightness"
          format={{ style: "percent" }}
        />
      </div>
      <DirectionProvider direction="rtl">
        <div dir="rtl">
          <Slider aria-label="RTL progress" defaultValue={25} showValueLabel />
        </div>
      </DirectionProvider>
    </div>
  )
}
