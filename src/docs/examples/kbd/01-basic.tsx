import { Kbd, KbdGroup } from "@/components/m3e/kbd"

export const meta = {
  title: "Keys",
}

export default function Demo() {
  return (
    <>
      <Kbd>⌘</Kbd>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </>
  )
}
