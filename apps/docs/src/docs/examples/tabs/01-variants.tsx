import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/m3e/tabs"

export const meta = {
  title: "Primary, secondary and segmented",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex max-w-lg flex-col gap-8">
      {(["primary", "secondary", "segmented"] as const).map((variant) => (
        <Tabs key={variant} defaultValue="flights">
          <TabsList variant={variant}>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="trips">Trips</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
          </TabsList>
          <TabsContent value="flights">Flights content</TabsContent>
          <TabsContent value="trips">Trips content</TabsContent>
          <TabsContent value="explore">Explore content</TabsContent>
        </Tabs>
      ))}
    </div>
  )
}
