import { ScrollArea } from "@/components/m3e/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/m3e/table"

import { InlineText } from "./inline-text"
import type { PropRow } from "./registry"

function PropsTable({ title, rows }: { title?: string; rows: PropRow[] }) {
  return (
    <div className="flex flex-col gap-2">
      {title && <h3 className="text-title-medium text-on-surface">{title}</h3>}
      <ScrollArea
        scrollbars="horizontal"
        className="rounded-lg border border-outline-variant"
      >
        <Table containerClassName="overflow-visible" className="min-w-[680px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Prop</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-32">Default</TableHead>
              <TableHead className="min-w-64">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.name}>
                <TableCell className="font-mono text-body-small text-primary">
                  {r.name}
                </TableCell>
                <TableCell className="font-mono text-body-small whitespace-normal text-on-surface-variant">
                  {r.type}
                </TableCell>
                <TableCell className="font-mono text-body-small text-on-surface-variant">
                  {r.default ?? "—"}
                </TableCell>
                <TableCell className="whitespace-normal text-on-surface-variant">
                  <InlineText text={r.description} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}

export { PropsTable }
