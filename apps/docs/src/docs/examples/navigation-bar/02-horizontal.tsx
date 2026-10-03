import { NavigationBar, NavigationBarItem } from "@/components/m3e/navigation"

export const meta = {
  title: "Horizontal items",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="max-w-lg overflow-hidden rounded-lg border border-outline-variant">
      <NavigationBar layout="horizontal">
        <NavigationBarItem icon="home" label="Home" active />
        <NavigationBarItem icon="favorite" label="Saved" />
        <NavigationBarItem icon="settings" label="Settings" />
      </NavigationBar>
    </div>
  )
}
