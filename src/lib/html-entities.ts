/**
 * HTML 4 named character references (Latin-1, symbols and special sets),
 * with characters taken from the current WHATWG list
 * (https://html.spec.whatwg.org/entities.json). `lang` and `rang` differ
 * from HTML 4 (U+27E8 / U+27E9 instead of U+2329 / U+232A).
 *
 * Names are case-sensitive: `&Eacute;` is É and `&eacute;` is é.
 */

// Latin-1 supplement: consecutive code points starting at U+00A0.
const LATIN1_START = 0xa0;
const LATIN1_NAMES = (
  'nbsp iexcl cent pound curren yen brvbar sect uml copy ordf laquo not shy reg macr ' +
  'deg plusmn sup2 sup3 acute micro para middot cedil sup1 ordm raquo frac14 frac12 frac34 iquest ' +
  'Agrave Aacute Acirc Atilde Auml Aring AElig Ccedil Egrave Eacute Ecirc Euml ' +
  'Igrave Iacute Icirc Iuml ETH Ntilde Ograve Oacute Ocirc Otilde Ouml times ' +
  'Oslash Ugrave Uacute Ucirc Uuml Yacute THORN szlig ' +
  'agrave aacute acirc atilde auml aring aelig ccedil egrave eacute ecirc euml ' +
  'igrave iacute icirc iuml eth ntilde ograve oacute ocirc otilde ouml divide ' +
  'oslash ugrave uacute ucirc uuml yacute thorn yuml'
).split(' ');

// Symbols (math, Greek letters, arrows, shapes) and special characters.
const OTHER_ENTITIES: Record<string, number> = {
  // Special
  quot: 0x22, amp: 0x26, lt: 0x3c, gt: 0x3e,
  OElig: 0x152, oelig: 0x153, Scaron: 0x160, scaron: 0x161, Yuml: 0x178,
  circ: 0x2c6, tilde: 0x2dc,
  ensp: 0x2002, emsp: 0x2003, thinsp: 0x2009, zwnj: 0x200c, zwj: 0x200d, lrm: 0x200e, rlm: 0x200f,
  ndash: 0x2013, mdash: 0x2014,
  lsquo: 0x2018, rsquo: 0x2019, sbquo: 0x201a, ldquo: 0x201c, rdquo: 0x201d, bdquo: 0x201e,
  dagger: 0x2020, Dagger: 0x2021, permil: 0x2030, lsaquo: 0x2039, rsaquo: 0x203a, euro: 0x20ac,

  // Symbols: Latin extended and Greek
  fnof: 0x192,
  Alpha: 0x391, Beta: 0x392, Gamma: 0x393, Delta: 0x394, Epsilon: 0x395, Zeta: 0x396,
  Eta: 0x397, Theta: 0x398, Iota: 0x399, Kappa: 0x39a, Lambda: 0x39b, Mu: 0x39c,
  Nu: 0x39d, Xi: 0x39e, Omicron: 0x39f, Pi: 0x3a0, Rho: 0x3a1, Sigma: 0x3a3,
  Tau: 0x3a4, Upsilon: 0x3a5, Phi: 0x3a6, Chi: 0x3a7, Psi: 0x3a8, Omega: 0x3a9,
  alpha: 0x3b1, beta: 0x3b2, gamma: 0x3b3, delta: 0x3b4, epsilon: 0x3b5, zeta: 0x3b6,
  eta: 0x3b7, theta: 0x3b8, iota: 0x3b9, kappa: 0x3ba, lambda: 0x3bb, mu: 0x3bc,
  nu: 0x3bd, xi: 0x3be, omicron: 0x3bf, pi: 0x3c0, rho: 0x3c1, sigmaf: 0x3c2,
  sigma: 0x3c3, tau: 0x3c4, upsilon: 0x3c5, phi: 0x3c6, chi: 0x3c7, psi: 0x3c8,
  omega: 0x3c9, thetasym: 0x3d1, upsih: 0x3d2, piv: 0x3d6,

  // Symbols: punctuation, letterlike, arrows
  bull: 0x2022, hellip: 0x2026, prime: 0x2032, Prime: 0x2033, oline: 0x203e, frasl: 0x2044,
  weierp: 0x2118, image: 0x2111, real: 0x211c, trade: 0x2122, alefsym: 0x2135,
  larr: 0x2190, uarr: 0x2191, rarr: 0x2192, darr: 0x2193, harr: 0x2194, crarr: 0x21b5,
  lArr: 0x21d0, uArr: 0x21d1, rArr: 0x21d2, dArr: 0x21d3, hArr: 0x21d4,

  // Symbols: math operators
  forall: 0x2200, part: 0x2202, exist: 0x2203, empty: 0x2205, nabla: 0x2207,
  isin: 0x2208, notin: 0x2209, ni: 0x220b, prod: 0x220f, sum: 0x2211, minus: 0x2212,
  lowast: 0x2217, radic: 0x221a, prop: 0x221d, infin: 0x221e, ang: 0x2220,
  and: 0x2227, or: 0x2228, cap: 0x2229, cup: 0x222a, int: 0x222b, there4: 0x2234,
  sim: 0x223c, cong: 0x2245, asymp: 0x2248, ne: 0x2260, equiv: 0x2261, le: 0x2264, ge: 0x2265,
  sub: 0x2282, sup: 0x2283, nsub: 0x2284, sube: 0x2286, supe: 0x2287,
  oplus: 0x2295, otimes: 0x2297, perp: 0x22a5, sdot: 0x22c5,

  // Symbols: technical and shapes
  lceil: 0x2308, rceil: 0x2309, lfloor: 0x230a, rfloor: 0x230b,
  lang: 0x27e8, rang: 0x27e9, loz: 0x25ca,
  spades: 0x2660, clubs: 0x2663, hearts: 0x2665, diams: 0x2666,
};

// Not in HTML 4, but already supported before this table existed.
const EXTRA_ENTITIES: Record<string, number> = {
  apos: 0x27,
  AMP: 0x26, LT: 0x3c, GT: 0x3e, QUOT: 0x22,
};

export const HTML_ENTITIES: Record<string, string> = Object.fromEntries([
  ...LATIN1_NAMES.map((name, index): [string, number] => [name, LATIN1_START + index]),
  ...Object.entries(OTHER_ENTITIES),
  ...Object.entries(EXTRA_ENTITIES),
].map(([name, codePoint]) => [name, String.fromCodePoint(codePoint)]));
