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
  title: "Basic dialog",
}

export default function Demo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="tonal" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Reset settings?</DialogTitle>
          <DialogDescription>
            This will reset your app preferences back to their default settings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="text" />}>Cancel</DialogClose>
          <DialogClose render={<Button variant="text" />}>Accept</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
