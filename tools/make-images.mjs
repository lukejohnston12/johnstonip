// Renders the social share image and app icons. Run: node tools/make-images.mjs
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const font = (f) => `data:font/woff2;base64,${readFileSync(`${root}/assets/fonts/${f}`).toString("base64")}`;
const mark = readFileSync(`${root}/_includes/logo-mark.html`, "utf8");
const base = `
@font-face{font-family:M;src:url(${font("montserrat-var.woff2")});font-weight:100 900}
@font-face{font-family:I;src:url(${font("inter-var.woff2")});font-weight:100 900}
*{margin:0;box-sizing:border-box}body{background:#0d1117}`;

const og = `<style>${base}
.c{position:relative;width:1200px;height:630px;overflow:hidden;padding:72px 80px;color:#fff;font-family:M;
background:radial-gradient(800px 400px at 95% 0,rgba(41,180,239,.35),transparent 60%),#0d1117}
.s{position:absolute;right:-60px;top:-40px;width:720px;opacity:.9}
.b{display:flex;align-items:center;gap:16px;font-weight:700;font-size:30px}.b svg{width:80px}
h1{margin-top:96px;font-size:68px;line-height:1.05;font-weight:800;letter-spacing:-2px;max-width:880px}
h1 span{color:#29b4ef}p{margin-top:28px;font:500 26px I;color:#a9b4c0}</style>
<div class="c">${readFileSync(`${root}/_includes/slashes.html`, "utf8").replace('class="slashes"', 'class="s"').replace(/class="s s\d"|class="s"(?= d)/g, "")}
<div class="b">${mark}Johnston IP Law</div>
<h1>Grow your brand with <span>trademarks.</span> Protect what you invent with <span>patents.</span></h1>
<p>Dallas IP counsel · 7,500+ USPTO trademark registrations · Free discovery session</p></div>`;

const icon = (size) => `<style>${base}
.i{width:${size}px;height:${size}px;display:grid;place-items:center;background:#0d1117}.i svg{width:72%}</style>
<div class="i">${mark}</div>`;

const browser = await chromium.launch();
const shot = async (html, w, h, out) => {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.setContent(html); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${root}/${out}` }); await p.close();
};
await shot(og, 1200, 630, "assets/img/og.png");
await shot(icon(180), 180, 180, "assets/img/apple-touch-icon.png");
await shot(icon(512), 512, 512, "assets/img/icon-512.png");
// favicon.ico: a PNG-in-ICO wrapper around a 32px render
const p = await browser.newPage({ viewport: { width: 32, height: 32 } });
await p.setContent(icon(32)); const png = await p.screenshot();
const hdr = Buffer.alloc(22); hdr.writeUInt16LE(0, 0); hdr.writeUInt16LE(1, 2); hdr.writeUInt16LE(1, 4);
hdr.writeUInt8(32, 6); hdr.writeUInt8(32, 7); hdr.writeUInt16LE(1, 10); hdr.writeUInt16LE(32, 12);
hdr.writeUInt32LE(png.length, 14); hdr.writeUInt32LE(22, 18);
writeFileSync(`${root}/favicon.ico`, Buffer.concat([hdr, png]));
await browser.close();
console.log("images written");
