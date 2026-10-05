import type * as React from "react"
import { Link } from "@tanstack/react-router"

import { Button } from "@/components/m3e/button"
import { Icon } from "@/components/m3e/icon"
import { Shape } from "@/components/m3e/shape"

/**
 * The page for an address that does not exist: shown by the router for an
 * unknown path (`notFoundComponent` of the root route) and by the component
 * and guide pages for an unknown slug. In production the same page is served
 * with a real 404 status from dist/404.html (see the `seo` plugin).
 */
export function NotFound({
  title = "Page not found",
  children = "The page you are looking for does not exist, or it has moved.",
}: {
  title?: string
  children?: React.ReactNode
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 p-6 py-16 text-center md:py-24">
      <Shape
        name="9-sided-cookie"
        className="grid size-48 place-items-center bg-primary-container text-on-primary-container md:size-64"
      >
        <span className="text-display-large-emphasized">404</span>
      </Shape>
      <div className="flex flex-col gap-3">
        <h1 className="text-headline-large text-on-surface">{title}</h1>
        <p className="text-body-large text-on-surface-variant">{children}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button size="md" render={<Link to="/" />} nativeButton={false}>
          <Icon name="home" />
          Home
        </Button>
        <Button
          size="md"
          variant="tonal"
          render={<Link to="/components" />}
          nativeButton={false}
        >
          <Icon name="widgets" />
          Components
        </Button>
        <Button
          size="md"
          variant="outlined"
          render={<Link to="/docs" />}
          nativeButton={false}
        >
          <Icon name="menu_book" />
          Docs
        </Button>
      </div>
    </div>
  )
}
