import { Button } from "@/components/m3e/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogTitle,
  DialogTrigger,
} from "@/components/m3e/dialog"
import { Icon } from "@/components/m3e/icon"

export const meta = {
  title: "With an icon",
  description:
    "The icon is 24dp in the secondary color and centers the headline.",
}

export default function Demo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="tonal" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogIcon>
          <Icon name="delete" />
        </DialogIcon>
        <DialogHeader>
          <DialogTitle>Delete this draft?</DialogTitle>
          <DialogDescription>
            The draft and its attachments will be removed from every device.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="text" />}>Cancel</DialogClose>
          <DialogClose render={<Button variant="text" />}>Delete</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
