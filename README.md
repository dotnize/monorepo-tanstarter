# Monorepo TanStarter

> [!NOTE]
> This will most likely be merged into [react-tanstarter](https://github.com/dotnize/react-tanstarter) soon.

A monorepo template for 🏝️ TanStack Start and Cloudflare.

- [Turborepo](https://turborepo.com/) + [pnpm](https://pnpm.io/)
- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest) + [Form](https://tanstack.com/form/latest)
- [Vite 8](https://vite.dev/blog/announcing-vite8-beta) (beta) + [Cloudflare](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + Cloudflare D1
- [Better Auth](https://www.better-auth.com/)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) + [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) + [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)

### Structure

```sh
.
├── apps
│    ├── web                    # TanStack Start web app
├── packages
│    ├── auth                   # Better Auth
│    ├── db                     # Drizzle ORM + Drizzle Kit + Cloudflare D1
│    └── ui                     # shadcn/ui primitives & utils
├── tooling
│    └── eslint-config          # Shared ESLint configuration
│    └── tsconfig               # Shared TypeScript configuration
├── turbo.json
├── LICENSE
└── README.md
```

## Table of Contents

- [Getting Started](#getting-started)
- [Deploying to production](#deploying-to-production)
- [Issue watchlist](#issue-watchlist)
- [Goodies](#goodies)
  - [Scripts](#scripts)
  - [Utilities](#utilities)
- [Third-party integrations](#thirdparty-integrations)
- [Ecosystem](#ecosystem)

## Getting Started

1. [Use this template](https://github.com/new?template_name=monorepo-tanstarter&template_owner=dotnize) or clone this repository with gitpick:

   ```sh
   npx gitpick dotnize/monorepo-tanstarter myproject
   cd myproject
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Create a `.env` file in `/apps/web` based on the [`.env.example`](./apps/web/.env.example).

   ```sh
   cp ./apps/web/.env.example ./apps/web/.env
   ```

4. Create a D1 database using Wrangler, with `db` as the binding name:

   ```sh
   pnpm wrangler d1 create <db-name>
   ```

5. Generate the initial migration with drizzle-kit:

   ```sh
   pnpm db:generate
   ```

6. Apply the migration to your local D1 database:

   ```sh
   pnpm db:migrate:local <db-name>
   ```

7. Run the development server:

   ```sh
   pnpm dev
   ```

   The development server should now be running at [http://localhost:5173](http://localhost:5173).

## Deploying to production

The [vite config](./apps/web/vite.config.ts#L15-L16) is currently configured for [Cloudflare](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/), but can be easily switched to other providers.

Refer to the [TanStack Start hosting docs](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) for deploying to other platforms.

## Issue watchlist

- [Router/Start issues](https://github.com/TanStack/router/issues) - TanStack Start is in RC.
- [Devtools releases](https://github.com/TanStack/devtools/releases) - TanStack Devtools is in alpha and may still have breaking changes.
- [Vite 8 beta](https://vite.dev/blog/announcing-vite8-beta) - We're using Vite 8 beta which is powered by Rolldown.
- [Drizzle ORM v1 Beta](https://orm.drizzle.team/docs/relations-v1-v2) - Drizzle ORM v1 is in beta with relations v2.
- [Better Auth beta](https://github.com/better-auth/better-auth/pull/6913) - We're using a PR branch of Better Auth that supports Drizzle relations v2.

## Goodies

#### Scripts

We use **pnpm** by default, but you can modify these scripts in [package.json](./package.json) to use your preferred package manager.

- **`auth:generate`** - Regenerate the [auth db schema](./packages/db/src/schema/auth.schema.ts) if you've made changes to your Better Auth [config](./packages/auth/src/auth.ts).
- **`db`** - Run [drizzle-kit](https://orm.drizzle.team/docs/kit-overview) commands. (e.g. `pnpm db generate`, `pnpm db studio`)
- **`ui`** - The shadcn/ui CLI. (e.g. `pnpm ui add button`)
- **`format`**, **`lint`**, **`check-types`** - Run Prettier, ESLint, and check TypeScript types respectively.
  - **`check`** - Run all three above. (e.g. `pnpm check`)
- **`deps`** - Selectively upgrade dependencies via taze.

> [!TIP]
> Check the root [package.json](./package.json) and each workspace package's respective `package.json` to see the full list of available scripts.

#### Utilities

- [`/auth/src/tanstack/middleware.ts`](./packages/auth/src/tanstack/middleware.ts) - Sample middleware for forcing authentication on server functions. (see [#5](https://github.com/dotnize/react-tanstarter/issues/5#issuecomment-2615905686) and [#17](https://github.com/dotnize/react-tanstarter/issues/17#issuecomment-2853482062))
- [`/web/src/components/theme-toggle.tsx`](./apps/web/src/components/theme-toggle.tsx), [`/ui/lib/theme-provider.tsx`](./packages/ui/lib/theme-provider.tsx) - A theme toggle and provider for toggling between light and dark mode. ([#7](https://github.com/dotnize/react-tanstarter/issues/7#issuecomment-3141530412))

## Third‑party integrations

The template is kept minimal by default, but is compatible with many third‑party integrations. Here are a few I use in my projects:

- [Cloudflare R2](https://developers.cloudflare.com/r2/) - file storage
- [PostHog](https://posthog.com/) - analytics & observability
- [Resend](https://resend.com/) - email
- [Polar](https://polar.sh/) - billing

## License

[MIT](./LICENSE)

## Ecosystem

- [TanStack MCP](https://tanstack.com/cli/latest/docs/mcp/connecting) - The official MCP server for searching the latest docs for TanStack libraries.
- [awesome-tanstack-start](https://github.com/Balastrong/awesome-tanstack-start) - A curated list of awesome resources for TanStack Start.
- [shadcn/ui Directory](https://ui.shadcn.com/docs/directory), [shoogle.dev](https://shoogle.dev/) - Component directories for shadcn/ui.
