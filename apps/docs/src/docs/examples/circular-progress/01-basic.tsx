import { CircularProgress } from "@/components/m3e/circular-progress"

export const meta = {
  title: "Flat and wavy",
}

export default function Demo() {
  return (
    <>
      <CircularProgress aria-label="Example progress" value={70} />
      <CircularProgress
        aria-label="Example progress"
        value={70}
        variant="wavy"
      />
      <CircularProgress aria-label="Example progress" />
      <CircularProgress aria-label="Example progress" variant="wavy" />
    </>
  )
}
