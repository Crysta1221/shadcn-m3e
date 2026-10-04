import { Button } from "@/components/m3e/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/m3e/dialog"

export const meta = {
  title: "Scrolling content",
  description:
    "A divider appears on each edge of the body that has more behind it.",
}

const terms = Array.from(
  { length: 12 },
  (_, i) =>
    `${i + 1}. The service is provided as is, and these terms may change; continuing to use it means you accept the current version.`
)

export default function Demo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="tonal" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="max-h-96">
        <DialogHeader>
          <DialogTitle>Terms of service</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription className="flex flex-col gap-3 py-3">
            {terms.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </DialogDescription>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="text" />}>Decline</DialogClose>
          <DialogClose render={<Button variant="text" />}>Accept</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
