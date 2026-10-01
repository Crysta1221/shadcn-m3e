import * as React from "react"

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
import { useImageTheme } from "@/components/m3e/use-image-theme"
import { SAMPLE_IMAGES } from "@/docs/sample-images"

export const meta = {
  title: "From an image in a dialog",
  description:
    "Pass the <img> you are already showing: no copy, no conversion. The dialog shows the picture and applyImage(imgRef.current) reads its colors.",
}

export default function Demo() {
  const { applyImage, loading } = useImageTheme()
  const [open, setOpen] = React.useState(false)
  const img = React.useRef<HTMLImageElement>(null)
  const picture = SAMPLE_IMAGES[0]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="tonal" />}>
        Open picture
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{picture.name}</DialogTitle>
          <DialogDescription>
            Use the colors of this picture for the whole site?
          </DialogDescription>
        </DialogHeader>
        <img
          ref={img}
          src={picture.src}
          alt={picture.name}
          className="w-full rounded-lg"
        />
        <DialogFooter>
          <DialogClose render={<Button variant="text" />}>Cancel</DialogClose>
          <Button
            variant="text"
            disabled={loading}
            onClick={async () => {
              if (img.current && (await applyImage(img.current))) setOpen(false)
            }}
          >
            Use colors
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
