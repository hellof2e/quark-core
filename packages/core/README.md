
<p align="center">
  <a href="https://quarkc.hellobike.com/">
    <img src="https://github.com/hellof2e/quark-core/assets/14307551/5968d0ed-6d60-4b13-b05b-1e9ba30a5708" >
  </a>
</p>
<h2 align="center"> Quarkc </h2>
<div align="center">

Quarkc，跨技术栈/原生组件构建工具。

</div>

<p align="center">
  <a href="https://www.npmjs.com/package/quarkc"><img src="https://img.shields.io/npm/dt/quarkc.svg" alt="Total Downloads"></a>
  <a href="https://www.npmjs.com/package/quarkc">
    <img src="https://img.shields.io/npm/v/quarkc.svg" alt="Published on NPM">
  </a>
  <a href="https://github.com/hellof2e/quark-core/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/quark-core.svg" alt="License"></a>
</p>


<p align="center">
  <span> 简体中文 | </span>
  <a href="https://github.com/hellof2e/quark-core/blob/main/README.en-US.md">
    English
  </a>
</p>

### 优秀案例

|  作者   | github 地址  | 截图 / 链接
|  ----  | ----  | ----- |
| @yuhaiyang1  | https://github.com/yuhaiyang1/quarkc-time |  https://unpkg.com/quark-timer@0.0.2/demo.html |
| @khno  | https://github.com/khno/quark-element-demo-celebrate |  https://unpkg.com/quarkc-demo-celebrate@latest/demo.html |
| @hellof2e  | https://github.com/hellof2e/quark-doc-header | ![1685501041275](https://github.com/hellof2e/quark-core/assets/14307551/24dd5626-e6a9-452c-9c95-c2cdb8891573) https://quarkc.hellobike.com/#/ |
| @xsf0105  | https://github.com/xsf0105/dark-light-element |  https://unpkg.com/dark-light-element@latest/demo.html |
| @dyf19118  | https://github.com/dyf19118/quark-ui-rate |  ![image](https://github.com/hellof2e/quark-cli/assets/14307551/e11e6c49-4c18-4bca-adc3-01a7198ab2e2) |
| @hellof2e  | https://github.com/hellof2e/quark-doc-home |  ![1686575964690](https://github.com/hellof2e/quark-core/assets/14307551/9618427c-916b-4dfd-b28b-0e8e0f6ce744)  |


## 介绍

Quarkc(Quark core缩写) 是一个拥有完美开发体验的 web components 工具（jsx + web components）。通过它，您可以开发标准的**跨框架组件** 或 **独立前端应用**（脱离框架的原生web应用，性能可达百分百💯）。

## Why Quarkc ?

背景 1:【前端的历史】

前端发展多年，无论大小公司，一般都存在各种技术栈(React, Angular, Jq, Vue) / 同种技术栈的不同版本（Vue2, Vue3）。如果要开发某个通用组件（比如：营销弹窗），工作量就是 double+（不同技术框架需要分开开发/维护/上线，同技术不同版本可能也需要分开开发/维护/上线）

背景 2:【前端的未来】

前端框架会继续迭代/发展，会有新的版本，新的框架出现。用 Quarkc 开发“通用型组件”，不会随着“前端框架浪潮”而更新迭代（极大降低组件研发/维护成本）。

以上背景，决定了 **前端通用型组件** 的开发和维护成本比较高。

## Quarkc 目标

让 Web 组件实现技术栈无关！

## 使用

### 组件起手架模版

1. 工程安装
```bash
npm create quarkc@latest
cd project-name

npm install
npm start
```

2. 自定义组件
```jsx
import { QuarkElement, property, customElement } from "quarkc"
import style from "./index.less?inline"

@customElement({ tag: "my-element", style }) // 自定义标签/组件、CSS
export default class MyElement extends QuarkElement {
  @property() // 外部属性
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

3. 使用

各种技术栈都能运行。
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

### 组件打包

打包默认输出为 UMD / ESM 格式

```bash
npm run build
```

此时，构建产物 `lib/` 下的资源可以直接在项目中被使用。（任何前端项目都可使用～）

```jsx
import "your-element"

<my-element></my-element>
```

### 组件发布

可以将组件发布到 npm，安装：

```bash
npm install your-element
```

可以作为 CDN 使用

```html
<script src="https://fastly.jsdelivr.net/npm/quarkc"></script>
<script src="https://fastly.jsdelivr.net/npm/your-element"></script>
```

也可以作为 ES Module 使用（推荐）
```js
import "your-element"
```

更多发布相关，详情点击 [发布 Publishing](https://quarkc.hellobike.com/#/zh-CN/docs/publishing)

### 特性

*   **跨技术栈**：组件可以在任何框架或无框架的环境下使用，让你的代码更具复用性
*   **组件体积极小，性能极高**：因为 Quarkc 使用的是浏览器原生 API，所以你的组件可以达到最优性能，且体积小巧
*   Web Components, Simple, Fast！
*   浏览器原生API，组件可以跨技术栈使用
*   没有前端框架 Runtime，Web 组件体积小到极致
*   **高性能**设计，Shadow DOM 与 Virtual DOM 融合
*   组件直接解耦，独立打磨，按需引用

### 性能参考

一个略复杂的组件页面跑分截图：

<img width="600" alt="image" src="https://github.com/hellof2e/quark-core/assets/14307551/8eda52c8-4ad7-4e92-ab09-602cf7771d96">

### 文档

完整文档，请访问 [quarkc.hellobike.com](https://quarkc.hellobike.com)

