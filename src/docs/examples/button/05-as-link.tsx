import { Button } from "@/components/m3e/button"

export const meta = {
  title: "As a link",
  description:
    "Render any element; set nativeButton={false} when it is not a <button>.",
}

export default function Demo() {
  return (
    <Button
      variant="tonal"
      render={
        <a href="https://m3.material.io" target="_blank" rel="noreferrer">
          Material Design
        </a>
      }
      nativeButton={false}
    />
  )
}
