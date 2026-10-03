import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/m3e/resizable"

export const meta = {
  title: "Two panels",
  layout: "block",
}

export default function Demo() {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-40 max-w-lg rounded-lg border border-outline-variant"
    >
      <ResizablePanel defaultSize={40}>
        <div className="flex h-full items-center justify-center text-on-surface">
          Left
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center text-on-surface">
          Right
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
