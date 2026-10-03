import { Button } from "@/components/m3e/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/m3e/card"

export const meta = {
  title: "Filled, elevated and outlined",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(["filled", "elevated", "outlined"] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader>
            <CardTitle className="capitalize">{variant}</CardTitle>
            <CardDescription>Medium (12dp) corners</CardDescription>
          </CardHeader>
          <CardContent>Body text lives here.</CardContent>
          <CardFooter>
            <Button variant="text" size="sm">
              Action
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
