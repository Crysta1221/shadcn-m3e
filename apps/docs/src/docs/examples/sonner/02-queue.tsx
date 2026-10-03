import { Button } from "@/components/m3e/button"
import { toast } from "@/components/m3e/sonner"

export const meta = {
  title: "One at a time",
  description:
    "Snackbars never stack: the next one waits until the current one has left. Reuse an id to update a snackbar in place instead of queueing another.",
}

export default function Demo() {
  return (
    <>
      <Button
        variant="tonal"
        onClick={() => {
          toast("Photo uploaded")
          toast("Link copied")
          toast("Saved to drafts")
        }}
      >
        Queue three
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          const id = toast("Uploading 0%", { id: "upload", duration: Infinity })
          let n = 0
          const timer = setInterval(() => {
            n += 25
            if (n >= 100) {
              clearInterval(timer)
              toast("Upload complete", { id })
            } else {
              toast(`Uploading ${n}%`, { id, duration: Infinity })
            }
          }, 600)
        }}
      >
        Update in place
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          toast.promise(new Promise((r) => setTimeout(r, 1800)), {
            loading: "Saving…",
            success: "Saved",
            error: "Couldn't save",
          })
        }
      >
        Promise
      </Button>
    </>
  )
}
