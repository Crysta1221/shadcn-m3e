import { Shape } from "@/components/m3e/shape"

const IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b1055"/><stop offset=".55" stop-color="#d9436b"/><stop offset="1" stop-color="#ffb347"/></linearGradient></defs><rect width="240" height="240" fill="url(#g)"/><circle cx="150" cy="150" r="46" fill="#fff3c4"/></svg>`
)}`

export const meta = {
  title: "Clipped media",
  description:
    "img and video children fill the shape and are clipped by it (object-cover).",
}

export default function Demo() {
  return (
    <>
      <Shape name="sunny" className="size-32">
        <img src={IMAGE} alt="" />
      </Shape>
      <Shape name="9-sided-cookie" className="size-32">
        <img src={IMAGE} alt="" />
      </Shape>
      <Shape name="arch" className="size-32">
        <img src={IMAGE} alt="" />
      </Shape>
    </>
  )
}
