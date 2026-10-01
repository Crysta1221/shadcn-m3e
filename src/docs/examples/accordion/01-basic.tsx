import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/m3e/accordion"

export const meta = {
  title: "Segmented",
  layout: "block",
}

export default function Demo() {
  return (
    <Accordion className="max-w-lg">
      <AccordionItem value="a">
        <AccordionTrigger>What is M3 Expressive?</AccordionTrigger>
        <AccordionContent>
          An expansion of Material 3 with richer shapes, springier motion and
          bolder type.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Where do the values come from?</AccordionTrigger>
        <AccordionContent>
          Google's Compose Material3 token files.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Can I use it with shadcn?</AccordionTrigger>
        <AccordionContent>Yes: import from @/components/m3e.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
