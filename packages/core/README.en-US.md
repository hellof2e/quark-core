
<p align="center">
  <a href="https://quarkc.hellobike.com/">
    <img src="https://github.com/hellof2e/quark-core/assets/14307551/5968d0ed-6d60-4b13-b05b-1e9ba30a5708" >
  </a>
</p>
<h2 align="center"> Quarkc </h2>
<div align="center">

Quarkc, a cross technology stack / native component building tool.

</div>

<p align="center">
  <a href="https://www.npmjs.com/package/quarkc"><img src="https://img.shields.io/npm/dt/quarkc.svg" alt="Total Downloads"></a>
  <a href="https://www.npmjs.com/package/quarkc">
    <img src="https://img.shields.io/npm/v/quarkc.svg" alt="Published on NPM">
  </a>
  <a href="https://github.com/hellof2e/quark-core/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/quark-core.svg" alt="License"></a>
</p>


<p align="center">
  <a href="https://github.com/hellof2e/quark-design/blob/main/README.md">
    简体中文
  </a>
  <span> | English </span>
</p>

### outstanding case

| author | github address | screenshot / link
| ---- | ---- | ----- |
| @yuhaiyang1 | https://github.com/yuhaiyang1/quarkc-time | https://unpkg.com/quark-timer@0.0.2/demo.html |
| @khno | https://github.com/khno/quark-element-demo-celebrate | https://unpkg.com/quarkc-demo-celebrate@latest/demo.html |
| @hellof2e | https://github.com/hellof2e/quark-doc-header | ![1685501041275](https://github.com/hellof2e/quark-core/assets/14307551/24dd5626-e6a9-452c-9c95-c2cdb8891573 ) https://quarkc.hellobike.com/#/ |
| @xsf0105 | https://github.com/xsf0105/dark-light-element | https://unpkg.com/dark-light-element@latest/demo.html |
| @dyf19118 | https://github.com/dyf19118/quark-ui-rate | ![image](https://github.com/hellof2e/quark-cli/assets/14307551/e11e6c49-4c18-4bca-adc3 -01a7198ab2e2) |
| @hellof2e | https://github.com/hellof2e/quark-doc-home | ![1686575964690](https://github.com/hellof2e/quark-core/assets/14307551/9618427c-916b-4dfd-b28b-0e8e0f6ce744 ) |


## introduce

Quarkc (Quark core abbreviation) is a web components framework with perfect development experience. With it, you can develop standard **cross-framework components**.

## Why Quarkc?

Background 1: [History of the front end]
The front-end has been developed for many years. Regardless of the size of the company, there are generally various technology stacks (React, Angular, Jq, Vue) / different versions of the same technology stack (Vue2, Vue3). If you want to develop a common component (for example: marketing pop-up window), the workload is double+ (different technical frameworks need to be developed/maintained/launched separately, and different versions of the same technology may also need to be developed/maintained/launched separately)

Background 2: [The future of the front end]
The front-end framework will continue to iterate/develop, and there will be new versions and new frameworks. Using Quarkc to develop "universal components" will not update and iterate along with the "wave of front-end frameworks" (greatly reducing component development/maintenance costs).

The above background determines that the development and maintenance costs of **front-end general-purpose components** are relatively high.

## Quarkc target

Let web components implement technology stack independent!

## use

### Component starter template

1. Engineering installation
```bash
npm create quarkc@latest
cd project-name

npm install
npm start
```

2. Custom components
```jsx
import { QuarkElement, property, customElement } from "quarkc"
import style from "./index.less?inline"

@customElement({ tag: "my-element", style }) // custom tag/component, CSS
export default class MyElement extends QuarkElement {
   @property() // external property
   count

   add = () => {
     this.count += 1
   }

   render() {
     return (
       <button onClick={this.add}>count is: { this.count }</button>
     )
   }
}
```

3. use

All kinds of tech stacks work.
```html
<my-element count="count" />

<!-- vue -->
<my-element :count="count" />

<!-- react -->
<my-element count={count} />

<!-- svelte -->
<my-element {count} />

<!-- angular -->
<my-element [count]="count" />
```

### Component packaging

Package default output is UMD / ESM format

```bash
npm run build
```

At this point, the resources under the build product `lib/` can be used directly in the project. (Any front-end project can be used~)

```jsx
import "your-element"

<my-element></my-element>
```

### Component publishing

Components can be published to npm, installed with:

```bash
npm install your-element
```

Can be used as a CDN

```html
<script src="https://fastly.jsdelivr.net/npm/quarkc"></script>
<script src="https://fastly.jsdelivr.net/npm/your-element"></script>
```

Also available as ES Module (recommended)
```js
import "your-element"
```

For more details about publishing, click [Publishing](https://quarkc.hellobike.com/#/zh-CN/docs/publishing)

### Features

* **Cross-Technology Stack**: Components can be used in any frame or frameless environment, making your code more reusable
* **The component size is very small and the performance is extremely high**: Because Quarkc uses the browser's native API, your component can achieve optimal performance and small size
* Web Components, Simple, Fast!
* Browser native API, components can be used across technology stacks
* There is no front-end framework Runtime, and the size of Web components is extremely small
* **High performance** design, integration of Shadow DOM and Virtual DOM
* Components are directly decoupled, polished independently, and referenced on demand

### Performance reference

Screenshot of a slightly complex component page running score:

<img width="600" alt="image" src="https://github.com/hellof2e/quark-core/assets/14307551/8eda52c8-4ad7-4e92-ab09-602cf7771d96">

### Documentation

For full documentation, please visit [quarkc.hellobike.com](https://quarkc.hellobike.com)
