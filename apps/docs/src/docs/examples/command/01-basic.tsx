import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/m3e/command"

export const meta = {
  title: "Command palette",
  layout: "block",
}

export default function Demo() {
  return (
    <Command className="max-w-md rounded-2xl border border-outline-variant">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            Calendar <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
          <CommandItem>Search emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
