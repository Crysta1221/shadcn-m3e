import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"

import {
  CarouselSlide,
  ExpressiveCarousel,
} from "@/components/m3e/expressive-carousel"
import { TimePicker } from "@/components/m3e/time-picker"
import { toast } from "@/components/m3e/sonner"
import { AppBar } from "@/components/m3e/app-bar"
import { NotificationBadge } from "@/components/m3e/badge"
import {
  FabMenu,
  FabMenuContent,
  FabMenuItem,
  FabMenuTrigger,
} from "@/components/m3e/fab-menu"
import {
  NavigationBar,
  NavigationBarItem,
  NavigationRail,
  NavigationRailHeader,
  NavigationRailItem,
} from "@/components/m3e/navigation"
import { SearchBar, SearchResult, SearchView } from "@/components/m3e/search"
import { DockedToolbar, FloatingToolbar } from "@/components/m3e/toolbar"
import { Chip, FilterChip, InputChip } from "@/components/m3e/chip"
import { ExtendedFab, Fab } from "@/components/m3e/fab"
import { Icon } from "@/components/m3e/icon"
import { LoadingIndicator } from "@/components/m3e/loading-indicator"
import { SplitButton } from "@/components/m3e/split-button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/m3e/accordion"
import { Button } from "@/components/m3e/button"
import { ButtonGroup } from "@/components/m3e/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/m3e/card"
import { Checkbox } from "@/components/m3e/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/m3e/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/m3e/dropdown-menu"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/m3e/item"
import { Label } from "@/components/m3e/label"
import { CircularProgress } from "@/components/m3e/circular-progress"
import { Progress } from "@/components/m3e/progress"
import { TextField } from "@/components/m3e/text-field"
import { RadioGroup, RadioGroupItem } from "@/components/m3e/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/m3e/select"
import { Shape } from "@/components/m3e/shape"
import { Slider } from "@/components/m3e/slider"
import { Spinner } from "@/components/m3e/spinner"
import { Switch } from "@/components/m3e/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/m3e/tabs"
import { Toggle } from "@/components/m3e/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/m3e/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/m3e/tooltip"

export const Route = createFileRoute("/showcase")({ component: Showcase })

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-6">
      <h2 className="text-title-large text-on-surface">{title}</h2>
      {children}
    </section>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>
}

function Showcase() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [chips, setChips] = React.useState(["Kyoto", "Osaka"])

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2 py-6">
        <h1 className="text-display-small-emphasized text-on-surface">
          shadcn M3E
        </h1>
        <p className="text-body-large text-on-surface-variant">
          Material 3 Expressive for shadcn/ui — values from Google&apos;s
          Compose Material3 tokens.
        </p>
      </header>

      <Section title="Buttons">
        <Row>
          <Button variant="elevated">Elevated</Button>
          <Button variant="filled">Filled</Button>
          <Button variant="tonal">Tonal</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
          <Button disabled>Disabled</Button>
        </Row>
        <Row>
          <Button size="xs">
            <Icon name="add" size={20} />
            Extra small
          </Button>
          <Button size="sm">
            <Icon name="add" size={20} />
            Small
          </Button>
          <Button size="md">
            <Icon name="add" />
            Medium
          </Button>
          <Button size="lg">
            <Icon name="add" size={32} />
            Large
          </Button>
        </Row>
        <Row>
          <Button size="md" shape="square" variant="tonal">
            Square
          </Button>
          <Button size="icon" variant="tonal" aria-label="Edit">
            <Icon name="edit" />
          </Button>
          <Button size="icon-md" variant="filled" aria-label="Send">
            <Icon name="send" />
          </Button>
          <Toggle aria-label="Favorite">
            <Icon name="favorite" fill="auto" />
          </Toggle>
          <Toggle variant="filled" aria-label="Bookmark">
            <Icon name="bookmark" fill="auto" />
          </Toggle>
          <Toggle variant="tonal">Tonal toggle</Toggle>
          <Toggle variant="outline">Outlined toggle</Toggle>
        </Row>
      </Section>

      <Section title="Button groups">
        <p className="text-label-large text-on-surface-variant">Standard</p>
        <ButtonGroup variant="standard">
          <Button variant="tonal">Rewind</Button>
          <Button variant="filled">Play</Button>
          <Button variant="tonal">Forward</Button>
        </ButtonGroup>
        <ToggleGroup defaultValue={["b"]}>
          <ToggleGroupItem value="a" variant="filled" aria-label="Align left">
            <Icon name="format_align_left" size={20} />
          </ToggleGroupItem>
          <ToggleGroupItem value="b" variant="filled" aria-label="Align center">
            <Icon name="format_align_center" size={20} />
          </ToggleGroupItem>
          <ToggleGroupItem value="c" variant="filled" aria-label="Align right">
            <Icon name="format_align_right" size={20} />
          </ToggleGroupItem>
        </ToggleGroup>
        <p className="text-label-large text-on-surface-variant">Connected</p>
        <ToggleGroup spacing={0} defaultValue={["week"]}>
          <ToggleGroupItem value="day">Day</ToggleGroupItem>
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
          <ToggleGroupItem value="year">Year</ToggleGroupItem>
        </ToggleGroup>
        <ButtonGroup>
          <Button variant="tonal">
            <Icon name="format_bold" size={20} />
          </Button>
          <Button variant="tonal">
            <Icon name="format_italic" size={20} />
          </Button>
          <Button variant="tonal">
            <Icon name="format_underlined" size={20} />
          </Button>
        </ButtonGroup>
        <Row>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <SplitButton
              open={menuOpen}
              renderTrailing={(button) => (
                <DropdownMenuTrigger render={button} />
              )}
            >
              <Icon name="edit" size={20} />
              Edit
            </SplitButton>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Icon name="content_copy" size={20} /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="share" size={20} /> Share
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Icon name="delete" size={20} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SplitButton variant="tonal" size="md">
            Send
          </SplitButton>
        </Row>
      </Section>

      <Section title="FAB">
        <Row>
          <Fab size="sm" aria-label="Add">
            <Icon name="add" />
          </Fab>
          <Fab aria-label="Add">
            <Icon name="add" />
          </Fab>
          <Fab size="md" color="secondary-container" aria-label="Add">
            <Icon name="edit" size={28} />
          </Fab>
          <Fab size="lg" color="tertiary-container" aria-label="Add">
            <Icon name="navigation" size={32} />
          </Fab>
          <ExtendedFab icon={<Icon name="edit" />}>Compose</ExtendedFab>
          <ExtendedFab
            size="md"
            color="primary"
            icon={<Icon name="add" size={28} />}
          >
            New
          </ExtendedFab>
        </Row>
      </Section>

      <Section title="Chips">
        <Row>
          <Chip icon="event">Add to calendar</Chip>
          <Chip variant="elevated" icon="directions">
            Directions
          </Chip>
          <FilterChip defaultPressed>Nearby</FilterChip>
          <FilterChip>Open now</FilterChip>
          {chips.map((c) => (
            <InputChip
              key={c}
              icon="location_on"
              onRemove={() => setChips((cs) => cs.filter((x) => x !== c))}
            >
              {c}
            </InputChip>
          ))}
        </Row>
      </Section>

      <Section title="Selection controls">
        <Row>
          <Label>
            <Checkbox defaultChecked /> Checkbox
          </Label>
          <Label>
            <Checkbox /> Unchecked
          </Label>
          <RadioGroup defaultValue="a" className="flex w-auto gap-6">
            <Label>
              <RadioGroupItem value="a" /> One
            </Label>
            <Label>
              <RadioGroupItem value="b" /> Two
            </Label>
          </RadioGroup>
          <Switch defaultChecked />
          <Switch />
        </Row>
      </Section>

      <Section title="Sliders & progress">
        <Slider defaultValue={[40]} className="max-w-md" />
        <Slider defaultValue={[20, 70]} className="max-w-md" />
        <Progress value={60} className="max-w-md" />
        <Progress value={60} variant="wavy" className="max-w-md" />
        <Progress value={null} className="max-w-md" />
        <Progress value={null} variant="wavy" className="max-w-md" />
        <Row>
          <CircularProgress value={70} />
          <CircularProgress value={70} variant="wavy" />
          <CircularProgress value={null} />
          <CircularProgress value={null} variant="wavy" />
        </Row>
        <Row>
          <LoadingIndicator />
          <LoadingIndicator variant="contained" />
          <Spinner className="size-10" />
        </Row>
      </Section>

      <Section title="Text fields & menus">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Outlined" supportingText="Supporting text" />
          <TextField
            variant="filled"
            label="Filled"
            supportingText="Supporting text"
          />
          <TextField
            label="Search"
            leadingIcon={<Icon name="search" />}
            trailingIcon={<Icon name="cancel" />}
          />
          <TextField
            variant="filled"
            label="Email"
            defaultValue="not an email"
            error
            errorText="Enter a valid email"
            trailingIcon={<Icon name="error" />}
          />
          <Select
            defaultValue="apple"
            items={[
              { value: "apple", label: "Apple" },
              { value: "banana", label: "Banana" },
              { value: "cherry", label: "Cherry" },
            ]}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="cherry">Cherry</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outlined" />}>
              Open menu
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Icon name="visibility" size={20} /> Preview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name="share" size={20} /> Share
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem defaultChecked>
                  Show grid
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Snap</DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Section>

      <Section title="Lists">
        <ItemGroup>
          {["Inbox", "Starred", "Sent"].map((t, i) => (
            // oxlint-disable-next-line jsx-a11y/control-has-associated-label -- Item children fill the button via `render`
            <Item key={t} variant="segmented" render={<button type="button" />}>
              <ItemMedia>
                <Icon name={["inbox", "star", "send"][i]} size={24} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{t}</ItemTitle>
                <ItemDescription>Supporting text</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
        <Accordion>
          <AccordionItem value="a">
            <AccordionTrigger>What is M3 Expressive?</AccordionTrigger>
            <AccordionContent>
              An expansion of Material 3 with richer shapes, springier motion
              and bolder type.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Where do the values come from?</AccordionTrigger>
            <AccordionContent>
              Google&apos;s Compose Material3 token files.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Cards, tabs & dialogs">
        <div className="grid gap-4 sm:grid-cols-3">
          {(["elevated", "filled", "outlined"] as const).map((v) => (
            <Card key={v} variant={v}>
              <CardHeader>
                <CardTitle className="capitalize">{v}</CardTitle>
                <CardDescription>Card with medium corners</CardDescription>
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
        <Tabs defaultValue="flights">
          <TabsList>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="trips">Trips</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
          </TabsList>
          <TabsContent value="flights">Flights content</TabsContent>
          <TabsContent value="trips">Trips content</TabsContent>
          <TabsContent value="explore">Explore content</TabsContent>
        </Tabs>
        <Row>
          <Dialog>
            <DialogTrigger render={<Button variant="tonal" />}>
              Open dialog
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Reset settings?</DialogTitle>
                <DialogDescription>
                  This will reset your app preferences back to their default
                  settings.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="text" />}>
                  Cancel
                </DialogClose>
                <DialogClose render={<Button variant="text" />}>
                  Accept
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outlined" />}>
              Hover me
            </TooltipTrigger>
            <TooltipContent>Plain tooltip</TooltipContent>
          </Tooltip>
        </Row>
      </Section>

      <Section title="Navigation">
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-lg border border-outline-variant">
            <NavigationBar>
              <NavigationBarItem icon="home" label="Home" active />
              <NavigationBarItem icon="search" label="Search" badge />
              <NavigationBarItem icon="mail" label="Mail" badge={12} />
              <NavigationBarItem icon="person" label="Profile" />
            </NavigationBar>
          </div>
          <div className="overflow-hidden rounded-lg border border-outline-variant">
            <NavigationBar layout="horizontal">
              <NavigationBarItem icon="home" label="Home" active />
              <NavigationBarItem icon="favorite" label="Saved" />
              <NavigationBarItem icon="settings" label="Settings" />
            </NavigationBar>
          </div>
          <div className="flex h-96 gap-4">
            <div className="overflow-hidden rounded-lg border border-outline-variant">
              <NavigationRail>
                <NavigationRailHeader>
                  <Fab size="default" aria-label="Compose">
                    <Icon name="edit" />
                  </Fab>
                </NavigationRailHeader>
                <NavigationRailItem icon="home" label="Home" active />
                <NavigationRailItem icon="chat" label="Chat" badge={3} />
                <NavigationRailItem icon="settings" label="Settings" />
              </NavigationRail>
            </div>
            <div className="overflow-hidden rounded-lg border border-outline-variant">
              <NavigationRail expanded>
                <NavigationRailHeader>
                  <ExtendedFab icon={<Icon name="edit" />}>Compose</ExtendedFab>
                </NavigationRailHeader>
                <NavigationRailItem icon="home" label="Home" active />
                <NavigationRailItem icon="chat" label="Chat" badge={3} />
                <NavigationRailItem icon="settings" label="Settings" />
              </NavigationRail>
            </div>
          </div>
        </div>
      </Section>

      <Section title="App bars">
        <div className="flex flex-col gap-4">
          <AppBar
            title="Inbox"
            leading={
              <Button variant="text" size="icon" aria-label="Menu">
                <Icon name="menu" />
              </Button>
            }
            trailing={
              <Button variant="text" size="icon" aria-label="Search">
                <Icon name="search" />
              </Button>
            }
          />
          <AppBar
            size="medium"
            scrolled
            title="Medium title"
            subtitle="Subtitle"
            leading={
              <Button variant="text" size="icon" aria-label="Back">
                <Icon name="arrow_back" />
              </Button>
            }
            trailing={
              <Button variant="text" size="icon" aria-label="More">
                <Icon name="more_vert" />
              </Button>
            }
          />
          <AppBar
            size="large"
            title="Large title"
            leading={
              <Button variant="text" size="icon" aria-label="Back">
                <Icon name="arrow_back" />
              </Button>
            }
          />
        </div>
      </Section>

      <Section title="Toolbars">
        <Row>
          <FloatingToolbar>
            <Button variant="text" size="icon" aria-label="Undo">
              <Icon name="undo" />
            </Button>
            <Button variant="text" size="icon" aria-label="Redo">
              <Icon name="redo" />
            </Button>
            <Toggle aria-label="Bold" defaultPressed>
              <Icon name="format_bold" />
            </Toggle>
            <Toggle aria-label="Italic">
              <Icon name="format_italic" />
            </Toggle>
          </FloatingToolbar>
          <FloatingToolbar variant="vibrant">
            <Button variant="text" size="icon" aria-label="Undo">
              <Icon name="undo" />
            </Button>
            <Toggle aria-label="Bold" defaultPressed>
              <Icon name="format_bold" />
            </Toggle>
            <Toggle aria-label="Italic">
              <Icon name="format_italic" />
            </Toggle>
          </FloatingToolbar>
          <FloatingToolbar orientation="vertical">
            <Button variant="text" size="icon" aria-label="Undo">
              <Icon name="undo" />
            </Button>
            <Button variant="text" size="icon" aria-label="Redo">
              <Icon name="redo" />
            </Button>
          </FloatingToolbar>
        </Row>
        <DockedToolbar>
          <Button variant="text" size="icon" aria-label="Attach">
            <Icon name="attach_file" />
          </Button>
          <Button variant="text" size="icon" aria-label="Photo">
            <Icon name="image" />
          </Button>
          <Button variant="text" size="icon" aria-label="Mic">
            <Icon name="mic" />
          </Button>
          <Button variant="text" size="icon" aria-label="More">
            <Icon name="more_vert" />
          </Button>
        </DockedToolbar>
      </Section>

      <Section title="FAB menu & icon button widths">
        <div className="flex min-h-72 items-end gap-8">
          <FabMenu>
            <FabMenuContent align="start">
              <FabMenuItem icon={<Icon name="mail" />}>Mail</FabMenuItem>
              <FabMenuItem icon={<Icon name="event" />}>Event</FabMenuItem>
              <FabMenuItem icon={<Icon name="task_alt" />}>Task</FabMenuItem>
            </FabMenuContent>
            <FabMenuTrigger />
          </FabMenu>
          <Row>
            <Button
              variant="tonal"
              size="icon"
              width="narrow"
              aria-label="Narrow"
            >
              <Icon name="add" />
            </Button>
            <Button variant="tonal" size="icon" aria-label="Default">
              <Icon name="add" />
            </Button>
            <Button variant="tonal" size="icon" width="wide" aria-label="Wide">
              <Icon name="add" />
            </Button>
            <span className="relative inline-flex">
              <Icon name="notifications" size={32} />
              <NotificationBadge className="absolute top-0 right-0" />
            </span>
            <span className="relative inline-flex">
              <Icon name="mail" size={32} />
              <NotificationBadge
                count={128}
                className="absolute -top-1 left-4"
              />
            </span>
          </Row>
        </div>
      </Section>

      <Section title="Snackbar">
        <Row>
          <Button variant="tonal" onClick={() => toast("Message sent")}>
            Show snackbar
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              toast("Conversation archived", {
                action: { label: "Undo", onClick: () => {} },
              })
            }
          >
            With action
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              toast(
                "We couldn't reach the server. Check your connection and try again.",
                { closeButton: true }
              )
            }
          >
            Two lines, close
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              toast("Photo uploaded")
              toast("Link copied")
              toast("Saved to drafts")
            }}
          >
            Queue of 3
          </Button>
        </Row>
      </Section>

      <Section title="Search">
        <div className="flex min-h-80 flex-col gap-4">
          <SearchBar trailing={<Icon name="mic" />} />
          <SearchView placeholder="Search songs">
            <SearchResult icon="history">Recent search</SearchResult>
            <SearchResult icon="history">Another recent search</SearchResult>
            <SearchResult icon="search">Suggestion</SearchResult>
          </SearchView>
        </div>
      </Section>

      <Section title="Carousel">
        {(["multi-browse", "hero", "uncontained"] as const).map((v) => (
          <div key={v} className="flex flex-col gap-2">
            <p className="text-label-large text-on-surface-variant">{v}</p>
            <ExpressiveCarousel variant={v} height={180}>
              {[
                "Sunrise",
                "Forest",
                "Ocean",
                "Desert",
                "Glacier",
                "Canyon",
              ].map((t, i) => (
                <CarouselSlide
                  key={t}
                  className={
                    [
                      "bg-primary-container text-on-primary-container",
                      "bg-secondary-container text-on-secondary-container",
                      "bg-tertiary-container text-on-tertiary-container",
                    ][i % 3]
                  }
                >
                  <span className="text-title-large">{t}</span>
                </CarouselSlide>
              ))}
            </ExpressiveCarousel>
          </div>
        ))}
      </Section>

      <Section title="Time picker">
        <Row>
          <TimePicker onCancel={() => {}} onConfirm={() => {}} />
          <TimePicker hour24 defaultValue={{ hours: 15, minutes: 45 }} />
        </Row>
      </Section>

      <Section title="Shapes">
        <Row>
          <Shape name="sunny" className="size-16" />
          <Shape name="12-sided-cookie" className="size-16" />
          <Shape name="arch" className="size-16" />
          <Shape name="ghost-ish" className="size-16" />
          <Shape name="heart" className="size-16" />
        </Row>
      </Section>
    </div>
  )
}
