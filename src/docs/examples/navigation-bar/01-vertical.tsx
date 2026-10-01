import { NavigationBar, NavigationBarItem } from "@/components/m3e/navigation"

export const meta = {
  title: "Vertical items",
  description: "A dot badge on Search and a counter on Mail.",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="max-w-md overflow-hidden rounded-lg border border-outline-variant">
      <NavigationBar>
        <NavigationBarItem icon="home" label="Home" active />
        <NavigationBarItem icon="search" label="Search" badge />
        <NavigationBarItem icon="mail" label="Mail" badge={12} />
        <NavigationBarItem icon="person" label="Profile" />
      </NavigationBar>
    </div>
  )
}
