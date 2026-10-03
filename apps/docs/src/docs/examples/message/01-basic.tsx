import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from "@/components/m3e/message"
import { Avatar, AvatarFallback } from "@/components/m3e/avatar"
import { Bubble, BubbleContent } from "@/components/m3e/bubble"

export const meta = {
  title: "A short conversation",
  layout: "block",
}

export default function Demo() {
  return (
    <MessageGroup className="max-w-md">
      <Message>
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>How can I help?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Show me a chart.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
