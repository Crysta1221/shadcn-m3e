import { Button } from "@/components/m3e/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/m3e/drawer"

export const meta = {
  title: "Bottom sheet",
  description: "Drag it down to dismiss.",
}

export default function Demo() {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant="tonal" />}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share</DrawerTitle>
          <DrawerDescription>Choose where to send this.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose render={<Button variant="text" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
