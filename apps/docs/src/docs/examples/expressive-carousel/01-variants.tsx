import {
  CarouselSlide,
  ExpressiveCarousel,
} from "@/components/m3e/expressive-carousel"

const slides = ["Sunrise", "Forest", "Ocean", "Desert", "Glacier", "Canyon"]
const tones = [
  "bg-primary-container text-on-primary-container",
  "bg-secondary-container text-on-secondary-container",
  "bg-tertiary-container text-on-tertiary-container",
]

export const meta = {
  title: "Multi-browse, hero, uncontained and full-screen",
  description: "Scroll each carousel sideways.",
  layout: "block",
}

export default function Demo() {
  return (
    <div className="flex flex-col gap-8">
      {(["multi-browse", "hero", "uncontained", "full-screen"] as const).map(
        (variant) => (
          <div key={variant} className="flex flex-col gap-2">
            <p className="text-label-large text-on-surface-variant">
              {variant}
            </p>
            <ExpressiveCarousel variant={variant} height={180}>
              {slides.map((s, i) => (
                <CarouselSlide key={s} className={tones[i % 3]}>
                  <span className="text-title-large">{s}</span>
                </CarouselSlide>
              ))}
            </ExpressiveCarousel>
          </div>
        )
      )}
    </div>
  )
}
