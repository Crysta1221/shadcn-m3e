import type * as React from "react"

import { Button } from "@/components/m3e/button"
import {
  useColorMode,
  type ColorMode,
} from "@/components/m3e/color-mode-provider"
import { Icon } from "@/components/m3e/icon"

const MODES: { mode: ColorMode; icon: React.ReactNode }[] = [
  { mode: "light", icon: <Icon name="light_mode" /> },
  { mode: "dark", icon: <Icon name="dark_mode" /> },
  { mode: "system", icon: <Icon name="contrast" /> },
]

export const meta = {
  title: "Light and dark",
  description:
    "useColorMode() is separate from the color theme: it only decides light or dark. mode is what the user chose, resolvedMode is what is on screen.",
}

export default function Demo() {
  const { mode, resolvedMode, setMode, toggleMode } = useColorMode()

  return (
    <>
      {MODES.map((m) => (
        <Button
          key={m.mode}
          variant={mode === m.mode ? "filled" : "outlined"}
          onClick={() => setMode(m.mode)}
        >
          {m.icon}
          {m.mode}
        </Button>
      ))}
      <Button variant="text" onClick={toggleMode}>
        Toggle (now {resolvedMode})
      </Button>
    </>
  )
}
