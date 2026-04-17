# Releasing to npm

## Prerequisites

- npm account with access to publish `kollectionjs`
- Logged in: `npm login`

## Steps

### 1. Make sure everything is clean

```sh
pnpm test
pnpm typecheck
```

### 2. Bump the version

```sh
pnpm release
```

This runs `bumpp`, which interactively prompts for the new version (patch/minor/major), updates `package.json`, commits, and tags.

### 3. Publish

```sh
npm publish
```

`prepublishOnly` will run `pnpm build` automatically before publishing.

### 4. Push the tag

```sh
git push --follow-tags
```

## Notes

- The `dist/` folder is what gets published (controlled by `"files"` in `package.json`).
- To do a dry run without actually publishing: `npm publish --dry-run`
- To publish a pre-release (e.g. beta): bump to `1.1.0-beta.0` and run `npm publish --tag beta`
