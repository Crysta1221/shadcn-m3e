import { CircularProgress } from "@/components/m3e/circular-progress"

export const meta = {
  title: "Flat and wavy",
}

export default function Demo() {
  return (
    <>
      <CircularProgress value={70} />
      <CircularProgress value={70} variant="wavy" />
      <CircularProgress />
      <CircularProgress variant="wavy" />
    </>
  )
}
