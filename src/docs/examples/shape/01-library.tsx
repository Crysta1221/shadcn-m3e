import { Shape, SHAPE_NAMES } from "@/components/m3e/shape"

export const meta = {
  title: "Shape library",
  description: "All 35 shapes from the Material shape library.",
  layout: "block",
}

export default function Demo() {
  return (
    <ul className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-5 md:grid-cols-7">
      {SHAPE_NAMES.map((name) => (
        <li key={name} className="flex flex-col items-center gap-1 text-center">
          <Shape name={name} />
          <span className="text-label-small text-on-surface-variant">
            {name}
          </span>
        </li>
      ))}
    </ul>
  )
}
