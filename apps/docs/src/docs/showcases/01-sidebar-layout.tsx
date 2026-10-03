import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/m3e/sidebar"
import { Icon } from "@/components/m3e/icon"

export const meta = {
  title: "Page with a sidebar",
  description:
    "A navigation sidebar beside the page content. Toggle it with the button or Ctrl/⌘ B; under 768px it opens as a sheet.",
  frame: 480,
  uses: ["sidebar"],
}

export default function Demo() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Icon name="home" fill /> Home
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icon name="inbox" /> Inbox
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Icon name="settings" /> Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 px-4">
          <SidebarTrigger />
          <h1 className="text-title-medium">Home</h1>
        </header>
        <div className="p-4 text-body-medium text-on-surface-variant">
          Page content goes here.
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
