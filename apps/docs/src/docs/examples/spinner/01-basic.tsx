import { Spinner } from "@/components/m3e/spinner"

export const meta = {
  title: "Sizes",
}

export default function Demo() {
  return (
    <>
      <Spinner />
      <Spinner className="size-8" />
      <Spinner className="size-12 text-tertiary" />
    </>
  )
}
