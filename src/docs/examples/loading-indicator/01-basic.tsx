import { LoadingIndicator } from "@/components/m3e/loading-indicator"

export const meta = {
  title: "Default and contained",
}

export default function Demo() {
  return (
    <>
      <LoadingIndicator />
      <LoadingIndicator variant="contained" />
      <LoadingIndicator size={96} />
    </>
  )
}
