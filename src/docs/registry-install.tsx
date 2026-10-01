import { Link } from "@tanstack/react-router"

import { Icon as Glyph } from "@iconify/react/offline"

import "@/components/m3e/icon-registry"

import { CommandBlock } from "./command-block"
import { DOCS } from "./registry"
import { REGISTRY_META } from "./registry-meta.generated"

/** the registry item that ships a module of `@/components/m3e` */
function itemOf(module: string) {
  return Object.entries(REGISTRY_META).find(([, m]) =>
    m.files.some(
      (f) => /\.tsx?$/.test(f.path) && f.path.includes(`/${module}.`)
    )
  )?.[0]
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-sm border border-outline-variant px-2.5 text-label-medium text-on-surface-variant">
      {children}
    </span>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
      <dt className="w-36 shrink-0 pt-1 text-label-large text-on-surface">
        {label}
      </dt>
      <dd className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {children}
      </dd>
    </div>
  )
}

/**
 * How to add a component to a project, and what comes with it: the command,
 * the npm packages, the other M3E items and the icons.
 */
function RegistryInstall({ modules }: { modules: string[] }) {
  const names = [...new Set(modules.flatMap((m) => itemOf(m) ?? []))]
  if (!names.length) return null

  const metas = names.map((n) => REGISTRY_META[n])
  const npm = [...new Set(metas.flatMap((m) => m.dependencies))].toSorted()
  const others = [
    ...new Set(metas.flatMap((m) => m.registryDependencies)),
  ].filter((d) => !names.includes(d))
  const icons = [
    ...new Map(
      metas.flatMap((m) => m.icons).map((i) => [i.name, i.glyph] as const)
    ),
  ].toSorted(([a], [b]) => a.localeCompare(b))

  return (
    <div className="flex flex-col gap-4">
      <CommandBlock
        command={`npx shadcn@latest add ${names.map((n) => `@m3e/${n}`).join(" ")}`}
      />
      <p className="text-body-small text-on-surface-variant">
        First time in this project? Add the registry and the base once, see{" "}
        <Link
          to="/docs/$slug"
          params={{ slug: "installation" }}
          className="text-primary underline underline-offset-2"
        >
          Installation
        </Link>
        .
      </p>

      <dl className="flex flex-col gap-3 rounded-lg bg-surface-container-low p-4">
        <Row label="npm packages">
          {npm.length ? (
            npm.map((d) => <Chip key={d}>{d}</Chip>)
          ) : (
            <span className="text-body-medium text-on-surface-variant">
              none
            </span>
          )}
        </Row>
        {others.length > 0 && (
          <Row label="Also installs">
            {others.map((d) => {
              const doc = DOCS.find((x) =>
                x.imports.some((i) => itemOf(i.from) === d)
              )
              return doc ? (
                <Link
                  key={d}
                  to="/components/$slug"
                  params={{ slug: doc.slug }}
                  className="inline-flex h-7 items-center rounded-sm border border-outline-variant px-2.5 text-label-medium text-primary hover:bg-primary/8"
                >
                  {d}
                </Link>
              ) : (
                <Chip key={d}>{d}</Chip>
              )
            })}
          </Row>
        )}
        {icons.length > 0 && (
          <Row label="Icons">
            {icons.map(([name, glyph]) => (
              <Chip key={name}>
                <Glyph
                  icon={`material-symbols:${glyph}`}
                  width={16}
                  height={16}
                  aria-hidden
                />
                {name}
              </Chip>
            ))}
          </Row>
        )}
        <Row label="Files">
          <ul className="flex min-w-0 flex-col gap-0.5 font-mono text-body-small text-on-surface-variant">
            {[...new Set(metas.flatMap((m) => m.files.map((f) => f.target)))]
              .toSorted()
              .map((t) => (
                <li key={t} className="truncate">
                  {t}
                </li>
              ))}
          </ul>
        </Row>
      </dl>
    </div>
  )
}

export { RegistryInstall }
