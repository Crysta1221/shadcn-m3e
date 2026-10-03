import * as React from "react"

import { Avatar, AvatarFallback } from "@/components/m3e/avatar"
import { Bubble, BubbleContent } from "@/components/m3e/bubble"
import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
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

type Line = { id: string; from: "me" | "ai"; text: string }

const START: Line[] = [
  { id: "1", from: "ai", text: "Hi! Ask me anything." },
  { id: "2", from: "me", text: "What is a spatial spring?" },
  {
    id: "3",
    from: "ai",
    text: "One that moves things — position, size, shape — and may overshoot a little.",
  },
  { id: "4", from: "me", text: "And an effects spring?" },
  {
    id: "5",
    from: "ai",
    text: "It changes color and opacity. It never overshoots.",
  },
  { id: "6", from: "me", text: "Thanks!" },
]

export const meta = {
  title: "A chat",
  description:
    "Starts at the newest message and stays there as messages arrive. Scroll up and a button jumps back down.",
}

export default function Demo() {
  const [lines, setLines] = React.useState(START)

  const send = () =>
    setLines((l) => {
      const n = l.length + 1
      return [
        ...l,
        { id: String(n), from: "me", text: `Message ${n}` },
        { id: `${n}r`, from: "ai", text: `Reply to message ${n}` },
      ]
    })

  return (
    <MessageScrollerProvider defaultScrollPosition="end">
      <div className="flex w-full max-w-md flex-col gap-3">
        <div className="h-72 overflow-hidden rounded-lg border border-outline-variant bg-surface">
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
        <Button variant="tonal" className="self-end" onClick={send}>
          <Icon name="send" />
          Send
        </Button>
      </div>
    </MessageScrollerProvider>
  )
}
