import { Avatar, AvatarFallback, AvatarGroup } from "@/components/m3e/avatar"

export const meta = {
  title: "Initials and groups",
}

export default function Demo() {
  return (
    <>
      <Avatar>
        <AvatarFallback>TK</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>M3</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </>
  )
}
