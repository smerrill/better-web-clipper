import * as esbuild from "esbuild";
import bookmarkletPlugin from "esbuild-plugin-bookmarklet";

await esbuild.build({
  entryPoints: ["obsidian-web-clipper.ts"],
  bundle: true,
  platform: "browser",
  target: ["firefox57", "chrome58"],
  format: "iife",
  write: false,
  outfile: "dist/obsidian-web-clipper.js",
  minify: true,
  plugins: [bookmarkletPlugin],
});
