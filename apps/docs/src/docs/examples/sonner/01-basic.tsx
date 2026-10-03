import { Button } from "@/components/m3e/button"
import { toast } from "@/components/m3e/sonner"

export const meta = {
  title: "Snackbars",
  description:
    "Add <Toaster /> from @/components/m3e/sonner once near the root, then call toast() from the same module.",
}

export default function Demo() {
  return (
    <>
      <Button variant="tonal" onClick={() => toast("Message sent")}>
        Simple
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          toast("Conversation archived", {
            action: { label: "Undo", onClick: () => {} },
          })
        }
      >
        With action
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          toast(
            "We couldn't reach the server. Check your connection and try again.",
            { closeButton: true }
          )
        }
      >
        Two lines and close
      </Button>
    </>
  )
}
