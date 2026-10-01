import { AspectRatio } from "@/components/m3e/aspect-ratio"

export const meta = {
  title: "16:9",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="w-72">
      <AspectRatio ratio={16 / 9}>
        <div className="flex size-full items-center justify-center rounded-lg bg-tertiary-container text-title-large text-on-tertiary-container">
          16:9
        </div>
      </AspectRatio>
    </div>
  )
}
