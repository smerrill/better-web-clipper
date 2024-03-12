# better-web-clipper

## Overview

An upgrade on @kepano's fine Obsidian web clipper from https://gist.github.com/kepano/90c05f162c37cf730abb8ff027987ca3 which bundles everything into the bookmarklet so that you can run it even on CSP-protected sites.

I have also added some support to prevent titles from being far too long and preventing Twitter titles from breaking the front matter.

## TODO

- Add tests
- Make a static site to distribute this bookmarklet

## Working on this repo

To install dependencies:

```bash
bun install
```

To build and copy to your clipboard on MacOS:

```bash
bun run esbuild.mjs; pbcopy < dist/obsidian-web-clipper.js
```

Then paste that into a bookmark and happily clip, even from a CSP-protected site.

This project was created using `bun init` in bun v1.0.30. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
