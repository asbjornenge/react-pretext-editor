var Ut = Object.defineProperty;
var Kt = (n, e, t) => e in n ? Ut(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var W = (n, e, t) => Kt(n, typeof e != "symbol" ? e + "" : e, t);
import { jsxs as j, jsx as $, Fragment as Vt } from "react/jsx-runtime";
import Ze, { useContext as Jt, createContext as en, forwardRef as zt, createElement as Qe, useState as de, useRef as ae, useEffect as ve, useCallback as le } from "react";
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const It = (...n) => n.filter((e, t, r) => !!e && e.trim() !== "" && r.indexOf(e) === t).join(" ").trim();
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const tn = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const nn = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, r) => r ? r.toUpperCase() : t.toLowerCase()
);
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bt = (n) => {
  const e = nn(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Ge = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const rn = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
}, sn = en({}), on = () => Jt(sn), ln = zt(
  ({ color: n, size: e, strokeWidth: t, absoluteStrokeWidth: r, className: s = "", children: i, iconNode: l, ...o }, c) => {
    const {
      size: h = 24,
      strokeWidth: f = 2,
      absoluteStrokeWidth: y = !1,
      color: k = "currentColor",
      className: d = ""
    } = on() ?? {}, I = r ?? y ? Number(t ?? f) * 24 / Number(e ?? h) : t ?? f;
    return Qe(
      "svg",
      {
        ref: c,
        ...Ge,
        width: e ?? h ?? Ge.width,
        height: e ?? h ?? Ge.height,
        stroke: n ?? k,
        strokeWidth: I,
        className: It("lucide", d, s),
        ...!i && !rn(o) && { "aria-hidden": "true" },
        ...o
      },
      [
        ...l.map(([R, A]) => Qe(R, A)),
        ...Array.isArray(i) ? i : [i]
      ]
    );
  }
);
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const we = (n, e) => {
  const t = zt(
    ({ className: r, ...s }, i) => Qe(ln, {
      ref: i,
      iconNode: e,
      className: It(
        `lucide-${tn(bt(n))}`,
        `lucide-${n}`,
        r
      ),
      ...s
    })
  );
  return t.displayName = bt(n), t;
};
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const an = [
  ["path", { d: "m15 16 2.536-7.328a1.02 1.02 1 0 1 1.928 0L22 16", key: "xik6mr" }],
  ["path", { d: "M15.697 14h5.606", key: "1stdlc" }],
  ["path", { d: "m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16", key: "d5nyq2" }],
  ["path", { d: "M3.304 13h6.392", key: "1q3zxz" }]
], cn = we("a-large-small", an);
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const pn = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M12 3v18", key: "108xh3" }]
], hn = we("columns-2", pn);
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const un = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
], dn = we("eye", un);
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const gn = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
], fn = we("layout-grid", gn);
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xn = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
], kn = we("pen", xn);
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bn = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
], mn = we("plus", bn);
/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const yn = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], wn = we("x", yn);
let $e = null, Pe = null;
function Sn() {
  return $e ? Promise.resolve($e) : Pe || (Pe = import("./layout-BDxeR5zj.js").then((n) => ($e = n, $e)), Pe);
}
function Rn() {
  const [n, e] = de(!!$e), t = ae($e);
  return ve(() => {
    t.current || Sn().then((r) => {
      t.current = r, e(!0);
    });
  }, []), n ? t.current : null;
}
const $n = {
  bodyFont: "16px Lato, sans-serif",
  headingFont: "bold 24px Lato, sans-serif",
  h1Font: "bold 32px Lato, sans-serif",
  h2Font: "bold 24px Lato, sans-serif",
  h3Font: "bold 20px Lato, sans-serif",
  dropCapFont: "96px FloralCapitals, serif",
  bodyLineHeight: 26,
  headingLineHeight: 36,
  h1LineHeight: 42,
  h2LineHeight: 34,
  h3LineHeight: 28,
  blockGap: 16,
  imgPadding: 10,
  dropCap: !1,
  dropCapOffsetX: 0,
  dropCapOffsetY: 0,
  columns: 1,
  minColumnWidth: 300
};
function Cr(n) {
  return !n || !n.children ? [] : n.children.map((e) => {
    const t = (e.children || []).map((r) => r.text || "").join("");
    return {
      type: e.type === "heading" ? "heading" : "paragraph",
      text: t,
      tag: e.tag || "p"
    };
  }).filter((e) => e.text.length > 0);
}
function Cn(n, e, t, r) {
  const s = n.width * (n.aspectRatio || 1.2);
  if (e < n.y || e >= n.y + s + t) return null;
  const i = n.x, l = { left: i - t, right: i + n.width + t };
  if (n.polygon && n.polygon.length >= 3) {
    const o = (e - n.y) / s;
    if (o < 0 || o > 1) return l;
    let c = 1 / 0, h = -1 / 0;
    const f = n.polygon;
    for (let y = 0; y < f.length; y++) {
      const k = f[y], d = f[(y + 1) % f.length];
      if (k.y <= o && d.y > o || d.y <= o && k.y > o) {
        const I = (o - k.y) / (d.y - k.y), R = k.x + I * (d.x - k.x), A = i + R * n.width;
        c = Math.min(c, A), h = Math.max(h, A);
      }
    }
    return c === 1 / 0 ? l : { left: c - t * 0.4, right: h + t };
  }
  return l;
}
function vn(n, e, t, r, s) {
  const i = [];
  for (let c = 0; c < n.length; c++) {
    const h = Cn(n[c], e, r);
    h && i.push(h);
  }
  if (i.length === 0) return [{ left: 0, right: t }];
  i.sort((c, h) => c.left - h.left);
  const l = [];
  let o = 0;
  for (const c of i)
    c.left > o && l.push({ left: o, right: Math.min(c.left, t) }), o = Math.max(o, c.right);
  return o < t && l.push({ left: o, right: t }), l.filter((c) => c.right - c.left > 30);
}
function zn(n, e, t) {
  const r = e < 1 ? Math.sqrt(e) : e;
  return n.map((s, i) => ({
    index: i,
    x: s.x * e,
    y: s.y * e,
    width: s.width * r,
    aspectRatio: s.aspectRatio,
    polygon: s.polygon,
    url: s.url,
    alt: s.alt,
    filename: s.filename
  }));
}
function In(n, e, t, r) {
  let s = 0;
  for (const i of n) {
    if (i.type === "hr") {
      s += 20 + r.blockGap;
      continue;
    }
    if (i.type === "code") {
      s += i.text.split(`
`).length * 20 + 20 + r.blockGap;
      continue;
    }
    if (i.type === "list") {
      for (const y of i.items || []) {
        const k = t.prepareWithSegments(y.text, r.bodyFont);
        let d = { segmentIndex: 0, graphemeIndex: 0 };
        for (; ; ) {
          const I = t.layoutNextLine(k, d, e - 24);
          if (!I) break;
          s += r.bodyLineHeight, d = I.end;
        }
        s += 4;
      }
      s += r.blockGap;
      continue;
    }
    const l = i.type === "heading", o = l ? i.tag === "h1" ? r.h1Font : i.tag === "h3" ? r.h3Font : r.h2Font : r.bodyFont, c = l ? i.tag === "h1" ? r.h1LineHeight : i.tag === "h3" ? r.h3LineHeight : r.h2LineHeight : r.bodyLineHeight;
    l && (s += r.blockGap);
    const h = t.prepareWithSegments(i.text, o);
    let f = { segmentIndex: 0, graphemeIndex: 0 };
    for (; ; ) {
      const y = t.layoutNextLine(h, f, e);
      if (!y) break;
      s += c, f = y.end;
    }
    s += r.blockGap;
  }
  return s;
}
function Tn(n, e, t, r, s = {}, i) {
  const l = { ...$n, ...s }, o = 20;
  let c = l.columns;
  c > 1 && t / c < l.minColumnWidth && (c = Math.max(1, Math.floor(t / l.minColumnWidth)));
  const h = c > 1 ? (t - (c - 1) * o) / c : t, f = Array.from({ length: c }, () => []);
  for (const _ of e)
    for (let B = 0; B < c; B++) {
      const q = B * (h + o), p = q + h;
      _.x + _.width > q && _.x < p && f[B].push({ ..._, x: _.x - q });
    }
  const y = 24, k = 20, d = 3, I = (_, B) => {
    const q = [], p = (L, v, D, b, u, z, S, C, O, oe, se = 1 / 0) => {
      const V = r.prepareWithSegments(L, v);
      let ie = { segmentIndex: 0, graphemeIndex: 0 }, G = S, Q = 0;
      for (; ; ) {
        if (c > 1 && G >= _ && C < c - 1)
          return { y: G, cursor: ie, done: !1, overflow: !0, charOffset: Q };
        const K = G < se ? b : 0, J = vn(u, G, h, l.imgPadding);
        if (J.length === 0) {
          G += D;
          continue;
        }
        const xe = J.filter((ge) => Math.min(ge.right, h) - Math.max(ge.left, K) >= 30);
        if (xe.length === 0) {
          G += D;
          continue;
        }
        let Ie = !1;
        for (const ge of xe) {
          const Te = Math.min(ge.right, h) - Math.max(ge.left, K), Ye = Math.max(ge.left, K), Re = r.layoutNextLine(V, ie, Te);
          if (!Re)
            return Ie && (G += D), { y: G, cursor: ie, done: !0, overflow: !1, charOffset: Q };
          q.push({
            type: "text",
            text: Re.text,
            x: Ye + z,
            y: G,
            font: v,
            blockIndex: O,
            segments: oe,
            charOffset: Q
          }), Q += Re.text.length, ie = Re.end, Ie = !0;
        }
        Ie && (G += D);
      }
    };
    let m = 0, M = null, P = 0, te = !0;
    e:
      for (let L = 0; L < c; L++) {
        const v = L * (h + o), D = f[L];
        let b = 0;
        for (; m < n.length; ) {
          const u = n[m];
          if (c > 1 && b >= _ && L < c - 1) {
            P = Math.max(P, b);
            continue e;
          }
          switch (u.type) {
            case "heading": {
              M === null && (b += l.blockGap);
              const z = u.tag === "h1" ? l.h1Font : u.tag === "h3" ? l.h3Font : l.h2Font, S = u.tag === "h1" ? l.h1LineHeight : u.tag === "h3" ? l.h3LineHeight : l.h2LineHeight, C = p(
                u.text,
                z,
                S,
                0,
                D,
                v,
                b,
                L,
                m,
                u.segments
              );
              if (b = C.y, C.overflow) {
                M = C.cursor, P = Math.max(P, b);
                continue e;
              }
              break;
            }
            case "paragraph": {
              if (l.dropCap && te && u.text.length > 0 && i) {
                te = !1;
                const z = u.text[0], S = i(z, l.dropCapFont), C = S.width + 8, O = S.height * 0.78, oe = l.dropCapOffsetX, se = l.dropCapOffsetY;
                q.push({
                  type: "dropCap",
                  char: z,
                  x: v + oe,
                  y: b + se,
                  font: l.dropCapFont,
                  blockIndex: m
                });
                const V = u.text.slice(1), ie = u.segments ? (() => {
                  const K = [...u.segments];
                  return K.length > 0 && K[0].text.length > 0 && (K[0] = { ...K[0], text: K[0].text.slice(1) }), K;
                })() : void 0, G = b + O, Q = p(
                  V,
                  l.bodyFont,
                  l.bodyLineHeight,
                  C,
                  D,
                  v,
                  b,
                  L,
                  m,
                  ie,
                  G
                );
                if (b = Q.y, Q.overflow) {
                  M = Q.cursor, P = Math.max(P, b);
                  continue e;
                }
              } else {
                u.type === "paragraph" && (te = !1);
                const z = p(
                  u.text,
                  l.bodyFont,
                  l.bodyLineHeight,
                  0,
                  D,
                  v,
                  b,
                  L,
                  m,
                  u.segments
                );
                if (b = z.y, z.overflow) {
                  M = z.cursor, P = Math.max(P, b);
                  continue e;
                }
              }
              break;
            }
            case "list": {
              const z = u.items || [];
              for (let S = 0; S < z.length; S++) {
                const C = z[S], O = u.tag === "ol" ? `${S + 1}.` : "•";
                q.push({
                  type: "listBullet",
                  text: O,
                  x: v + 4,
                  y: b,
                  font: l.bodyFont,
                  blockIndex: m
                }), b = p(
                  C.text,
                  l.bodyFont,
                  l.bodyLineHeight,
                  y,
                  D,
                  v,
                  b,
                  L,
                  m,
                  C.segments
                ).y + 4;
              }
              break;
            }
            case "blockquote": {
              const z = b;
              q.push({
                type: "blockquoteBorder",
                x: v + 4,
                y: z,
                width: d,
                height: 0,
                // placeholder, updated below
                blockIndex: m
              });
              const S = p(
                u.text,
                l.bodyFont,
                l.bodyLineHeight,
                k,
                D,
                v,
                b,
                L,
                m,
                u.segments
              );
              if (b = S.y, q.length > 0) {
                q[q.length - 1 - (S.charOffset > 0 ? Math.ceil(S.charOffset / 40) : 0)];
                for (let C = q.length - 1; C >= 0; C--)
                  if (q[C].type === "blockquoteBorder" && q[C].blockIndex === m) {
                    q[C].height = b - z;
                    break;
                  }
              }
              break;
            }
            case "code": {
              const z = "14px 'SF Mono', 'Fira Code', Consolas, monospace", C = u.text.split(`
`), O = b;
              q.push({
                type: "codeBlock",
                x: v,
                y: O,
                width: h,
                height: C.length * 20 + 20,
                language: u.language,
                blockIndex: m
              }), b += 10;
              for (const oe of C)
                q.push({
                  type: "text",
                  text: oe,
                  x: v + 12,
                  y: b,
                  font: z,
                  blockIndex: m
                }), b += 20;
              b += 10;
              break;
            }
            case "hr": {
              b += 10, q.push({
                type: "hr",
                x: v,
                y: b,
                width: h,
                blockIndex: m
              }), b += 10;
              break;
            }
            default: {
              b = p(
                u.text,
                l.bodyFont,
                l.bodyLineHeight,
                0,
                D,
                v,
                b,
                L,
                m,
                u.segments
              ).y;
              break;
            }
          }
          m++, M = null, b += l.blockGap;
        }
        P = Math.max(P, b);
        break;
      }
    return { elements: q, maxColumnY: P };
  }, R = In(n, h, r, l);
  let A;
  if (c > 1) {
    let _ = 0;
    for (const B of e) {
      const q = B.width * (B.aspectRatio || 1.2), p = Math.min(1, B.width / h);
      _ += q * p;
    }
    A = Math.ceil((R + _) / c);
  } else
    A = R;
  const { elements: X, maxColumnY: re } = I(A);
  let E = re;
  for (const _ of e) {
    const B = _.width * (_.aspectRatio || 1.2);
    E = Math.max(E, _.y + B), X.push({
      type: "image",
      x: _.x,
      y: _.y,
      width: _.width,
      imageIndex: _.index,
      url: _.url,
      alt: _.alt,
      polygon: _.polygon
    });
  }
  return { elements: X, totalHeight: E };
}
function Ln(n, e) {
  if (n.breakpoints && n.breakpoints.length > 0) {
    const t = [...n.breakpoints].map((r, s) => ({ bp: r, idx: s })).sort((r, s) => r.bp.maxWidth - s.bp.maxWidth);
    for (const { bp: r, idx: s } of t)
      if (e <= r.maxWidth)
        return {
          images: r.images,
          columns: r.columns,
          editorWidth: r.editorWidth,
          fontFamily: r.fontFamily ?? n.fontFamily,
          fontSize: r.fontSize ?? n.fontSize,
          initialCap: r.initialCap ?? n.initialCap,
          initialCapFont: r.initialCapFont ?? n.initialCapFont,
          initialCapSize: r.initialCapSize ?? n.initialCapSize,
          initialCapOffsetX: r.initialCapOffsetX ?? n.initialCapOffsetX,
          initialCapOffsetY: r.initialCapOffsetY ?? n.initialCapOffsetY,
          breakpointIndex: s
        };
  }
  return {
    images: n.images,
    columns: n.columns,
    editorWidth: n.editorWidth,
    fontFamily: n.fontFamily,
    fontSize: n.fontSize,
    initialCap: n.initialCap,
    initialCapFont: n.initialCapFont,
    initialCapSize: n.initialCapSize,
    initialCapOffsetX: n.initialCapOffsetX,
    initialCapOffsetY: n.initialCapOffsetY,
    breakpointIndex: -1
  };
}
function Tt({
  blocks: n,
  layout: e,
  config: t,
  availableFonts: r,
  availableInitialFonts: s,
  resolveImageUrl: i,
  className: l,
  style: o,
  editorMode: c,
  containerRef: h
}) {
  const f = Rn(), y = ae(null), k = h || y, [d, I] = de(null), [R, A] = de(!1), [X, re] = de(0);
  ve(() => {
    document.fonts.ready.then(() => A(!0));
    const p = () => re((m) => m + 1);
    return document.fonts.addEventListener("loadingdone", p), () => document.fonts.removeEventListener("loadingdone", p);
  }, []);
  const E = le(() => {
    if (!f || !k.current || n.length === 0) return;
    const p = k.current.offsetWidth, m = Ln(e, p), M = m.editorWidth || 700, P = p / M, te = zn(m.images || [], P), L = m.fontFamily, v = r == null ? void 0 : r.find((Q) => Q.name === L), b = v ? v.bodyFont.replace(/^\d+px\s*/, "") : "Lato, sans-serif", u = m.fontSize || 16, z = {
      bodyFont: `${u}px ${b}`,
      headingFont: `bold ${u}px ${b}`,
      h1Font: `bold ${Math.round(u * 2)}px ${b}`,
      h2Font: `bold ${Math.round(u * 1.5)}px ${b}`,
      h3Font: `bold ${Math.round(u * 1.25)}px ${b}`,
      bodyLineHeight: Math.round(u * 1.6),
      h1LineHeight: Math.round(u * 2 * 1.3),
      h2LineHeight: Math.round(u * 1.5 * 1.4),
      h3LineHeight: Math.round(u * 1.25 * 1.4),
      ...v != null && v.bodyLineHeight ? { bodyLineHeight: v.bodyLineHeight } : {},
      ...v != null && v.headingLineHeight ? { headingLineHeight: v.headingLineHeight } : {}
    }, S = m.initialCap || !1, C = s == null ? void 0 : s.find((Q) => Q.name === m.initialCapFont), O = (C == null ? void 0 : C.fontFamily) || "serif", se = `${m.initialCapSize || 96}px ${O}`, V = {
      ...t,
      ...z,
      dropCap: S,
      dropCapFont: se,
      dropCapOffsetX: m.initialCapOffsetX ?? 0,
      dropCapOffsetY: m.initialCapOffsetY ?? 0,
      columns: m.columns || (t == null ? void 0 : t.columns) || 1
    }, ie = (Q, K) => {
      const J = document.createElement("span");
      J.textContent = Q, J.style.cssText = `position:absolute;font:${K};visibility:hidden;line-height:1;`, k.current.appendChild(J);
      const xe = J.getBoundingClientRect();
      return k.current.removeChild(J), { width: xe.width, height: xe.height };
    };
    if (S && se && !document.fonts.check(se)) {
      document.fonts.load(se).then(() => E());
      return;
    }
    const G = Tn(n, te, p, f, V, ie);
    I({ ...G, activeImages: m.images || [] });
  }, [f, n, e, t, r, s, R, X]);
  ve(() => {
    E();
  }, [E]), ve(() => {
    if (!k.current) return;
    const p = new ResizeObserver(() => E());
    return p.observe(k.current), () => p.disconnect();
  }, [E]);
  const _ = (p, m) => i ? i(p, m) : p, B = !!c, q = (p, m, M) => {
    if (!m || m.length === 0) return p;
    const P = M || 0, te = P + p.length;
    let L = 0;
    const v = [];
    let D = 0;
    for (const b of m) {
      const u = L + b.text.length, z = Math.max(L, P), S = Math.min(u, te);
      if (z < S) {
        const C = b.text.slice(z - L, S - L), O = {};
        b.bold && (O.fontWeight = "bold"), b.italic && (O.fontStyle = "italic"), b.code && (O.fontFamily = "'SF Mono', 'Fira Code', Consolas, monospace", O.background = "rgba(80,37,129,0.08)", O.padding = "1px 4px", O.borderRadius = "3px", O.fontSize = "0.9em"), b.link && (O.color = "#502581", O.textDecoration = "underline"), b.strikethrough && (O.textDecoration = "line-through"), Object.keys(O).length > 0 ? v.push(/* @__PURE__ */ $("span", { style: O, children: C }, D++)) : v.push(/* @__PURE__ */ $(Ze.Fragment, { children: C }, D++));
      }
      L = u;
    }
    return v.length > 0 ? v : p;
  };
  return /* @__PURE__ */ j(
    "div",
    {
      ref: k,
      className: l,
      style: { position: "relative", minHeight: "100%", ...o },
      onMouseDown: c == null ? void 0 : c.onBackgroundMouseDown,
      onClick: c == null ? void 0 : c.onBackgroundClick,
      onMouseMove: c == null ? void 0 : c.onMouseMove,
      onMouseUp: c == null ? void 0 : c.onMouseUp,
      onMouseLeave: c == null ? void 0 : c.onMouseLeave,
      children: [
        !d && /* @__PURE__ */ $("div", { children: n.map((p, m) => p.type === "heading" ? /* @__PURE__ */ $("h2", { children: p.text }, m) : /* @__PURE__ */ $("p", { children: p.text }, m)) }),
        d && /* @__PURE__ */ j("div", { style: { position: "relative", height: d.totalHeight }, children: [
          d.elements.map((p, m) => {
            if (p.type === "dropCap")
              return /* @__PURE__ */ $(
                "span",
                {
                  style: {
                    position: "absolute",
                    font: p.font,
                    color: "#502581",
                    left: p.x,
                    top: p.y,
                    lineHeight: 1,
                    pointerEvents: "none"
                  },
                  children: p.char
                },
                `dropcap-${m}`
              );
            if (p.type === "text")
              return /* @__PURE__ */ $(
                "span",
                {
                  style: {
                    position: "absolute",
                    font: p.font,
                    whiteSpace: "pre",
                    left: p.x,
                    top: p.y,
                    color: "#333",
                    pointerEvents: "none"
                  },
                  children: q(p.text || "", p.segments, p.charOffset || 0)
                },
                `text-${m}`
              );
            if (p.type === "listBullet")
              return /* @__PURE__ */ $(
                "span",
                {
                  style: {
                    position: "absolute",
                    font: p.font,
                    left: p.x,
                    top: p.y,
                    color: "#502581",
                    pointerEvents: "none",
                    fontWeight: 600
                  },
                  children: p.text
                },
                `bullet-${m}`
              );
            if (p.type === "blockquoteBorder")
              return /* @__PURE__ */ $(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: p.x,
                    top: p.y,
                    width: p.width,
                    height: p.height,
                    background: "#502581",
                    borderRadius: 2,
                    opacity: 0.4,
                    pointerEvents: "none"
                  }
                },
                `bqborder-${m}`
              );
            if (p.type === "codeBlock")
              return /* @__PURE__ */ $(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: p.x,
                    top: p.y,
                    width: p.width,
                    height: p.height,
                    background: "#f5f2f0",
                    border: "1px solid #e0d8d0",
                    borderRadius: 4,
                    pointerEvents: "none"
                  }
                },
                `code-${m}`
              );
            if (p.type === "hr")
              return /* @__PURE__ */ $(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: p.x,
                    top: p.y,
                    width: p.width,
                    height: 1,
                    background: "#ccc",
                    pointerEvents: "none"
                  }
                },
                `hr-${m}`
              );
            if (p.type === "image") {
              const M = p.imageIndex, P = d.activeImages[M], te = P ? _(P.url, P.filename) : p.url, L = B && c.selectedImageIndex === M, v = B && c.drawingPolygonIndex === M, D = p.polygon && p.polygon.length >= 3, b = D ? `polygon(${p.polygon.map((z) => `${z.x * 100}% ${z.y * 100}%`).join(", ")})` : void 0, u = B ? v ? "crosshair" : "grab" : void 0;
              return /* @__PURE__ */ j(Ze.Fragment, { children: [
                B && D && /* @__PURE__ */ $(
                  "img",
                  {
                    src: te,
                    alt: "",
                    "data-image-index": M,
                    onMouseDown: (z) => {
                      var S;
                      return (S = c.onImageMouseDown) == null ? void 0 : S.call(c, z, M);
                    },
                    style: {
                      position: "absolute",
                      left: p.x,
                      top: p.y,
                      width: p.width,
                      borderRadius: 4,
                      opacity: 0.15,
                      cursor: u
                    }
                  }
                ),
                /* @__PURE__ */ $(
                  "img",
                  {
                    src: te,
                    alt: p.alt,
                    "data-image-index": M,
                    onMouseDown: B ? (z) => {
                      var S;
                      return (S = c.onImageMouseDown) == null ? void 0 : S.call(c, z, M);
                    } : void 0,
                    style: {
                      position: "absolute",
                      left: p.x,
                      top: p.y,
                      width: p.width,
                      border: B ? `2px solid ${L ? "#502581" : "transparent"}` : "none",
                      borderRadius: 4,
                      clipPath: b,
                      cursor: u,
                      pointerEvents: B && D ? "none" : void 0
                    }
                  }
                )
              ] }, `img-${m}`);
            }
            return null;
          }),
          B && d.elements.map((p, m) => {
            var D;
            if (p.type !== "image") return null;
            const M = p.imageIndex, P = p.polygon || [], te = c.selectedImageIndex === M, L = c.drawingPolygonIndex === M, v = p.width * (((D = d.activeImages[M]) == null ? void 0 : D.aspectRatio) || 1.2);
            return /* @__PURE__ */ j(Ze.Fragment, { children: [
              (P.length > 0 || L) && /* @__PURE__ */ j(
                "svg",
                {
                  style: {
                    position: "absolute",
                    left: p.x,
                    top: p.y,
                    width: p.width,
                    height: v,
                    pointerEvents: "none"
                  },
                  viewBox: "0 0 1 1",
                  preserveAspectRatio: "none",
                  children: [
                    P.length >= 2 && /* @__PURE__ */ $(
                      "path",
                      {
                        d: P.map((b, u) => `${u === 0 ? "M" : "L"} ${b.x} ${b.y}`).join(" ") + (P.length >= 3 ? " Z" : ""),
                        fill: "rgba(80,37,129,0.1)",
                        stroke: "#502581",
                        strokeWidth: "0.008",
                        strokeDasharray: "0.02 0.015"
                      }
                    ),
                    P.map((b, u) => /* @__PURE__ */ $(
                      "circle",
                      {
                        cx: b.x,
                        cy: b.y,
                        r: L ? 0.025 : 0.015,
                        fill: L ? "#502581" : "rgba(80,37,129,0.5)"
                      },
                      u
                    ))
                  ]
                }
              ),
              te && /* @__PURE__ */ $(
                "div",
                {
                  "data-resize-handle": M,
                  onMouseDown: (b) => {
                    var u;
                    return (u = c.onResizeMouseDown) == null ? void 0 : u.call(c, b, M);
                  },
                  style: {
                    position: "absolute",
                    left: p.x + p.width - 4,
                    top: p.y + v - 4,
                    width: 8,
                    height: 8,
                    background: "#502581",
                    cursor: "nwse-resize",
                    borderRadius: 1,
                    opacity: 0.7
                  }
                }
              )
            ] }, `editor-${m}`);
          })
        ] })
      ]
    }
  );
}
function et() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Se = et();
function Lt(n) {
  Se = n;
}
var me = { exec: () => null };
function T(n, e = "") {
  let t = typeof n == "string" ? n : n.source, r = { replace: (s, i) => {
    let l = typeof i == "string" ? i : i.source;
    return l = l.replace(ee.caret, "$1"), t = t.replace(s, l), r;
  }, getRegex: () => new RegExp(t, e) };
  return r;
}
var An = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), ee = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}#`), htmlBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}>`) }, Mn = /^(?:[ \t]*(?:\n|$))+/, En = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, _n = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Me = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Pn = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, tt = / {0,3}(?:[*+-]|\d{1,9}[.)])/, At = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Mt = T(At).replace(/bull/g, tt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Fn = T(At).replace(/bull/g, tt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), nt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Bn = /^[^\n]+/, rt = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Dn = T(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", rt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), On = T(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, tt).getRegex(), qe = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", st = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Hn = T("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", st).replace("tag", qe).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Et = T(nt).replace("hr", Me).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", qe).getRegex(), Wn = T(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Et).getRegex(), it = { blockquote: Wn, code: En, def: Dn, fences: _n, heading: Pn, hr: Me, html: Hn, lheading: Mt, list: On, newline: Mn, paragraph: Et, table: me, text: Bn }, mt = T("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Me).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", qe).getRegex(), qn = { ...it, lheading: Fn, table: mt, paragraph: T(nt).replace("hr", Me).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", mt).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", qe).getRegex() }, Xn = { ...it, html: T(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", st).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: me, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: T(nt).replace("hr", Me).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Mt).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Yn = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Nn = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, _t = /^( {2,}|\\)\n(?!\s*$)/, jn = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, ze = /[\p{P}\p{S}]/u, Xe = /[\s\p{P}\p{S}]/u, ot = /[^\s\p{P}\p{S}]/u, Zn = T(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Xe).getRegex(), Pt = /(?!~)[\p{P}\p{S}]/u, Gn = /(?!~)[\s\p{P}\p{S}]/u, Qn = /(?:[^\s\p{P}\p{S}]|~)/u, Un = T(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", An ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Ft = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, Kn = T(Ft, "u").replace(/punct/g, ze).getRegex(), Vn = T(Ft, "u").replace(/punct/g, Pt).getRegex(), Bt = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", Jn = T(Bt, "gu").replace(/notPunctSpace/g, ot).replace(/punctSpace/g, Xe).replace(/punct/g, ze).getRegex(), er = T(Bt, "gu").replace(/notPunctSpace/g, Qn).replace(/punctSpace/g, Gn).replace(/punct/g, Pt).getRegex(), tr = T("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ot).replace(/punctSpace/g, Xe).replace(/punct/g, ze).getRegex(), nr = T(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, ze).getRegex(), rr = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", sr = T(rr, "gu").replace(/notPunctSpace/g, ot).replace(/punctSpace/g, Xe).replace(/punct/g, ze).getRegex(), ir = T(/\\(punct)/, "gu").replace(/punct/g, ze).getRegex(), or = T(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), lr = T(st).replace("(?:-->|$)", "-->").getRegex(), ar = T("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", lr).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Oe = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/, cr = T(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Oe).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Dt = T(/^!?\[(label)\]\[(ref)\]/).replace("label", Oe).replace("ref", rt).getRegex(), Ot = T(/^!?\[(ref)\](?:\[\])?/).replace("ref", rt).getRegex(), pr = T("reflink|nolink(?!\\()", "g").replace("reflink", Dt).replace("nolink", Ot).getRegex(), yt = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, lt = { _backpedal: me, anyPunctuation: ir, autolink: or, blockSkip: Un, br: _t, code: Nn, del: me, delLDelim: me, delRDelim: me, emStrongLDelim: Kn, emStrongRDelimAst: Jn, emStrongRDelimUnd: tr, escape: Yn, link: cr, nolink: Ot, punctuation: Zn, reflink: Dt, reflinkSearch: pr, tag: ar, text: jn, url: me }, hr = { ...lt, link: T(/^!?\[(label)\]\((.*?)\)/).replace("label", Oe).getRegex(), reflink: T(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Oe).getRegex() }, Ue = { ...lt, emStrongRDelimAst: er, emStrongLDelim: Vn, delLDelim: nr, delRDelim: sr, url: T(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", yt).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: T(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", yt).getRegex() }, ur = { ...Ue, br: T(_t).replace("{2,}", "*").getRegex(), text: T(Ue.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Fe = { normal: it, gfm: qn, pedantic: Xn }, Le = { normal: lt, gfm: Ue, breaks: ur, pedantic: hr }, dr = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, wt = (n) => dr[n];
function ue(n, e) {
  if (e) {
    if (ee.escapeTest.test(n)) return n.replace(ee.escapeReplace, wt);
  } else if (ee.escapeTestNoEncode.test(n)) return n.replace(ee.escapeReplaceNoEncode, wt);
  return n;
}
function St(n) {
  try {
    n = encodeURI(n).replace(ee.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function Rt(n, e) {
  var i;
  let t = n.replace(ee.findPipe, (l, o, c) => {
    let h = !1, f = o;
    for (; --f >= 0 && c[f] === "\\"; ) h = !h;
    return h ? "|" : " |";
  }), r = t.split(ee.splitPipe), s = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !((i = r.at(-1)) != null && i.trim()) && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; s < r.length; s++) r[s] = r[s].trim().replace(ee.slashPipe, "|");
  return r;
}
function fe(n, e, t) {
  let r = n.length;
  if (r === 0) return "";
  let s = 0;
  for (; s < r && n.charAt(r - s - 1) === e; )
    s++;
  return n.slice(0, r - s);
}
function $t(n) {
  let e = n.split(`
`), t = e.length - 1;
  for (; t >= 0 && !e[t].trim(); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function gr(n, e) {
  if (n.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let r = 0; r < n.length; r++) if (n[r] === "\\") r++;
  else if (n[r] === e[0]) t++;
  else if (n[r] === e[1] && (t--, t < 0)) return r;
  return t > 0 ? -2 : -1;
}
function fr(n, e = 0) {
  let t = e, r = "";
  for (let s of n) if (s === "	") {
    let i = 4 - t % 4;
    r += " ".repeat(i), t += i;
  } else r += s, t++;
  return r;
}
function Ct(n, e, t, r, s) {
  let i = e.href, l = e.title || null, o = n[1].replace(s.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let c = { type: n[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i, title: l, text: o, tokens: r.inlineTokens(o) };
  return r.state.inLink = !1, c;
}
function xr(n, e, t) {
  let r = n.match(t.other.indentCodeCompensation);
  if (r === null) return e;
  let s = r[1];
  return e.split(`
`).map((i) => {
    let l = i.match(t.other.beginningSpace);
    if (l === null) return i;
    let [o] = l;
    return o.length >= s.length ? i.slice(s.length) : i;
  }).join(`
`);
}
var He = class {
  constructor(n) {
    W(this, "options");
    W(this, "rules");
    W(this, "lexer");
    this.options = n || Se;
  }
  space(n) {
    let e = this.rules.block.newline.exec(n);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(n) {
    let e = this.rules.block.code.exec(n);
    if (e) {
      let t = this.options.pedantic ? e[0] : $t(e[0]), r = t.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t, codeBlockStyle: "indented", text: r };
    }
  }
  fences(n) {
    let e = this.rules.block.fences.exec(n);
    if (e) {
      let t = e[0], r = xr(t, e[3] || "", this.rules);
      return { type: "code", raw: t, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(n) {
    let e = this.rules.block.heading.exec(n);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        let r = fe(t, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (t = r.trim());
      }
      return { type: "heading", raw: fe(e[0], `
`), depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
    }
  }
  hr(n) {
    let e = this.rules.block.hr.exec(n);
    if (e) return { type: "hr", raw: fe(e[0], `
`) };
  }
  blockquote(n) {
    let e = this.rules.block.blockquote.exec(n);
    if (e) {
      let t = fe(e[0], `
`).split(`
`), r = "", s = "", i = [];
      for (; t.length > 0; ) {
        let l = !1, o = [], c;
        for (c = 0; c < t.length; c++) if (this.rules.other.blockquoteStart.test(t[c])) o.push(t[c]), l = !0;
        else if (!l) o.push(t[c]);
        else break;
        t = t.slice(c);
        let h = o.join(`
`), f = h.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${h}` : h, s = s ? `${s}
${f}` : f;
        let y = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(f, i, !0), this.lexer.state.top = y, t.length === 0) break;
        let k = i.at(-1);
        if ((k == null ? void 0 : k.type) === "code") break;
        if ((k == null ? void 0 : k.type) === "blockquote") {
          let d = k, I = d.raw + `
` + t.join(`
`), R = this.blockquote(I);
          i[i.length - 1] = R, r = r.substring(0, r.length - d.raw.length) + R.raw, s = s.substring(0, s.length - d.text.length) + R.text;
          break;
        } else if ((k == null ? void 0 : k.type) === "list") {
          let d = k, I = d.raw + `
` + t.join(`
`), R = this.list(I);
          i[i.length - 1] = R, r = r.substring(0, r.length - k.raw.length) + R.raw, s = s.substring(0, s.length - d.raw.length) + R.raw, t = I.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: i, text: s };
    }
  }
  list(n) {
    var t, r;
    let e = this.rules.block.list.exec(n);
    if (e) {
      let s = e[1].trim(), i = s.length > 1, l = { type: "list", raw: "", ordered: i, start: i ? +s.slice(0, -1) : "", loose: !1, items: [] };
      s = i ? `\\d{1,9}\\${s.slice(-1)}` : `\\${s}`, this.options.pedantic && (s = i ? s : "[*+-]");
      let o = this.rules.other.listItemRegex(s), c = !1;
      for (; n; ) {
        let f = !1, y = "", k = "";
        if (!(e = o.exec(n)) || this.rules.block.hr.test(n)) break;
        y = e[0], n = n.substring(y.length);
        let d = fr(e[2].split(`
`, 1)[0], e[1].length), I = n.split(`
`, 1)[0], R = !d.trim(), A = 0;
        if (this.options.pedantic ? (A = 2, k = d.trimStart()) : R ? A = e[1].length + 1 : (A = d.search(this.rules.other.nonSpaceChar), A = A > 4 ? 1 : A, k = d.slice(A), A += e[1].length), R && this.rules.other.blankLine.test(I) && (y += I + `
`, n = n.substring(I.length + 1), f = !0), !f) {
          let X = this.rules.other.nextBulletRegex(A), re = this.rules.other.hrRegex(A), E = this.rules.other.fencesBeginRegex(A), _ = this.rules.other.headingBeginRegex(A), B = this.rules.other.htmlBeginRegex(A), q = this.rules.other.blockquoteBeginRegex(A);
          for (; n; ) {
            let p = n.split(`
`, 1)[0], m;
            if (I = p, this.options.pedantic ? (I = I.replace(this.rules.other.listReplaceNesting, "  "), m = I) : m = I.replace(this.rules.other.tabCharGlobal, "    "), E.test(I) || _.test(I) || B.test(I) || q.test(I) || X.test(I) || re.test(I)) break;
            if (m.search(this.rules.other.nonSpaceChar) >= A || !I.trim()) k += `
` + m.slice(A);
            else {
              if (R || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || E.test(d) || _.test(d) || re.test(d)) break;
              k += `
` + I;
            }
            R = !I.trim(), y += p + `
`, n = n.substring(p.length + 1), d = m.slice(A);
          }
        }
        l.loose || (c ? l.loose = !0 : this.rules.other.doubleBlankLine.test(y) && (c = !0)), l.items.push({ type: "list_item", raw: y, task: !!this.options.gfm && this.rules.other.listIsTask.test(k), loose: !1, text: k, tokens: [] }), l.raw += y;
      }
      let h = l.items.at(-1);
      if (h) h.raw = h.raw.trimEnd(), h.text = h.text.trimEnd();
      else return;
      l.raw = l.raw.trimEnd();
      for (let f of l.items) {
        if (this.lexer.state.top = !1, f.tokens = this.lexer.blockTokens(f.text, []), f.task) {
          if (f.text = f.text.replace(this.rules.other.listReplaceTask, ""), ((t = f.tokens[0]) == null ? void 0 : t.type) === "text" || ((r = f.tokens[0]) == null ? void 0 : r.type) === "paragraph") {
            f.tokens[0].raw = f.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), f.tokens[0].text = f.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let k = this.lexer.inlineQueue.length - 1; k >= 0; k--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[k].src)) {
              this.lexer.inlineQueue[k].src = this.lexer.inlineQueue[k].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let y = this.rules.other.listTaskCheckbox.exec(f.raw);
          if (y) {
            let k = { type: "checkbox", raw: y[0] + " ", checked: y[0] !== "[ ]" };
            f.checked = k.checked, l.loose ? f.tokens[0] && ["paragraph", "text"].includes(f.tokens[0].type) && "tokens" in f.tokens[0] && f.tokens[0].tokens ? (f.tokens[0].raw = k.raw + f.tokens[0].raw, f.tokens[0].text = k.raw + f.tokens[0].text, f.tokens[0].tokens.unshift(k)) : f.tokens.unshift({ type: "paragraph", raw: k.raw, text: k.raw, tokens: [k] }) : f.tokens.unshift(k);
          }
        }
        if (!l.loose) {
          let y = f.tokens.filter((d) => d.type === "space"), k = y.length > 0 && y.some((d) => this.rules.other.anyLine.test(d.raw));
          l.loose = k;
        }
      }
      if (l.loose) for (let f of l.items) {
        f.loose = !0;
        for (let y of f.tokens) y.type === "text" && (y.type = "paragraph");
      }
      return l;
    }
  }
  html(n) {
    let e = this.rules.block.html.exec(n);
    if (e) {
      let t = $t(e[0]);
      return { type: "html", block: !0, raw: t, pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: t };
    }
  }
  def(n) {
    let e = this.rules.block.def.exec(n);
    if (e) {
      let t = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: t, raw: fe(e[0], `
`), href: r, title: s };
    }
  }
  table(n) {
    var l;
    let e = this.rules.block.table.exec(n);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = Rt(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = (l = e[3]) != null && l.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: fe(e[0], `
`), header: [], align: [], rows: [] };
    if (t.length === r.length) {
      for (let o of r) this.rules.other.tableAlignRight.test(o) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? i.align.push("left") : i.align.push(null);
      for (let o = 0; o < t.length; o++) i.header.push({ text: t[o], tokens: this.lexer.inline(t[o]), header: !0, align: i.align[o] });
      for (let o of s) i.rows.push(Rt(o, i.header.length).map((c, h) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: i.align[h] })));
      return i;
    }
  }
  lheading(n) {
    let e = this.rules.block.lheading.exec(n);
    if (e) {
      let t = e[1].trim();
      return { type: "heading", raw: fe(e[0], `
`), depth: e[2].charAt(0) === "=" ? 1 : 2, text: t, tokens: this.lexer.inline(t) };
    }
  }
  paragraph(n) {
    let e = this.rules.block.paragraph.exec(n);
    if (e) {
      let t = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: t, tokens: this.lexer.inline(t) };
    }
  }
  text(n) {
    let e = this.rules.block.text.exec(n);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(n) {
    let e = this.rules.inline.escape.exec(n);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(n) {
    let e = this.rules.inline.tag.exec(n);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(n) {
    let e = this.rules.inline.link.exec(n);
    if (e) {
      let t = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(t)) {
        if (!this.rules.other.endAngleBracket.test(t)) return;
        let i = fe(t.slice(0, -1), "\\");
        if ((t.length - i.length) % 2 === 0) return;
      } else {
        let i = gr(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let l = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, l).trim(), e[3] = "";
        }
      }
      let r = e[2], s = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(r);
        i && (r = i[1], s = i[3]);
      } else s = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? r = r.slice(1) : r = r.slice(1, -1)), Ct(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: s && s.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(n, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(n)) || (t = this.rules.inline.nolink.exec(n))) {
      let r = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = e[r.toLowerCase()];
      if (!s) {
        let i = t[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return Ct(t, s, t[0], this.lexer, this.rules);
    }
  }
  emStrong(n, e, t = "") {
    let r = this.rules.inline.emStrongLDelim.exec(n);
    if (!(!r || !r[1] && !r[2] && !r[3] && !r[4] || r[4] && t.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[3]) || !t || this.rules.inline.punctuation.exec(t))) {
      let s = [...r[0]].length - 1, i, l, o = s, c = 0, h = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = h.exec(e)) !== null; ) {
        if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i) continue;
        if (l = [...i].length, r[3] || r[4]) {
          o += l;
          continue;
        } else if ((r[5] || r[6]) && s % 3 && !((s + l) % 3)) {
          c += l;
          continue;
        }
        if (o -= l, o > 0) continue;
        l = Math.min(l, l + o + c);
        let f = [...r[0]][0].length, y = n.slice(0, s + r.index + f + l);
        if (Math.min(s, l) % 2) {
          let d = y.slice(1, -1);
          return { type: "em", raw: y, text: d, tokens: this.lexer.inlineTokens(d) };
        }
        let k = y.slice(2, -2);
        return { type: "strong", raw: y, text: k, tokens: this.lexer.inlineTokens(k) };
      }
    }
  }
  codespan(n) {
    let e = this.rules.inline.code.exec(n);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(t), s = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return r && s && (t = t.substring(1, t.length - 1)), { type: "codespan", raw: e[0], text: t };
    }
  }
  br(n) {
    let e = this.rules.inline.br.exec(n);
    if (e) return { type: "br", raw: e[0] };
  }
  del(n, e, t = "") {
    let r = this.rules.inline.delLDelim.exec(n);
    if (r && (!r[1] || !t || this.rules.inline.punctuation.exec(t))) {
      let s = [...r[0]].length - 1, i, l, o = s, c = this.rules.inline.delRDelim;
      for (c.lastIndex = 0, e = e.slice(-1 * n.length + s); (r = c.exec(e)) !== null; ) {
        if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (l = [...i].length, l !== s)) continue;
        if (r[3] || r[4]) {
          o += l;
          continue;
        }
        if (o -= l, o > 0) continue;
        l = Math.min(l, l + o);
        let h = [...r[0]][0].length, f = n.slice(0, s + r.index + h + l), y = f.slice(s, -s);
        return { type: "del", raw: f, text: y, tokens: this.lexer.inlineTokens(y) };
      }
    }
  }
  autolink(n) {
    let e = this.rules.inline.autolink.exec(n);
    if (e) {
      let t, r;
      return e[2] === "@" ? (t = e[1], r = "mailto:" + t) : (t = e[1], r = t), { type: "link", raw: e[0], text: t, href: r, tokens: [{ type: "text", raw: t, text: t }] };
    }
  }
  url(n) {
    var t;
    let e;
    if (e = this.rules.inline.url.exec(n)) {
      let r, s;
      if (e[2] === "@") r = e[0], s = "mailto:" + r;
      else {
        let i;
        do
          i = e[0], e[0] = ((t = this.rules.inline._backpedal.exec(e[0])) == null ? void 0 : t[0]) ?? "";
        while (i !== e[0]);
        r = e[0], e[1] === "www." ? s = "http://" + e[0] : s = e[0];
      }
      return { type: "link", raw: e[0], text: r, href: s, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  inlineText(n) {
    let e = this.rules.inline.text.exec(n);
    if (e) {
      let t = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: t };
    }
  }
}, ce = class Ke {
  constructor(e) {
    W(this, "tokens");
    W(this, "options");
    W(this, "state");
    W(this, "inlineQueue");
    W(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Se, this.options.tokenizer = this.options.tokenizer || new He(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let t = { other: ee, block: Fe.normal, inline: Le.normal };
    this.options.pedantic ? (t.block = Fe.pedantic, t.inline = Le.pedantic) : this.options.gfm && (t.block = Fe.gfm, this.options.breaks ? t.inline = Le.breaks : t.inline = Le.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: Fe, inline: Le };
  }
  static lex(e, t) {
    return new Ke(t).lex(e);
  }
  static lexInline(e, t) {
    return new Ke(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(ee.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    var s, i, l;
    for (this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(ee.tabCharGlobal, "    ").replace(ee.spaceLine, "")); e; ) {
      let o;
      if ((i = (s = this.options.extensions) == null ? void 0 : s.block) != null && i.some((h) => (o = h.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1)) continue;
      if (o = this.tokenizer.space(e)) {
        e = e.substring(o.raw.length);
        let h = t.at(-1);
        o.raw.length === 1 && h !== void 0 ? h.raw += `
` : t.push(o);
        continue;
      }
      if (o = this.tokenizer.code(e)) {
        e = e.substring(o.raw.length);
        let h = t.at(-1);
        (h == null ? void 0 : h.type) === "paragraph" || (h == null ? void 0 : h.type) === "text" ? (h.raw += (h.raw.endsWith(`
`) ? "" : `
`) + o.raw, h.text += `
` + o.text, this.inlineQueue.at(-1).src = h.text) : t.push(o);
        continue;
      }
      if (o = this.tokenizer.fences(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.heading(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.hr(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.blockquote(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.list(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.html(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.def(e)) {
        e = e.substring(o.raw.length);
        let h = t.at(-1);
        (h == null ? void 0 : h.type) === "paragraph" || (h == null ? void 0 : h.type) === "text" ? (h.raw += (h.raw.endsWith(`
`) ? "" : `
`) + o.raw, h.text += `
` + o.raw, this.inlineQueue.at(-1).src = h.text) : this.tokens.links[o.tag] || (this.tokens.links[o.tag] = { href: o.href, title: o.title }, t.push(o));
        continue;
      }
      if (o = this.tokenizer.table(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.lheading(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      let c = e;
      if ((l = this.options.extensions) != null && l.startBlock) {
        let h = 1 / 0, f = e.slice(1), y;
        this.options.extensions.startBlock.forEach((k) => {
          y = k.call({ lexer: this }, f), typeof y == "number" && y >= 0 && (h = Math.min(h, y));
        }), h < 1 / 0 && h >= 0 && (c = e.substring(0, h + 1));
      }
      if (this.state.top && (o = this.tokenizer.paragraph(c))) {
        let h = t.at(-1);
        r && (h == null ? void 0 : h.type) === "paragraph" ? (h.raw += (h.raw.endsWith(`
`) ? "" : `
`) + o.raw, h.text += `
` + o.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = h.text) : t.push(o), r = c.length !== e.length, e = e.substring(o.raw.length);
        continue;
      }
      if (o = this.tokenizer.text(e)) {
        e = e.substring(o.raw.length);
        let h = t.at(-1);
        (h == null ? void 0 : h.type) === "text" ? (h.raw += (h.raw.endsWith(`
`) ? "" : `
`) + o.raw, h.text += `
` + o.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = h.text) : t.push(o);
        continue;
      }
      if (e) {
        let h = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(h);
          break;
        } else throw new Error(h);
      }
    }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  inlineTokens(e, t = []) {
    var c, h, f, y, k;
    this.tokenizer.lexer = this;
    let r = e, s = null;
    if (this.tokens.links) {
      let d = Object.keys(this.tokens.links);
      if (d.length > 0) for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(r)) !== null; ) d.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (r = r.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(r)) !== null; ) r = r.slice(0, s.index) + "++" + r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(r)) !== null; ) i = s[2] ? s[2].length : 0, r = r.slice(0, s.index + i) + "[" + "a".repeat(s[0].length - i - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    r = ((h = (c = this.options.hooks) == null ? void 0 : c.emStrongMask) == null ? void 0 : h.call({ lexer: this }, r)) ?? r;
    let l = !1, o = "";
    for (; e; ) {
      l || (o = ""), l = !1;
      let d;
      if ((y = (f = this.options.extensions) == null ? void 0 : f.inline) != null && y.some((R) => (d = R.call({ lexer: this }, e, t)) ? (e = e.substring(d.raw.length), t.push(d), !0) : !1)) continue;
      if (d = this.tokenizer.escape(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.tag(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.link(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(d.raw.length);
        let R = t.at(-1);
        d.type === "text" && (R == null ? void 0 : R.type) === "text" ? (R.raw += d.raw, R.text += d.text) : t.push(d);
        continue;
      }
      if (d = this.tokenizer.emStrong(e, r, o)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.codespan(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.br(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.del(e, r, o)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (d = this.tokenizer.autolink(e)) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      if (!this.state.inLink && (d = this.tokenizer.url(e))) {
        e = e.substring(d.raw.length), t.push(d);
        continue;
      }
      let I = e;
      if ((k = this.options.extensions) != null && k.startInline) {
        let R = 1 / 0, A = e.slice(1), X;
        this.options.extensions.startInline.forEach((re) => {
          X = re.call({ lexer: this }, A), typeof X == "number" && X >= 0 && (R = Math.min(R, X));
        }), R < 1 / 0 && R >= 0 && (I = e.substring(0, R + 1));
      }
      if (d = this.tokenizer.inlineText(I)) {
        e = e.substring(d.raw.length), d.raw.slice(-1) !== "_" && (o = d.raw.slice(-1)), l = !0;
        let R = t.at(-1);
        (R == null ? void 0 : R.type) === "text" ? (R.raw += d.raw, R.text += d.text) : t.push(d);
        continue;
      }
      if (e) {
        let R = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(R);
          break;
        } else throw new Error(R);
      }
    }
    return t;
  }
}, We = class {
  constructor(n) {
    W(this, "options");
    W(this, "parser");
    this.options = n || Se;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    var i;
    let r = (i = (e || "").match(ee.notSpaceStart)) == null ? void 0 : i[0], s = n.replace(ee.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + ue(r) + '">' + (t ? s : ue(s, !0)) + `</code></pre>
` : "<pre><code>" + (t ? s : ue(s, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: n }) {
    return `<blockquote>
${this.parser.parse(n)}</blockquote>
`;
  }
  html({ text: n }) {
    return n;
  }
  def(n) {
    return "";
  }
  heading({ tokens: n, depth: e }) {
    return `<h${e}>${this.parser.parseInline(n)}</h${e}>
`;
  }
  hr(n) {
    return `<hr>
`;
  }
  list(n) {
    let e = n.ordered, t = n.start, r = "";
    for (let l = 0; l < n.items.length; l++) {
      let o = n.items[l];
      r += this.listitem(o);
    }
    let s = e ? "ol" : "ul", i = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + s + i + `>
` + r + "</" + s + `>
`;
  }
  listitem(n) {
    return `<li>${this.parser.parse(n.tokens)}</li>
`;
  }
  checkbox({ checked: n }) {
    return "<input " + (n ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: n }) {
    return `<p>${this.parser.parseInline(n)}</p>
`;
  }
  table(n) {
    let e = "", t = "";
    for (let s = 0; s < n.header.length; s++) t += this.tablecell(n.header[s]);
    e += this.tablerow({ text: t });
    let r = "";
    for (let s = 0; s < n.rows.length; s++) {
      let i = n.rows[s];
      t = "";
      for (let l = 0; l < i.length; l++) t += this.tablecell(i[l]);
      r += this.tablerow({ text: t });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: n }) {
    return `<tr>
${n}</tr>
`;
  }
  tablecell(n) {
    let e = this.parser.parseInline(n.tokens), t = n.header ? "th" : "td";
    return (n.align ? `<${t} align="${n.align}">` : `<${t}>`) + e + `</${t}>
`;
  }
  strong({ tokens: n }) {
    return `<strong>${this.parser.parseInline(n)}</strong>`;
  }
  em({ tokens: n }) {
    return `<em>${this.parser.parseInline(n)}</em>`;
  }
  codespan({ text: n }) {
    return `<code>${ue(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    let r = this.parser.parseInline(t), s = St(n);
    if (s === null) return r;
    n = s;
    let i = '<a href="' + n + '"';
    return e && (i += ' title="' + ue(e) + '"'), i += ">" + r + "</a>", i;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    let s = St(n);
    if (s === null) return ue(t);
    n = s;
    let i = `<img src="${n}" alt="${ue(t)}"`;
    return e && (i += ` title="${ue(e)}"`), i += ">", i;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : ue(n.text);
  }
}, at = class {
  strong({ text: n }) {
    return n;
  }
  em({ text: n }) {
    return n;
  }
  codespan({ text: n }) {
    return n;
  }
  del({ text: n }) {
    return n;
  }
  html({ text: n }) {
    return n;
  }
  text({ text: n }) {
    return n;
  }
  link({ text: n }) {
    return "" + n;
  }
  image({ text: n }) {
    return "" + n;
  }
  br() {
    return "";
  }
  checkbox({ raw: n }) {
    return n;
  }
}, pe = class Ve {
  constructor(e) {
    W(this, "options");
    W(this, "renderer");
    W(this, "textRenderer");
    this.options = e || Se, this.options.renderer = this.options.renderer || new We(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new at();
  }
  static parse(e, t) {
    return new Ve(t).parse(e);
  }
  static parseInline(e, t) {
    return new Ve(t).parseInline(e);
  }
  parse(e) {
    var r, s;
    this.renderer.parser = this;
    let t = "";
    for (let i = 0; i < e.length; i++) {
      let l = e[i];
      if ((s = (r = this.options.extensions) == null ? void 0 : r.renderers) != null && s[l.type]) {
        let c = l, h = this.options.extensions.renderers[c.type].call({ parser: this }, c);
        if (h !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(c.type)) {
          t += h || "";
          continue;
        }
      }
      let o = l;
      switch (o.type) {
        case "space": {
          t += this.renderer.space(o);
          break;
        }
        case "hr": {
          t += this.renderer.hr(o);
          break;
        }
        case "heading": {
          t += this.renderer.heading(o);
          break;
        }
        case "code": {
          t += this.renderer.code(o);
          break;
        }
        case "table": {
          t += this.renderer.table(o);
          break;
        }
        case "blockquote": {
          t += this.renderer.blockquote(o);
          break;
        }
        case "list": {
          t += this.renderer.list(o);
          break;
        }
        case "checkbox": {
          t += this.renderer.checkbox(o);
          break;
        }
        case "html": {
          t += this.renderer.html(o);
          break;
        }
        case "def": {
          t += this.renderer.def(o);
          break;
        }
        case "paragraph": {
          t += this.renderer.paragraph(o);
          break;
        }
        case "text": {
          t += this.renderer.text(o);
          break;
        }
        default: {
          let c = 'Token with "' + o.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return t;
  }
  parseInline(e, t = this.renderer) {
    var s, i;
    this.renderer.parser = this;
    let r = "";
    for (let l = 0; l < e.length; l++) {
      let o = e[l];
      if ((i = (s = this.options.extensions) == null ? void 0 : s.renderers) != null && i[o.type]) {
        let h = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (h !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(o.type)) {
          r += h || "";
          continue;
        }
      }
      let c = o;
      switch (c.type) {
        case "escape": {
          r += t.text(c);
          break;
        }
        case "html": {
          r += t.html(c);
          break;
        }
        case "link": {
          r += t.link(c);
          break;
        }
        case "image": {
          r += t.image(c);
          break;
        }
        case "checkbox": {
          r += t.checkbox(c);
          break;
        }
        case "strong": {
          r += t.strong(c);
          break;
        }
        case "em": {
          r += t.em(c);
          break;
        }
        case "codespan": {
          r += t.codespan(c);
          break;
        }
        case "br": {
          r += t.br(c);
          break;
        }
        case "del": {
          r += t.del(c);
          break;
        }
        case "text": {
          r += t.text(c);
          break;
        }
        default: {
          let h = 'Token with "' + c.type + '" type was not found.';
          if (this.options.silent) return console.error(h), "";
          throw new Error(h);
        }
      }
    }
    return r;
  }
}, De, Ae = (De = class {
  constructor(n) {
    W(this, "options");
    W(this, "block");
    this.options = n || Se;
  }
  preprocess(n) {
    return n;
  }
  postprocess(n) {
    return n;
  }
  processAllTokens(n) {
    return n;
  }
  emStrongMask(n) {
    return n;
  }
  provideLexer(n = this.block) {
    return n ? ce.lex : ce.lexInline;
  }
  provideParser(n = this.block) {
    return n ? pe.parse : pe.parseInline;
  }
}, W(De, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), W(De, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), De), kr = class {
  constructor(...n) {
    W(this, "defaults", et());
    W(this, "options", this.setOptions);
    W(this, "parse", this.parseMarkdown(!0));
    W(this, "parseInline", this.parseMarkdown(!1));
    W(this, "Parser", pe);
    W(this, "Renderer", We);
    W(this, "TextRenderer", at);
    W(this, "Lexer", ce);
    W(this, "Tokenizer", He);
    W(this, "Hooks", Ae);
    this.use(...n);
  }
  walkTokens(n, e) {
    var r, s;
    let t = [];
    for (let i of n) switch (t = t.concat(e.call(this, i)), i.type) {
      case "table": {
        let l = i;
        for (let o of l.header) t = t.concat(this.walkTokens(o.tokens, e));
        for (let o of l.rows) for (let c of o) t = t.concat(this.walkTokens(c.tokens, e));
        break;
      }
      case "list": {
        let l = i;
        t = t.concat(this.walkTokens(l.items, e));
        break;
      }
      default: {
        let l = i;
        (s = (r = this.defaults.extensions) == null ? void 0 : r.childTokens) != null && s[l.type] ? this.defaults.extensions.childTokens[l.type].forEach((o) => {
          let c = l[o].flat(1 / 0);
          t = t.concat(this.walkTokens(c, e));
        }) : l.tokens && (t = t.concat(this.walkTokens(l.tokens, e)));
      }
    }
    return t;
  }
  use(...n) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((t) => {
      let r = { ...t };
      if (r.async = this.defaults.async || r.async || !1, t.extensions && (t.extensions.forEach((s) => {
        if (!s.name) throw new Error("extension name required");
        if ("renderer" in s) {
          let i = e.renderers[s.name];
          i ? e.renderers[s.name] = function(...l) {
            let o = s.renderer.apply(this, l);
            return o === !1 && (o = i.apply(this, l)), o;
          } : e.renderers[s.name] = s.renderer;
        }
        if ("tokenizer" in s) {
          if (!s.level || s.level !== "block" && s.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[s.level];
          i ? i.unshift(s.tokenizer) : e[s.level] = [s.tokenizer], s.start && (s.level === "block" ? e.startBlock ? e.startBlock.push(s.start) : e.startBlock = [s.start] : s.level === "inline" && (e.startInline ? e.startInline.push(s.start) : e.startInline = [s.start]));
        }
        "childTokens" in s && s.childTokens && (e.childTokens[s.name] = s.childTokens);
      }), r.extensions = e), t.renderer) {
        let s = this.defaults.renderer || new We(this.defaults);
        for (let i in t.renderer) {
          if (!(i in s)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let l = i, o = t.renderer[l], c = s[l];
          s[l] = (...h) => {
            let f = o.apply(s, h);
            return f === !1 && (f = c.apply(s, h)), f || "";
          };
        }
        r.renderer = s;
      }
      if (t.tokenizer) {
        let s = this.defaults.tokenizer || new He(this.defaults);
        for (let i in t.tokenizer) {
          if (!(i in s)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let l = i, o = t.tokenizer[l], c = s[l];
          s[l] = (...h) => {
            let f = o.apply(s, h);
            return f === !1 && (f = c.apply(s, h)), f;
          };
        }
        r.tokenizer = s;
      }
      if (t.hooks) {
        let s = this.defaults.hooks || new Ae();
        for (let i in t.hooks) {
          if (!(i in s)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let l = i, o = t.hooks[l], c = s[l];
          Ae.passThroughHooks.has(i) ? s[l] = (h) => {
            if (this.defaults.async && Ae.passThroughHooksRespectAsync.has(i)) return (async () => {
              let y = await o.call(s, h);
              return c.call(s, y);
            })();
            let f = o.call(s, h);
            return c.call(s, f);
          } : s[l] = (...h) => {
            if (this.defaults.async) return (async () => {
              let y = await o.apply(s, h);
              return y === !1 && (y = await c.apply(s, h)), y;
            })();
            let f = o.apply(s, h);
            return f === !1 && (f = c.apply(s, h)), f;
          };
        }
        r.hooks = s;
      }
      if (t.walkTokens) {
        let s = this.defaults.walkTokens, i = t.walkTokens;
        r.walkTokens = function(l) {
          let o = [];
          return o.push(i.call(this, l)), s && (o = o.concat(s.call(this, l))), o;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return ce.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return pe.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let r = { ...t }, s = { ...this.defaults, ...r }, i = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === !0 && r.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (s.hooks && (s.hooks.options = s, s.hooks.block = n), s.async) return (async () => {
        let l = s.hooks ? await s.hooks.preprocess(e) : e, o = await (s.hooks ? await s.hooks.provideLexer(n) : n ? ce.lex : ce.lexInline)(l, s), c = s.hooks ? await s.hooks.processAllTokens(o) : o;
        s.walkTokens && await Promise.all(this.walkTokens(c, s.walkTokens));
        let h = await (s.hooks ? await s.hooks.provideParser(n) : n ? pe.parse : pe.parseInline)(c, s);
        return s.hooks ? await s.hooks.postprocess(h) : h;
      })().catch(i);
      try {
        s.hooks && (e = s.hooks.preprocess(e));
        let l = (s.hooks ? s.hooks.provideLexer(n) : n ? ce.lex : ce.lexInline)(e, s);
        s.hooks && (l = s.hooks.processAllTokens(l)), s.walkTokens && this.walkTokens(l, s.walkTokens);
        let o = (s.hooks ? s.hooks.provideParser(n) : n ? pe.parse : pe.parseInline)(l, s);
        return s.hooks && (o = s.hooks.postprocess(o)), o;
      } catch (l) {
        return i(l);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        let r = "<p>An error occurred:</p><pre>" + ue(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, ye = new kr();
function F(n, e) {
  return ye.parse(n, e);
}
F.options = F.setOptions = function(n) {
  return ye.setOptions(n), F.defaults = ye.defaults, Lt(F.defaults), F;
};
F.getDefaults = et;
F.defaults = Se;
F.use = function(...n) {
  return ye.use(...n), F.defaults = ye.defaults, Lt(F.defaults), F;
};
F.walkTokens = function(n, e) {
  return ye.walkTokens(n, e);
};
F.parseInline = ye.parseInline;
F.Parser = pe;
F.parser = pe.parse;
F.Renderer = We;
F.TextRenderer = at;
F.Lexer = ce;
F.lexer = ce.lex;
F.Tokenizer = He;
F.Hooks = Ae;
F.parse = F;
F.options;
F.setOptions;
F.use;
F.walkTokens;
F.parseInline;
pe.parse;
ce.lex;
function Ce(n, e = {}) {
  const t = [];
  for (const r of n)
    switch (r.type) {
      case "text":
        t.push({ text: r.text, ...e });
        break;
      case "strong":
        t.push(...Ce(r.tokens || [], { ...e, bold: !0 }));
        break;
      case "em":
        t.push(...Ce(r.tokens || [], { ...e, italic: !0 }));
        break;
      case "codespan":
        t.push({ text: r.text, ...e, code: !0 });
        break;
      case "link":
        t.push(...Ce(r.tokens || [], { ...e, link: r.href }));
        break;
      case "del":
        t.push(...Ce(r.tokens || [], { ...e, strikethrough: !0 }));
        break;
      case "br":
        t.push({ text: `
`, ...e });
        break;
      case "escape":
        t.push({ text: r.text, ...e });
        break;
      default:
        "text" in r && t.push({ text: r.text, ...e });
    }
  return t;
}
function vt(n) {
  return n.map((e) => e.text).join("");
}
function Je(n) {
  const e = [];
  for (const t of n)
    switch (t.type) {
      case "heading": {
        const r = Ce(t.tokens || []);
        e.push({
          type: "heading",
          text: vt(r),
          segments: r,
          tag: `h${t.depth || 2}`
        });
        break;
      }
      case "paragraph": {
        const r = Ce(t.tokens || []);
        e.push({
          type: "paragraph",
          text: vt(r),
          segments: r
        });
        break;
      }
      case "list": {
        const r = t, s = r.items.map((i) => {
          const l = Je(i.tokens || []);
          if (l.length === 1)
            return { ...l[0], type: "paragraph" };
          const o = l.flatMap((c) => c.segments || [{ text: c.text }]);
          return {
            type: "paragraph",
            text: l.map((c) => c.text).join(" "),
            segments: o
          };
        });
        e.push({
          type: "list",
          text: s.map((i) => i.text).join(`
`),
          tag: r.ordered ? "ol" : "ul",
          items: s
        });
        break;
      }
      case "blockquote": {
        const r = Je(t.tokens || []), s = r.flatMap((i) => i.segments || [{ text: i.text }]);
        e.push({
          type: "blockquote",
          text: r.map((i) => i.text).join(" "),
          segments: s
        });
        break;
      }
      case "code": {
        e.push({
          type: "code",
          text: t.text,
          language: t.lang || void 0
        });
        break;
      }
      case "hr": {
        e.push({ type: "hr", text: "" });
        break;
      }
      case "space":
        break;
      default:
        "text" in t && t.text && e.push({
          type: "paragraph",
          text: t.text
        });
    }
  return e;
}
function br(n) {
  const e = F.lexer(n);
  return Je(e);
}
function mr(n) {
  return n.map((e) => {
    switch (e.type) {
      case "heading":
        return `${e.tag === "h1" ? "#" : e.tag === "h3" ? "###" : "##"} ${Be(e.segments) || e.text}`;
      case "paragraph":
        return Be(e.segments) || e.text;
      case "list": {
        const t = e.tag === "ol" ? (r) => `${r + 1}. ` : () => "- ";
        return (e.items || []).map(
          (r, s) => `${t(s)}${Be(r.segments) || r.text}`
        ).join(`
`);
      }
      case "blockquote":
        return `> ${Be(e.segments) || e.text}`;
      case "code":
        return `\`\`\`${e.language || ""}
${e.text}
\`\`\``;
      case "hr":
        return "---";
      default:
        return e.text;
    }
  }).join(`

`);
}
function Be(n) {
  return n ? n.map((e) => {
    let t = e.text;
    return e.code && (t = `\`${t}\``), e.bold && e.italic ? t = `***${t}***` : e.bold ? t = `**${t}**` : e.italic && (t = `*${t}*`), e.strikethrough && (t = `~~${t}~~`), e.link && (t = `[${t}](${e.link})`), t;
  }).join("") : "";
}
const yr = {
  bodyFont: "16px Lato, sans-serif"
};
function vr({
  blocks: n,
  layout: e,
  onLayoutChange: t,
  onBlocksChange: r,
  resolveImageUrl: s,
  config: i,
  availableFonts: l,
  availableInitialFonts: o,
  height: c,
  expandable: h,
  width: f
}) {
  var pt, ht, ut, dt, gt, ft, xt;
  const y = ae(null), k = ae(null), d = ae(null), I = ae(null), [R, A] = de(() => mr(n)), [X, re] = de(null), [E, _] = de(null), [B, q] = de(!1), [p, m] = de(-1), [M, P] = de(/* @__PURE__ */ new Set(["layout"])), te = (a, g) => {
    P(g ? (x) => {
      const w = new Set(x);
      return w.has(a) ? w.size > 1 && w.delete(a) : w.add(a), w;
    } : /* @__PURE__ */ new Set([a]));
  }, L = ae(null), v = ae(null), D = ae(null), b = ae(!1), u = e || { images: [] }, z = l == null ? void 0 : l.find((a) => a.name === u.fontFamily);
  z ? z.bodyFont.replace(/^\d+px\s*/, "") : yr.bodyFont.replace(/^\d+px\s*/, ""), u.fontSize, {
    ...z != null && z.bodyLineHeight ? { bodyLineHeight: z.bodyLineHeight } : {},
    ...z != null && z.headingLineHeight ? { headingLineHeight: z.headingLineHeight } : {}
  }, { ...i };
  const S = p === -1 ? null : (pt = u.breakpoints) == null ? void 0 : pt[p], C = (S == null ? void 0 : S.images) || u.images, O = (S == null ? void 0 : S.columns) ?? u.columns, oe = (S == null ? void 0 : S.fontFamily) ?? u.fontFamily, se = (S == null ? void 0 : S.fontSize) ?? u.fontSize, V = (S == null ? void 0 : S.initialCap) ?? u.initialCap ?? !1, ie = (S == null ? void 0 : S.initialCapFont) ?? u.initialCapFont, G = (S == null ? void 0 : S.initialCapSize) ?? u.initialCapSize, Q = (S == null ? void 0 : S.initialCapOffsetX) ?? u.initialCapOffsetX ?? 0, K = (S == null ? void 0 : S.initialCapOffsetY) ?? u.initialCapOffsetY ?? 0, J = (a, g) => {
    if (p === -1)
      t({ ...u, images: a, ...g });
    else {
      const x = [...u.breakpoints || []];
      x[p] = { ...x[p], images: a }, t({ ...u, breakpoints: x });
    }
  }, xe = (a) => {
    if (p === -1)
      t({ ...u, columns: a });
    else {
      const g = [...u.breakpoints || []];
      g[p] = { ...g[p], columns: a }, t({ ...u, breakpoints: g });
    }
  }, Ie = (a, g) => {
    const x = {
      maxWidth: a,
      name: g,
      images: C.map((N) => ({ ...N })),
      columns: O,
      editorWidth: a,
      fontFamily: oe,
      fontSize: se,
      initialCap: V,
      initialCapFont: ie,
      initialCapSize: G,
      initialCapOffsetX: Q,
      initialCapOffsetY: K
    }, w = [...u.breakpoints || [], x];
    t({ ...u, breakpoints: w }), m(w.length - 1);
  }, ge = (a) => {
    const g = (u.breakpoints || []).filter((x, w) => w !== a);
    t({ ...u, breakpoints: g }), p === a ? m(-1) : p > a && m(p - 1);
  }, Te = ae(!0);
  ve(() => {
    if (Te.current) {
      Te.current = !1;
      return;
    }
  }, [n]);
  const Ye = le((a) => {
    const g = a.target.value;
    A(g), r && r(br(g));
  }, [r]), Re = le(() => {
    const a = I.current;
    a && (a.style.height = "auto", a.style.height = a.scrollHeight + "px");
  }, []);
  ve(() => {
    Re();
  }, [R, M]);
  const ke = le((a, g, x, w, N) => {
    const Y = I.current;
    Y && (Y.focus(), Y.selectionStart = a, Y.selectionEnd = g, document.execCommand("insertText", !1, x), w !== void 0 && (Y.selectionStart = w, Y.selectionEnd = N ?? w));
  }, []), Ht = le((a) => {
    const g = a.currentTarget, { selectionStart: x, selectionEnd: w, value: N } = g, Y = x !== w, U = N.slice(x, w), ne = (H, Z) => {
      a.preventDefault();
      const he = H + U + Z;
      ke(x, w, he, x + H.length, w + H.length);
    };
    if ((a.metaKey || a.ctrlKey) && a.key === "b") {
      ne("**", "**");
      return;
    }
    if ((a.metaKey || a.ctrlKey) && a.key === "i") {
      ne("*", "*");
      return;
    }
    if ((a.metaKey || a.ctrlKey) && a.key === "k") {
      a.preventDefault();
      const H = Y ? U : "link text", Z = `[${H}](url)`, he = x + H.length + 3;
      ke(x, w, Z, he, he + 3);
      return;
    }
    if (Y && ["*", "`", "~"].includes(a.key)) {
      a.preventDefault(), a.key === "~" ? ne("~~", "~~") : ne(a.key, a.key);
      return;
    }
    if (a.key === "Tab") {
      a.preventDefault();
      const H = N.lastIndexOf(`
`, x - 1) + 1, Z = N.indexOf(`
`, x);
      Z === -1 && N.length, a.shiftKey ? N.slice(H, H + 2) === "  " && ke(H, H + 2, "", Math.max(H, x - 2)) : ke(H, H, "  ", x + 2);
      return;
    }
    if (a.key === "Enter") {
      const H = N.lastIndexOf(`
`, x - 1) + 1, he = N.slice(H, x).match(/^(\s*)([-*]|\d+\.)\s(.*)/);
      if (he) {
        const [, _e, be, Gt] = he;
        if (Gt.trim() === "") {
          a.preventDefault(), ke(H, x, `
`, H + 1);
          return;
        }
        a.preventDefault();
        const Qt = be.match(/^\d+\./) ? `${parseInt(be) + 1}.` : be, kt = `
${_e}${Qt} `;
        ke(x, w, kt, x + kt.length);
        return;
      }
    }
  }, [ke]), Ne = (a) => {
    var g;
    return (g = d.current) == null ? void 0 : g.querySelector(`img[data-image-index="${a}"]`);
  }, Wt = le((a) => {
    if (E !== null) {
      const g = Ne(E);
      if (g) {
        const x = g.getBoundingClientRect(), w = (a.clientX - x.left) / x.width, N = (a.clientY - x.top) / x.height, Y = C[E].polygon || [], U = 0.04;
        let ne = -1, H = 1 / 0;
        for (let Z = 0; Z < Y.length; Z++) {
          const he = w - Y[Z].x, _e = N - Y[Z].y, be = Math.sqrt(he * he + _e * _e);
          be < U && be < H && (H = be, ne = Z);
        }
        ne >= 0 && (D.current = { imageIndex: E, pointIndex: ne, imgRect: x, startX: a.clientX, startY: a.clientY, active: !1 }, b.current = !0, a.preventDefault());
      }
    }
  }, [u, E]), qt = le((a, g) => {
    if (E !== null) return;
    const x = a.currentTarget;
    L.current = {
      imageIndex: g,
      startX: a.clientX,
      startY: a.clientY,
      origX: C[g].x,
      origImgY: parseFloat(x.style.top) || C[g].y,
      active: !1
    }, re(g), a.preventDefault(), a.stopPropagation();
  }, [C, E]), Xt = le((a, g) => {
    v.current = { imageIndex: g, startX: a.clientX, origWidth: C[g].width }, a.preventDefault(), a.stopPropagation();
  }, [C]), Yt = le((a) => {
    var g, x;
    if (L.current) {
      const w = L.current, N = ((g = d.current) == null ? void 0 : g.offsetWidth) || 700, Y = a.clientX - w.startX, U = a.clientY - w.startY;
      if (!w.active && Math.abs(Y) + Math.abs(U) < 3) return;
      w.active = !0;
      const ne = w.origX + Y, H = Math.max(0, w.origImgY + U), Z = [...C];
      Z[w.imageIndex] = {
        ...Z[w.imageIndex],
        x: ne,
        y: H
      }, J(Z, { editorWidth: N });
    }
    if (v.current) {
      const w = v.current, N = a.clientX - w.startX, Y = ((x = d.current) == null ? void 0 : x.offsetWidth) || 700, U = [...C];
      U[w.imageIndex] = { ...U[w.imageIndex], width: Math.max(50, w.origWidth + N) }, J(U, { editorWidth: Y });
    }
    if (D.current) {
      const w = D.current, N = a.clientX - w.startX, Y = a.clientY - w.startY;
      if (!w.active && Math.abs(N) + Math.abs(Y) < 5) return;
      w.active = !0;
      const U = Math.max(0, Math.min(1, (a.clientX - w.imgRect.left) / w.imgRect.width)), ne = Math.max(0, Math.min(1, (a.clientY - w.imgRect.top) / w.imgRect.height)), H = [...C], Z = [...H[w.imageIndex].polygon || []];
      Z[w.pointIndex] = { x: U, y: ne }, H[w.imageIndex] = { ...H[w.imageIndex], polygon: Z }, J(H);
    }
  }, [u, t, C, p]), ct = le(() => {
    L.current && (L.current = null), v.current && (v.current = null), D.current && (D.current = null);
  }, []), Nt = le((a) => {
    const g = a.target;
    if (E !== null) {
      if (b.current) {
        b.current = !1;
        return;
      }
      const x = Ne(E);
      if (!x) return;
      const w = x.getBoundingClientRect(), N = (a.clientX - w.left) / w.width, Y = (a.clientY - w.top) / w.height;
      if (N >= -0.1 && N <= 1.1 && Y >= -0.1 && Y <= 1.1) {
        const U = [...C], ne = U[E].polygon || [];
        U[E] = {
          ...U[E],
          polygon: [...ne, { x: Math.max(0, Math.min(1, N)), y: Math.max(0, Math.min(1, Y)) }]
        }, J(U);
      }
      return;
    }
    g.dataset.imageIndex !== void 0 ? re(parseInt(g.dataset.imageIndex)) : re(null);
  }, [E, u, t]), jt = (a) => {
    const g = C.filter((x, w) => w !== a);
    J(g), re(null);
  }, je = (() => {
    if (X === null || !k.current) return null;
    const a = Ne(X);
    if (!a) return null;
    const g = a.getBoundingClientRect(), x = k.current.getBoundingClientRect();
    return {
      top: g.top - x.top + k.current.scrollTop - 37,
      left: g.left - x.left + k.current.scrollLeft + g.width / 2
    };
  })(), Ee = X !== null ? C[X] : null, Zt = [
    { key: "write", label: "Write", icon: /* @__PURE__ */ $(kn, { size: 14 }) },
    { key: "layout", label: "Layout", icon: /* @__PURE__ */ $(fn, { size: 14 }) }
  ];
  return /* @__PURE__ */ j("div", { style: {
    marginBottom: 20,
    width: h ? `calc(${typeof f == "number" ? f + "px" : f || "100%"} * ${M.size})` : f,
    transition: "width 0.2s ease"
  }, children: [
    /* @__PURE__ */ j("div", { style: {
      display: "flex",
      alignItems: "center",
      background: "#ede7f6",
      borderRadius: "6px 6px 0 0",
      padding: "4px 6px",
      gap: 2,
      borderBottom: "2px solid #502581"
    }, children: [
      Zt.map((a) => /* @__PURE__ */ j(
        "button",
        {
          type: "button",
          onClick: (g) => te(a.key, g.shiftKey),
          style: {
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 14px",
            fontSize: 13,
            cursor: "pointer",
            background: M.has(a.key) ? "#502581" : "transparent",
            color: M.has(a.key) ? "white" : "#6a4c93",
            border: "none",
            borderRadius: 4,
            fontWeight: M.has(a.key) ? 600 : 400,
            transition: "background 0.15s, color 0.15s"
          },
          children: [
            a.icon,
            a.label
          ]
        },
        a.key
      )),
      /* @__PURE__ */ j("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }, children: [
        l && l.length > 0 && /* @__PURE__ */ j(
          "select",
          {
            value: oe || "",
            onChange: (a) => {
              const g = a.target.value || void 0;
              if (p === -1)
                t({ ...u, fontFamily: g });
              else {
                const x = [...u.breakpoints || []];
                x[p] = { ...x[p], fontFamily: g }, t({ ...u, breakpoints: x });
              }
            },
            style: {
              padding: "3px 6px",
              fontSize: 12,
              cursor: "pointer",
              background: "transparent",
              color: "#6a4c93",
              border: "1px solid #d4c5e8",
              borderRadius: 3,
              outline: "none"
            },
            children: [
              /* @__PURE__ */ $("option", { value: "", children: "Default" }),
              l.map((a) => /* @__PURE__ */ $("option", { value: a.name, children: a.name }, a.name))
            ]
          }
        ),
        /* @__PURE__ */ $(
          "select",
          {
            value: se || 16,
            onChange: (a) => {
              const g = parseInt(a.target.value);
              if (p === -1)
                t({ ...u, fontSize: g });
              else {
                const x = [...u.breakpoints || []];
                x[p] = { ...x[p], fontSize: g }, t({ ...u, breakpoints: x });
              }
            },
            style: {
              padding: "3px 6px",
              fontSize: 12,
              cursor: "pointer",
              background: "transparent",
              color: "#6a4c93",
              border: "1px solid #d4c5e8",
              borderRadius: 3,
              outline: "none",
              width: 52
            },
            children: [12, 14, 16, 18, 20, 22, 24].map((a) => /* @__PURE__ */ j("option", { value: a, children: [
              a,
              "px"
            ] }, a))
          }
        ),
        /* @__PURE__ */ j("div", { style: { display: "flex", alignItems: "center", gap: 2 }, children: [
          /* @__PURE__ */ $(
            "button",
            {
              type: "button",
              title: "Initial cap",
              onClick: () => {
                const a = !V;
                if (p === -1)
                  t({ ...u, initialCap: a });
                else {
                  const g = [...u.breakpoints || []];
                  g[p] = { ...g[p], initialCap: a }, t({ ...u, breakpoints: g });
                }
              },
              style: {
                padding: "3px 6px",
                fontSize: 12,
                cursor: "pointer",
                background: V ? "#502581" : "transparent",
                color: V ? "white" : "#6a4c93",
                border: "1px solid #d4c5e8",
                borderRadius: 3,
                fontWeight: V ? 600 : 400,
                display: "flex",
                alignItems: "center",
                gap: 3
              },
              children: /* @__PURE__ */ $(cn, { size: 14 })
            }
          ),
          V && o && o.length > 0 && /* @__PURE__ */ j(
            "select",
            {
              value: ie || "",
              onChange: (a) => {
                const g = a.target.value || void 0;
                if (p === -1)
                  t({ ...u, initialCapFont: g });
                else {
                  const x = [...u.breakpoints || []];
                  x[p] = { ...x[p], initialCapFont: g }, t({ ...u, breakpoints: x });
                }
              },
              style: {
                padding: "3px 4px",
                fontSize: 11,
                cursor: "pointer",
                background: "transparent",
                color: "#6a4c93",
                border: "1px solid #d4c5e8",
                borderRadius: 3,
                outline: "none"
              },
              children: [
                /* @__PURE__ */ $("option", { value: "", children: "Default" }),
                o.map((a) => /* @__PURE__ */ $("option", { value: a.name, children: a.name }, a.name))
              ]
            }
          ),
          V && /* @__PURE__ */ $(
            "select",
            {
              value: G || 96,
              onChange: (a) => {
                const g = parseInt(a.target.value);
                if (p === -1)
                  t({ ...u, initialCapSize: g });
                else {
                  const x = [...u.breakpoints || []];
                  x[p] = { ...x[p], initialCapSize: g }, t({ ...u, breakpoints: x });
                }
              },
              style: {
                padding: "3px 4px",
                fontSize: 11,
                cursor: "pointer",
                background: "transparent",
                color: "#6a4c93",
                border: "1px solid #d4c5e8",
                borderRadius: 3,
                outline: "none",
                width: 52
              },
              children: [48, 64, 80, 96, 112, 128].map((a) => /* @__PURE__ */ j("option", { value: a, children: [
                a,
                "px"
              ] }, a))
            }
          ),
          V && /* @__PURE__ */ j(Vt, { children: [
            /* @__PURE__ */ $("label", { style: { fontSize: 10, color: "#6a4c93" }, children: "x" }),
            /* @__PURE__ */ $(
              "input",
              {
                type: "number",
                value: Q,
                onChange: (a) => {
                  const g = parseInt(a.target.value) || 0;
                  if (p === -1)
                    t({ ...u, initialCapOffsetX: g });
                  else {
                    const x = [...u.breakpoints || []];
                    x[p] = { ...x[p], initialCapOffsetX: g }, t({ ...u, breakpoints: x });
                  }
                },
                style: { width: 44, padding: "2px 4px", fontSize: 11, border: "1px solid #d4c5e8", borderRadius: 3, color: "#6a4c93", background: "transparent", outline: "none", textAlign: "center" }
              }
            ),
            /* @__PURE__ */ $("label", { style: { fontSize: 10, color: "#6a4c93" }, children: "y" }),
            /* @__PURE__ */ $(
              "input",
              {
                type: "number",
                value: K,
                onChange: (a) => {
                  const g = parseInt(a.target.value) || 0;
                  if (p === -1)
                    t({ ...u, initialCapOffsetY: g });
                  else {
                    const x = [...u.breakpoints || []];
                    x[p] = { ...x[p], initialCapOffsetY: g }, t({ ...u, breakpoints: x });
                  }
                },
                style: { width: 44, padding: "2px 4px", fontSize: 11, border: "1px solid #d4c5e8", borderRadius: 3, color: "#6a4c93", background: "transparent", outline: "none", textAlign: "center" }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ j("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
          /* @__PURE__ */ $(hn, { size: 14, color: "#6a4c93" }),
          [1, 2, 3].map((a) => /* @__PURE__ */ $(
            "button",
            {
              type: "button",
              onClick: () => xe(a),
              style: {
                padding: "3px 8px",
                fontSize: 12,
                cursor: "pointer",
                background: (O || 1) === a ? "#502581" : "transparent",
                color: (O || 1) === a ? "white" : "#6a4c93",
                border: "none",
                borderRadius: 3,
                fontWeight: (O || 1) === a ? 600 : 400
              },
              children: a
            },
            a
          ))
        ] }),
        /* @__PURE__ */ j(
          "button",
          {
            type: "button",
            title: "Preview mode (hide editor chrome)",
            onClick: () => q((a) => !a),
            style: {
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              fontSize: 12,
              cursor: "pointer",
              background: B ? "#502581" : "transparent",
              color: B ? "white" : "#6a4c93",
              border: "none",
              borderRadius: 3,
              fontWeight: B ? 600 : 400
            },
            children: [
              /* @__PURE__ */ $(dn, { size: 14 }),
              "Preview"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ j(
      "div",
      {
        ref: y,
        style: {
          display: "flex",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "0 0 6px 6px",
          borderTop: "none",
          minHeight: c || 300
        },
        children: [
          M.has("write") && /* @__PURE__ */ $("div", { style: { flex: 1, overflow: "auto", borderRight: M.size > 1 ? "1px solid #ddd" : "none" }, children: /* @__PURE__ */ $(
            "textarea",
            {
              ref: I,
              autoFocus: !0,
              value: R,
              onChange: Ye,
              onKeyDown: Ht,
              placeholder: `Write your content here...

Use ## for headings

Separate paragraphs with blank lines`,
              spellCheck: !1,
              style: {
                width: "100%",
                minHeight: 200,
                padding: "24px 32px",
                border: "none",
                outline: "none",
                fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, monospace",
                fontSize: 18,
                lineHeight: "1.75",
                letterSpacing: "0.01em",
                color: "#2c2c2c",
                resize: "none",
                caretColor: "#502581",
                boxSizing: "border-box",
                overflow: "hidden",
                tabSize: 2
              }
            }
          ) }),
          M.has("layout") && /* @__PURE__ */ j("div", { ref: k, style: { flex: 1, overflow: "auto", position: "relative" }, children: [
            /* @__PURE__ */ j("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 10px",
              background: "#f5f0fa",
              borderBottom: "1px solid #ddd",
              fontSize: 11
            }, children: [
              /* @__PURE__ */ $(
                "button",
                {
                  type: "button",
                  onClick: () => m(-1),
                  style: {
                    padding: "3px 10px",
                    cursor: "pointer",
                    fontSize: 11,
                    background: p === -1 ? "#502581" : "transparent",
                    color: p === -1 ? "white" : "#6a4c93",
                    border: "1px solid #d4c5e8",
                    borderRadius: 3,
                    fontWeight: p === -1 ? 600 : 400
                  },
                  children: "Default"
                }
              ),
              (u.breakpoints || []).map((a, g) => /* @__PURE__ */ j("div", { style: { display: "flex", alignItems: "center" }, children: [
                /* @__PURE__ */ $(
                  "button",
                  {
                    type: "button",
                    onClick: () => m(g),
                    style: {
                      padding: "3px 10px",
                      cursor: "pointer",
                      fontSize: 11,
                      background: p === g ? "#502581" : "transparent",
                      color: p === g ? "white" : "#6a4c93",
                      border: "1px solid #d4c5e8",
                      borderRadius: "3px 0 0 3px",
                      borderRight: "none",
                      fontWeight: p === g ? 600 : 400
                    },
                    children: a.name || `≤${a.maxWidth}px`
                  }
                ),
                /* @__PURE__ */ $(
                  "button",
                  {
                    type: "button",
                    title: "Remove breakpoint",
                    onClick: (x) => {
                      x.stopPropagation(), ge(g);
                    },
                    style: {
                      padding: "3px 5px",
                      cursor: "pointer",
                      fontSize: 11,
                      background: p === g ? "#502581" : "transparent",
                      color: p === g ? "white" : "#6a4c93",
                      border: "1px solid #d4c5e8",
                      borderRadius: "0 3px 3px 0",
                      display: "flex",
                      alignItems: "center"
                    },
                    children: /* @__PURE__ */ $(wn, { size: 10 })
                  }
                )
              ] }, g)),
              /* @__PURE__ */ $(
                "button",
                {
                  type: "button",
                  title: "Add breakpoint",
                  onClick: () => {
                    const a = window.prompt("Add breakpoint — enter max width in px (e.g. 375 for mobile, 768 for tablet):", "768");
                    if (!a) return;
                    const g = parseInt(a);
                    if (isNaN(g) || g < 200) return;
                    const x = g <= 480 ? "Mobile" : g <= 1024 ? "Tablet" : `≤${g}px`;
                    Ie(g, x);
                  },
                  style: {
                    padding: "3px 6px",
                    cursor: "pointer",
                    background: "transparent",
                    color: "#6a4c93",
                    border: "1px dashed #6a4c93",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center"
                  },
                  children: /* @__PURE__ */ $(mn, { size: 12 })
                }
              )
            ] }),
            /* @__PURE__ */ $("div", { style: {
              padding: 20,
              display: "flex",
              justifyContent: "center"
            }, children: /* @__PURE__ */ $("div", { style: {
              width: p === -1 ? "100%" : ((ut = (ht = u.breakpoints) == null ? void 0 : ht[p]) == null ? void 0 : ut.maxWidth) || "100%",
              maxWidth: "100%"
            }, children: /* @__PURE__ */ $(
              Tt,
              {
                containerRef: d,
                blocks: n,
                layout: p === -1 ? { ...u, breakpoints: void 0 } : { images: C, columns: O, editorWidth: (gt = (dt = u.breakpoints) == null ? void 0 : dt[p]) == null ? void 0 : gt.editorWidth, fontFamily: oe, fontSize: se, initialCap: V, initialCapFont: ie, initialCapSize: G, initialCapOffsetX: Q, initialCapOffsetY: K },
                config: i,
                availableFonts: l,
                availableInitialFonts: o,
                resolveImageUrl: s,
                editorMode: B ? void 0 : {
                  selectedImageIndex: X,
                  drawingPolygonIndex: E,
                  onImageMouseDown: qt,
                  onResizeMouseDown: Xt,
                  onBackgroundMouseDown: Wt,
                  onBackgroundClick: Nt,
                  onMouseMove: Yt,
                  onMouseUp: ct,
                  onMouseLeave: ct
                }
              }
            ) }) }),
            !B && X !== null && je && Ee && /* @__PURE__ */ $("div", { style: {
              position: "absolute",
              top: je.top,
              left: je.left,
              transform: "translateX(-50%)",
              display: "flex",
              gap: 2,
              padding: "4px 6px",
              background: "#333",
              borderRadius: 4,
              zIndex: 150,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
            }, children: [
              { label: (ft = Ee.polygon) != null && ft.length ? `◇${Ee.polygon.length}` : "◇", title: "Polygon", active: E === X, fn: () => {
                _(E === X ? null : X);
              } },
              ...E === X && ((xt = Ee.polygon) != null && xt.length) ? [{
                label: "Reset",
                title: "Reset polygon",
                fn: () => {
                  const a = [...C];
                  a[X] = { ...a[X], polygon: [] }, J(a);
                }
              }] : [],
              { label: "×", title: "Remove", fn: () => jt(X) }
            ].map((a, g) => /* @__PURE__ */ $(
              "button",
              {
                type: "button",
                title: a.title,
                onClick: (x) => {
                  x.stopPropagation(), a.fn();
                },
                style: {
                  padding: "3px 8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  borderRadius: 2,
                  background: a.active ? "#e67e22" : "transparent",
                  color: "white",
                  fontWeight: a.active ? 600 : 400,
                  boxShadow: a.active ? "0 0 6px rgba(230,126,34,0.5)" : "none"
                },
                onMouseEnter: (x) => {
                  a.active || (x.target.style.background = "rgba(255,255,255,0.2)");
                },
                onMouseLeave: (x) => {
                  a.active || (x.target.style.background = "transparent");
                },
                children: a.label
              },
              g
            )) })
          ] })
        ]
      }
    )
  ] });
}
function zr(n) {
  return /* @__PURE__ */ $(Tt, { ...n });
}
export {
  vr as Editor,
  zr as Renderer,
  mr as blocksToMarkdown,
  Cr as extractBlocks,
  br as parseMarkdown
};
