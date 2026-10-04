import { Button } from "@/components/m3e/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTopBar,
  DialogTrigger,
} from "@/components/m3e/dialog"
import { Icon } from "@/components/m3e/icon"
import { TextField } from "@/components/m3e/text-field"

export const meta = {
  title: "Full-screen dialog",
  description:
    "A 56dp header with the close icon, the headline and a text button. For tasks that need the whole screen, on compact windows.",
}

export default function Demo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="tonal" />}>
        Open full-screen dialog
      </DialogTrigger>
      <DialogContent variant="fullscreen">
        <DialogTopBar divider>
          <DialogClose
            render={<Button variant="text" size="icon" aria-label="Close" />}
          >
            <Icon name="close" />
          </DialogClose>
          <DialogTitle>New event</DialogTitle>
          <DialogClose render={<Button variant="text" />}>Save</DialogClose>
        </DialogTopBar>
        <DialogBody className="flex flex-col gap-4">
          <TextField label="Title" />
          <TextField
            label="Location"
            leadingIcon={<Icon name="location_on" />}
          />
          <TextField label="Notes" multiline />
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
