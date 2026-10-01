import { Icon } from "@/components/m3e/icon"

export const meta = {
  title: "Outlined, filled and sizes",
}

export default function Demo() {
  return (
    <>
      <Icon name="favorite" />
      <Icon name="favorite" fill />
      <Icon name="home" size={32} />
      <Icon name="settings" size={48} className="text-primary" />
    </>
  )
}
