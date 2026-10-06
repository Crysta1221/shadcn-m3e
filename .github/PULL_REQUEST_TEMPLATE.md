<!--
Thanks for contributing! Please read AGENTS.md first, and keep the title in
Conventional Commits form with a gitmoji, e.g. `:sparkles: feat(switch): Add handle icons`.
-->

## Summary

<!-- What does this change and why? Link the issue: Closes #123 -->

## Type of change

- [ ] `feat`: a new component or feature
- [ ] `fix`: a bug fix
- [ ] `docs`: documentation or demos only
- [ ] `refactor` / `perf` / `chore`: no behavior change

## Checklist

- [ ] The change meets the Material 3 design guidelines. If there is no matching component, I followed the guidelines of a similar component or of the components it uses.
- [ ] The change follows the rules in [AGENTS.md](https://github.com/Crysta1221/shadcn-m3e/blob/main/AGENTS.md).
- [ ] `bun run lint` and `bun run typecheck` report no errors or warnings. (`bun run typecheck` checks `apps/docs` and `packages/m3e`; a bare `bunx tsc --noEmit` at the root checks nothing.)
- [ ] `bun run format:check` passes.

If a file in `packages/m3e/src` changed:

- [ ] `bun run registry:build` succeeds and `registry-meta.generated.ts` is committed.
- [ ] `bun run gen:icons` was run after adding or renaming an icon, and `bun run check:icons` passes.

If a component or its API changed:

- [ ] The docs entry in `apps/docs/src/docs/data/` (description, imports, notes, props table) is updated.
- [ ] Demos live in `apps/docs/src/docs/examples/<slug>/`, each with its own `meta` and description, and are copy-pasteable.

## Verification

- [ ] Checked in the browser (`bun run dev`) on `/components/<slug>`, with no console errors.
- [ ] Checked in light and dark mode, and in a narrow window.
- [ ] Keyboard and focus behavior work; `prefers-reduced-motion` is honored.
- [ ] Press state, ripple and spring motion were verified by measuring, not only by eye.

## Screenshots / recordings

<!-- Before and after, for visual changes. -->
