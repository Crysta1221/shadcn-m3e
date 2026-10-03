import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/m3e/carousel"

export const meta = {
  title: "Embla carousel",
  layout: "block",
}

export default function Demo() {
  return (
    <Carousel className="mx-auto w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }, (_, i) => (
          <CarouselItem key={i}>
            <div className="flex aspect-square items-center justify-center rounded-2xl bg-primary-container text-headline-large text-on-primary-container">
              {i + 1}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
