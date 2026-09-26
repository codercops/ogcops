/// <reference types="astro/client" />

// Cloudflare runtime on Astro.locals (env bindings, ctx.waitUntil). Absent in
// `astro dev`, so read it with optional chaining.
type Runtime = import('@astrojs/cloudflare').Runtime<Record<string, never>>;
declare namespace App {
  interface Locals {
    runtime?: Runtime['runtime'];
  }
}

// `.wasm?module` imports arrive precompiled, which is the only way Workers
// will run WebAssembly (see src/lib/og-engine.ts).
declare module '*.wasm?module' {
  const wasm: WebAssembly.Module;
  export default wasm;
}
