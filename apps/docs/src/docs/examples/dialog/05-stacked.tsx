import { Button } from "@/components/m3e/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/m3e/dialog"

export const meta = {
  title: "Stacked actions",
  description:
    "For long labels. The confirming action is on top, the dismissing one under it.",
}

export default function Demo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="tonal" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Use location services?</DialogTitle>
          <DialogDescription>
            Let apps use your location, even when none of them is running.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter stacked>
          <DialogClose render={<Button variant="text" />}>
            Keep location services off
          </DialogClose>
          <DialogClose render={<Button variant="text" />}>
            Turn on location services
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
