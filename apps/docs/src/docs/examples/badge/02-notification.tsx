import { Icon } from "@/components/m3e/icon"
import { NotificationBadge } from "@/components/m3e/badge"

export const meta = {
  title: "Notification badge",
  description: "A dot, a small count, and a count over the limit.",
}

export default function Demo() {
  return (
    <>
      <span className="relative inline-flex">
        <Icon name="notifications" size={32} />
        <NotificationBadge className="absolute top-0 right-0" />
      </span>
      <span className="relative inline-flex">
        <Icon name="mail" size={32} />
        <NotificationBadge count={8} className="absolute -top-1 left-5" />
      </span>
      <span className="relative inline-flex">
        <Icon name="chat" size={32} />
        <NotificationBadge count={1200} className="absolute -top-1 left-5" />
      </span>
    </>
  )
}
