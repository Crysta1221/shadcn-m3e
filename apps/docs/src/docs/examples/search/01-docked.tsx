import { Icon } from "@/components/m3e/icon"
import { SearchBar, SearchResult, SearchView } from "@/components/m3e/search"

export const meta = {
  title: "Search bar and docked view",
  description: "Click the second field: the bar grows into its results.",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex min-h-72 max-w-lg flex-col gap-4">
      <SearchBar trailing={<Icon name="mic" />} />
      <SearchBar outlined placeholder="Search mail" />
      <SearchView placeholder="Search songs">
        <SearchResult icon="history">Recent search</SearchResult>
        <SearchResult icon="history">Another recent search</SearchResult>
        <SearchResult icon="search">Suggestion</SearchResult>
      </SearchView>
    </div>
  )
}
