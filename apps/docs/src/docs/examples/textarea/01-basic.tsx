import { Textarea } from "@/components/m3e/textarea"

export const meta = {
  title: "Basic",
  layout: "block",
}

export default function Demo() {
  return <Textarea aria-label="Message" placeholder="Type your message here." />
}
