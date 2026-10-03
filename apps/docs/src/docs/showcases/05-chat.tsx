import * as React from "react"

import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/m3e/attachment"
import { Avatar, AvatarFallback } from "@/components/m3e/avatar"
import { Bubble, BubbleContent } from "@/components/m3e/bubble"
import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/m3e/input-group"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/m3e/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/m3e/message-scroller"

export const meta = {
  title: "Chat",
  description:
    "Messages that stay pinned to the newest one, a file attachment in a message, and a composer that sends on Enter.",
  layout: "block",
  uses: [
    "message-scroller",
    "message",
    "bubble",
    "attachment",
    "input-group",
    "avatar",
  ],
}

type Line = { id: string; from: "me" | "ai"; text: string; file?: string }

const START: Line[] = [
  { id: "1", from: "ai", text: "Hi! What are we working on?" },
  { id: "2", from: "me", text: "Can you check this spec?", file: "spec.pdf" },
  {
    id: "3",
    from: "ai",
    text: "Got it. The motion section is the part to read twice.",
  },
]

export default function Demo() {
  const [lines, setLines] = React.useState(START)
  const [draft, setDraft] = React.useState("")

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    const n = lines.length + 1
    setLines([
      ...lines,
      { id: String(n), from: "me", text },
      { id: `${n}r`, from: "ai", text: "Noted." },
    ])
    setDraft("")
  }

  return (
    <MessageScrollerProvider defaultScrollPosition="end">
      <div className="mx-auto flex h-[28rem] max-w-md flex-col gap-3">
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-outline-variant bg-surface">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-3 p-4">
                {lines.map((line) => (
                  <MessageScrollerItem key={line.id} messageId={line.id}>
                    <Message align={line.from === "me" ? "end" : "start"}>
                      {line.from === "ai" && (
                        <MessageAvatar>
                          <Avatar size="sm">
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        </MessageAvatar>
                      )}
                      <MessageContent>
                        {line.file && (
                          <Attachment>
                            <AttachmentMedia>
                              <Icon name="description" />
                            </AttachmentMedia>
                            <AttachmentContent>
                              <AttachmentTitle>{line.file}</AttachmentTitle>
                              <AttachmentDescription>
                                1.2 MB
                              </AttachmentDescription>
                            </AttachmentContent>
                          </Attachment>
                        )}
                        <Bubble
                          align={line.from === "me" ? "end" : "start"}
                          variant={line.from === "me" ? "default" : "muted"}
                        >
                          <BubbleContent>{line.text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </div>
        <form onSubmit={send}>
          <InputGroup className="rounded-[28px]">
            <InputGroupInput
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message"
              aria-label="Message"
            />
            <InputGroupAddon align="inline-end">
              <Button
                type="submit"
                size="icon-sm"
                variant="filled"
                aria-label="Send"
              >
                <Icon name="send" size={20} />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </MessageScrollerProvider>
  )
}
