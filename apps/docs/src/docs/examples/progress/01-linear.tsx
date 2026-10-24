import { Progress } from "@/components/m3e/progress"

export const meta = {
  title: "Flat and wavy",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Progress aria-label="Example progress" value={60} />
      <Progress aria-label="Example progress" value={60} variant="wavy" />
      <Progress aria-label="Example progress" value={60} thickness={8} />
      <Progress
        aria-label="Example progress"
        value={60}
        variant="wavy"
        thickness={8}
      />
      <Progress aria-label="Example progress" value={null} />
      <Progress aria-label="Example progress" value={null} variant="wavy" />
    </div>
  )
}
