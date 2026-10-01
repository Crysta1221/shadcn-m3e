import { Button } from "@/components/m3e/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/m3e/sheet"

export const meta = {
  title: "Sides",
  description: "A side sheet from the right, and a bottom sheet.",
}

export default function Demo() {
  return (
    <>
      {(["right", "bottom"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger
            render={<Button variant="tonal" className="capitalize" />}
          >
            {side} sheet
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Narrow down the results.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </>
  )
}
