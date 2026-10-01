import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { useM3Theme } from "@/components/m3e/m3-theme-provider"
import { useImageTheme } from "@/components/m3e/use-image-theme"
import { SAMPLE_IMAGES } from "@/docs/sample-images"

export const meta = {
  title: "From an image",
  description:
    "useImageTheme().applyImage() takes the image as it is: a File from an input, a Blob, a URL, an <img>, a <canvas>, an ImageBitmap or ImageData. It sets a scheme from its Vibrant swatches and changes the theme of the entire site.",
}

export default function Demo() {
  const { applyImage, pickSwatch, swatches, loading, error } = useImageTheme()
  const { resetTheme } = useM3Theme()

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {SAMPLE_IMAGES.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-label={`Use the ${s.name} image`}
            onClick={() => void applyImage(s.src)}
            className="overflow-hidden rounded-md focus-ring"
          >
            <img src={s.src} alt="" className="h-20 w-32 object-cover" />
          </button>
        ))}
        <Button
          variant="tonal"
          render={
            <label>
              <Icon name="upload" />
              Choose an image
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void applyImage(file)
                }}
              />
            </label>
          }
          nativeButton={false}
        />
        <Button variant="text" onClick={resetTheme}>
          Reset
        </Button>
      </div>
      {loading && (
        <p className="text-body-medium text-on-surface-variant">Reading…</p>
      )}
      {error && <p className="text-body-medium text-error">{error}</p>}
      {swatches.length > 0 && (
        <ul className="flex gap-2" aria-label="Swatches found in the image">
          {swatches.map((s) => (
            <li key={s.name}>
              <button
                type="button"
                title={`${s.name} ${s.hex} — use as the seed`}
                aria-label={`Use ${s.name} (${s.hex}) as the seed`}
                onClick={() => pickSwatch(s.hex)}
                className="size-8 rounded-full border border-outline-variant focus-ring"
                style={{ background: s.hex }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
