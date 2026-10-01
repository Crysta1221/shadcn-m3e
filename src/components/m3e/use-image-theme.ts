import * as React from "react"

import { useM3Theme } from "@/components/m3e/m3-theme-provider"
import {
  extractSwatches,
  resolveImage,
  sourceFromSwatches,
  type ImageSwatch,
  type ResolvedImage,
  type ThemeImage,
} from "@/lib/m3e/vibrant"

export type { ImageSwatch, ThemeImage }

/**
 * Theme from an image. The colors are picked with node-vibrant and become the
 * app's color scheme (variant `image`).
 *
 * Hand it the image as you have it: a `File` from an input or a drop, a `Blob`,
 * a URL, an `<img>`, a `<canvas>`, an `ImageBitmap` or `ImageData`. Nothing
 * needs converting first.
 *
 * ```tsx
 * const { applyImage, preview, loading, error } = useImageTheme()
 * <input type="file" accept="image/*" onChange={(e) => applyImage(e.target.files![0])} />
 * ```
 */
export function useImageTheme() {
  const { updateTheme } = useM3Theme()
  const [swatches, setSwatches] = React.useState<ImageSwatch[]>([])
  const [preview, setPreview] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const current = React.useRef<ResolvedImage | null>(null)

  React.useEffect(
    () => () => {
      current.current?.release()
      current.current = null
    },
    []
  )

  const applySwatches = React.useCallback(
    (found: ImageSwatch[], primary?: string) => {
      const source = sourceFromSwatches(found, primary)
      if (!source) return null
      updateTheme({ source, variant: "image" })
      return source
    },
    [updateTheme]
  )

  /**
   * Use the image's colors as the app theme. `primary` picks the seed
   * (`#RRGGBB`, usually one of the swatches) instead of the Vibrant swatch.
   */
  const applyImage = React.useCallback(
    async (image: ThemeImage, options: { primary?: string } = {}) => {
      setLoading(true)
      setError(null)
      try {
        const resolved = await resolveImage(image)
        try {
          const found = await extractSwatches(resolved.src)
          const source = applySwatches(found, options.primary)
          if (!source) throw new Error("No colors found in that image")
          current.current?.release()
          current.current = resolved
          setPreview(resolved.previewUrl)
          setSwatches(found)
          return { swatches: found, source }
        } catch (e) {
          resolved.release()
          throw e
        }
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Couldn't read colors from that image"
        )
        return null
      } finally {
        setLoading(false)
      }
    },
    [applySwatches]
  )

  /** switch the seed to another swatch of the last image */
  const pickSwatch = React.useCallback(
    (hex: string) => applySwatches(swatches, hex),
    [applySwatches, swatches]
  )

  return { applyImage, pickSwatch, swatches, preview, loading, error }
}
