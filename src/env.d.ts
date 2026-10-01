/// <reference types="astro/client" />

// `.wasm?module` imports arrive precompiled, which is the only way Workers
// will run WebAssembly (see src/lib/og-engine.ts).
declare module '*.wasm?module' {
  const wasm: WebAssembly.Module;
  export default wasm;
}
