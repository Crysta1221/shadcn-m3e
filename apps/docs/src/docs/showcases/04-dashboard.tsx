import * as React from "react"

import { Badge } from "@/components/m3e/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/m3e/card"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/m3e/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/m3e/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/m3e/tabs"

export const meta = {
  title: "Dashboard",
  description:
    "Summary cards, goals and a table that follow a segmented range switch.",
  layout: "block",
  uses: ["card", "tabs", "badge", "progress", "table"],
}

const RANGES = {
  week: {
    stats: [
      ["Revenue", "$12,480", "+12%", "tertiary"],
      ["Orders", "342", "+4%", "tertiary"],
      ["Refunds", "9", "+2", "destructive"],
    ],
    goals: [
      ["Revenue goal", 62],
      ["New customers", 48],
    ],
    rows: [
      ["INV-1042", "Paid", "$250.00"],
      ["INV-1043", "Pending", "$150.00"],
      ["INV-1044", "Paid", "$890.00"],
    ],
  },
  month: {
    stats: [
      ["Revenue", "$51,930", "+8%", "tertiary"],
      ["Orders", "1,412", "+6%", "tertiary"],
      ["Refunds", "31", "-5", "tertiary"],
    ],
    goals: [
      ["Revenue goal", 81],
      ["New customers", 73],
    ],
    rows: [
      ["INV-0987", "Paid", "$1,200.00"],
      ["INV-1010", "Paid", "$430.00"],
      ["INV-1031", "Pending", "$75.00"],
    ],
  },
} as const

const isRange = (v: unknown): v is keyof typeof RANGES =>
  v === "week" || v === "month"

export default function Demo() {
  const [range, setRange] = React.useState<keyof typeof RANGES>("week")
  const data = RANGES[range]

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-title-large text-on-surface">Overview</h2>
        <Tabs value={range} onValueChange={(v) => isRange(v) && setRange(v)}>
          <TabsList variant="segmented">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {data.stats.map(([label, value, change, tone]) => (
          <Card key={label} variant="filled">
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-headline-small">{value}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={tone}>{change}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Goals</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {data.goals.map(([label, value]) => (
            <Progress key={label} value={value}>
              <ProgressLabel>{label}</ProgressLabel>
              <ProgressValue />
            </Progress>
          ))}
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map(([id, status, amount]) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell className="text-right">{amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
