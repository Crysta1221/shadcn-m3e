import { Progress } from "@/components/m3e/progress"

export const meta = {
  title: "Flat and wavy",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Progress value={60} />
      <Progress value={60} variant="wavy" />
      <Progress value={60} thickness={8} />
      <Progress value={60} variant="wavy" thickness={8} />
      <Progress value={null} />
      <Progress value={null} variant="wavy" />
    </div>
  )
}
