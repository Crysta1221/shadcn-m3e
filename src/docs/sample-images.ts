/**
 * Pictures for the theme demos, so they work without uploading anything.
 * They are SVG data URLs only because that needs no asset files: any image
 * (a File, a PNG or JPEG URL, an <img>…) goes through `applyImage` the same way.
 */
const svg = (body: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260">${body}</svg>`
  )}`

export const SAMPLE_IMAGES = [
  {
    name: "Sunset",
    src: svg(
      `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b1055"/><stop offset=".55" stop-color="#d9436b"/><stop offset="1" stop-color="#ffb347"/></linearGradient></defs><rect width="400" height="260" fill="url(#g)"/><circle cx="200" cy="190" r="48" fill="#fff3c4"/><rect y="200" width="400" height="60" fill="#1b1f3b"/>`
    ),
  },
  {
    name: "Forest",
    src: svg(
      `<rect width="400" height="260" fill="#dff0d0"/><rect y="110" width="400" height="150" fill="#2f6b3a"/><path d="M0 260 L90 60 L180 260Z" fill="#1d4d2a"/><path d="M140 260 L250 30 L360 260Z" fill="#3d8b4e"/><circle cx="330" cy="50" r="26" fill="#f4d35e"/>`
    ),
  },
  {
    name: "Ocean",
    src: svg(
      `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9be7ff"/><stop offset="1" stop-color="#0a4d8c"/></linearGradient></defs><rect width="400" height="260" fill="url(#g)"/><path d="M0 170 Q100 130 200 170 T400 170 V260 H0Z" fill="#0b6fb3"/><path d="M0 210 Q100 180 200 210 T400 210 V260 H0Z" fill="#0a3d6b"/><circle cx="90" cy="60" r="28" fill="#fff8d6"/>`
    ),
  },
] as const
