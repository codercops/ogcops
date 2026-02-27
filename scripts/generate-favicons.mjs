/**
 * Generate favicon PNGs and default OG image using satori + resvg-wasm.
 * Run: node scripts/generate-favicons.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Load Inter font
const interBold = readFileSync(join(publicDir, 'fonts', 'Inter-Bold.woff'));
const interSemiBold = readFileSync(join(publicDir, 'fonts', 'Inter-SemiBold.woff'));
const interRegular = readFileSync(join(publicDir, 'fonts', 'Inter-Regular.woff'));

const fonts = [
  { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
  { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' },
  { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
];

const ACCENT = '#E07A5F';
const DARK = '#0C0A09';
const LIGHT = '#FAFAF9';

// — Favicon (square monogram) —
async function generateFavicon(size) {
  const fontSize = Math.round(size * 0.5);
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: DARK,
          borderRadius: Math.round(size * 0.1875),
        },
        children: {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize,
              letterSpacing: '-0.03em',
            },
            children: [
              { type: 'span', props: { style: { color: LIGHT }, children: 'O' } },
              { type: 'span', props: { style: { color: ACCENT }, children: 'G' } },
            ],
          },
        },
      },
    },
    { width: size, height: size, fonts }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } });
  return resvg.render().asPng();
}

// — Apple Touch Icon (180x180, no border-radius per Apple guidelines) —
async function generateAppleTouchIcon() {
  const size = 180;
  const fontSize = 90;
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: DARK,
        },
        children: {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize,
              letterSpacing: '-0.03em',
            },
            children: [
              { type: 'span', props: { style: { color: LIGHT }, children: 'O' } },
              { type: 'span', props: { style: { color: ACCENT }, children: 'G' } },
            ],
          },
        },
      },
    },
    { width: size, height: size, fonts }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } });
  return resvg.render().asPng();
}

// — Default OG Image (1200x630) —
async function generateOgDefault() {
  const w = 1200;
  const h = 630;
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: w,
          height: h,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: DARK,
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: 96,
                fontWeight: 700,
                letterSpacing: '-0.04em',
              },
              children: [
                { type: 'span', props: { style: { color: LIGHT }, children: 'OG' } },
                { type: 'span', props: { style: { color: ACCENT }, children: 'COPS' } },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: 28,
                fontWeight: 400,
                color: '#A8A29E',
                marginTop: 20,
                letterSpacing: '0.02em',
              },
              children: 'Free OG Image Generator & Social Preview Checker',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginTop: 48,
                fontSize: 18,
                fontWeight: 600,
                color: '#78716C',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '6px 16px',
                      border: '1px solid #292524',
                      borderRadius: 8,
                      color: '#D6D3D1',
                      fontSize: 16,
                    },
                    children: '120+ Templates',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '6px 16px',
                      border: '1px solid #292524',
                      borderRadius: 8,
                      color: '#D6D3D1',
                      fontSize: 16,
                    },
                    children: '8 Platform Previews',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '6px 16px',
                      border: '1px solid #292524',
                      borderRadius: 8,
                      color: '#D6D3D1',
                      fontSize: 16,
                    },
                    children: 'Free API',
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: 32,
                fontSize: 16,
                color: '#57534E',
              },
              children: 'og.codercops.com',
            },
          },
        ],
      },
    },
    { width: w, height: h, fonts }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: w } });
  return resvg.render().asPng();
}

// — ICO file from PNG buffer (simple single-image ICO) —
function pngToIco(pngBuffer) {
  const imageSize = pngBuffer.length;
  // ICO header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(1, 2);      // ICO type
  header.writeUInt16LE(1, 4);      // 1 image

  // Directory entry: 16 bytes
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);         // width (32 = 32px, 0 = 256px)
  entry.writeUInt8(32, 1);         // height
  entry.writeUInt8(0, 2);          // color palette
  entry.writeUInt8(0, 3);          // reserved
  entry.writeUInt16LE(1, 4);       // color planes
  entry.writeUInt16LE(32, 6);      // bits per pixel
  entry.writeUInt32LE(imageSize, 8);  // image size
  entry.writeUInt32LE(22, 12);     // offset (6 + 16 = 22)

  return Buffer.concat([header, entry, pngBuffer]);
}

// — Generate all assets —
async function main() {
  console.log('Generating favicon-16x16.png...');
  writeFileSync(join(publicDir, 'favicon-16x16.png'), await generateFavicon(16));

  console.log('Generating favicon-32x32.png...');
  const favicon32 = await generateFavicon(32);
  writeFileSync(join(publicDir, 'favicon-32x32.png'), favicon32);

  console.log('Generating favicon.ico...');
  writeFileSync(join(publicDir, 'favicon.ico'), pngToIco(favicon32));

  console.log('Generating icon-192.png...');
  writeFileSync(join(publicDir, 'icon-192.png'), await generateFavicon(192));

  console.log('Generating icon-512.png...');
  writeFileSync(join(publicDir, 'icon-512.png'), await generateFavicon(512));

  console.log('Generating apple-touch-icon.png...');
  writeFileSync(join(publicDir, 'apple-touch-icon.png'), await generateAppleTouchIcon());

  console.log('Generating og-default.png...');
  writeFileSync(join(publicDir, 'og-default.png'), await generateOgDefault());

  console.log('Done! All assets written to public/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
