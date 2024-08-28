var p = Object.defineProperty;
var h = (t, o, e) => o in t ? p(t, o, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[o] = e;
var s = (t, o, e) => (h(t, typeof o != "symbol" ? o + "" : o, e), e);
import { property as u, customElement as m, QuarkElement as r } from "quarkc";
function d(t, o, e, i) {
  var c = arguments.length, n = c < 3 ? o : i === null ? i = Object.getOwnPropertyDescriptor(o, e) : i, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    n = Reflect.decorate(t, o, e, i);
  else
    for (var f = t.length - 1; f >= 0; f--)
      (a = t[f]) && (n = (c < 3 ? a(n) : c > 3 ? a(o, e, n) : a(o, e)) || n);
  return c > 3 && n && Object.defineProperty(o, e, n), n;
}
const g = `:root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424}:host{display:block;margin:0 auto;padding:2rem;text-align:center;border:2px solid #0da6e9;width:500px}.logo{height:6em;padding:1.5em;will-change:filter}.logo:hover{filter:drop-shadow(0 0 2em #0da6e9aa);transition:all .5s}.card{padding:2em}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;cursor:pointer;transition:border-color .25s}button:hover{border-color:#0da6e9}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.read-the-docs{color:#888}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}
`;
let l = class extends r {
  constructor() {
    super(...arguments);
    s(this, "count", 0);
    s(this, "text", "");
    s(this, "add", () => {
      this.count += 1;
    });
  }
  componentDidMount() {
    // console.log("dom loaded!");
  }
  render() {
    return r.h(
      r.Fragment,
      null,
      r.h(
        "div",
        null,
        r.h(
          "a",
          { href: "https://quarkc.hellobike.com", target: "_blank" },
          r.h("img", { src: "https://fastly.jsdelivr.net/npm/quark-static@latest/quark-logo.png", class: "logo", alt: "quark logo" })
        )
      ),
      r.h(
        "h1",
        null,
        "Quark - ",
        this.text
      ),
      r.h(
        "div",
        { className: "card" },
        r.h(
          "button",
          { onClick: this.add },
          "count is: ",
          this.count
        )
      )
    );
  }
};
d([
  u({ type: Number })
], l.prototype, "count", void 0);
d([
  u({ type: String })
], l.prototype, "text", void 0);
l = d([
  m({ tag: "my-component", style: g })
], l);
const k = l;
export {
  k as default
};
