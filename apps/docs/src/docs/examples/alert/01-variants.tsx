import { Icon } from "@/components/m3e/icon"
import { Alert, AlertDescription, AlertTitle } from "@/components/m3e/alert"

export const meta = {
  title: "Variants",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex max-w-lg flex-col gap-3">
      <Alert>
        <Icon name="info" />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>You can change this in settings.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <Icon name="tips_and_updates" />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>Press ? to see shortcuts.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <Icon name="error" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>Your session has expired.</AlertDescription>
      </Alert>
    </div>
  )
}
