import { Button } from "@/components/m3e/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/m3e/sheet"
import { TextField } from "@/components/m3e/text-field"

export const meta = {
  title: "Modal",
  description:
    "Covers the content with a scrim and blocks it until it is closed. It is the Sheet component.",
}

export default function Demo() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="tonal" />}>
        Edit profile
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Changes are saved when you press Save.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-6">
          <TextField label="Name" defaultValue="Ada Lovelace" />
          <TextField label="Email" defaultValue="ada@example.com" />
        </div>
        <SheetFooter>
          <SheetClose render={<Button />}>Save</SheetClose>
          <SheetClose render={<Button variant="outlined" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
