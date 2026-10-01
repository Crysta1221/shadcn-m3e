import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/m3e/attachment"
import { Icon } from "@/components/m3e/icon"

export const meta = {
  title: "States",
}

export default function Demo() {
  return (
    <>
      {(["done", "uploading", "error"] as const).map((state) => (
        <Attachment key={state} state={state}>
          <AttachmentMedia>
            <Icon name="description" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>report.pdf</AttachmentTitle>
            <AttachmentDescription>{state}</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      ))}
    </>
  )
}
