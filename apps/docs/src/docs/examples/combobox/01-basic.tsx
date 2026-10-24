import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/m3e/combobox"

const frameworks = ["Next.js", "SvelteKit", "Nuxt", "Remix", "Astro"]

export const meta = {
  title: "Basic",
  description: "Type to filter the list.",
}

export default function Demo() {
  return (
    <Combobox items={frameworks}>
      <ComboboxInput
        aria-label="Framework"
        placeholder="Select a framework"
        className="w-full max-w-64"
      />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
