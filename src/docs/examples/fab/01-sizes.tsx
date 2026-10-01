import { Icon } from "@/components/m3e/icon"
import { Fab } from "@/components/m3e/fab"

export const meta = {
  title: "Sizes and colors",
}

export default function Demo() {
  return (
    <>
      <Fab size="sm" aria-label="Add">
        <Icon name="add" />
      </Fab>
      <Fab aria-label="Add">
        <Icon name="add" />
      </Fab>
      <Fab size="md" color="secondary-container" aria-label="Edit">
        <Icon name="edit" size={28} />
      </Fab>
      <Fab size="lg" color="tertiary-container" aria-label="Navigate">
        <Icon name="navigation" size={32} />
      </Fab>
      <Fab color="primary" aria-label="Add">
        <Icon name="add" />
      </Fab>
    </>
  )
}
