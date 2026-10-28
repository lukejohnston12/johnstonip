// Renders the social share image and app icons. Run: node tools/make-images.mjs
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const font = (f) => `data:font/woff2;base64,${readFileSync(`${root}/assets/fonts/${f}`).toString("base64")}`;
const mark = readFileSync(`${root}/_includes/logo-mark.html`, "utf8");
const logo = readFileSync(`${root}/assets/img/logo.svg`, "utf8").replace(/<title>.*?<\/title>/, "");
const base = `
@font-face{font-family:M;src:url(${font("archivo-display.woff2")});font-weight:500 800}
@font-face{font-family:I;src:url(${font("public-sans.woff2")});font-weight:100 900}
*{margin:0;box-sizing:border-box}body{background:#0b1f33}`;

const og = `<style>${base}
.c{position:relative;width:1200px;height:630px;overflow:hidden;padding:72px 80px;color:#0b1f33;font-family:M;
background:#26abe3}
.b svg{height:70px;width:auto;display:block}
h1{margin-top:92px;font-size:80px;line-height:1;font-weight:700;letter-spacing:-2px;max-width:1000px}.sym{color:#fff}
h1 span{color:#26abe3}p{position:absolute;left:80px;right:80px;bottom:60px;font:600 26px I;color:#0b1f33}.b{display:inline-block;background:#0b1f33;padding:18px 22px;border-radius:8px}</style>
<div class="c">
<div class="b">${logo}</div>
<h1>We take brands from ™ to <span class="sym">®</span> and inventions to patent.</h1>
<p>Dallas trademark and patent attorneys. 7,500+ trademarks registered.</p></div>`;

const icon = (size) => `<style>${base}
.i{width:${size}px;height:${size}px;display:grid;place-items:center;background:#0b1f33}.i svg{width:72%}</style>
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
