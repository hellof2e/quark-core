<h2 align="center"> Quarkc </h2>
<div align="center">
Quarkc 无框架，前端组件/应用构建工具。
</div>
<div align="center">
 已支撑哈啰几乎所有 C 端 / B 端项目，包括交易，支付，两轮，商城等。
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/quarkc"><img src="https://img.shields.io/npm/dt/quarkc.svg" alt="Total Downloads"></a>
  <a href="https://www.npmjs.com/package/quarkc">
    <img src="https://img.shields.io/npm/v/quarkc.svg" alt="Published on NPM">
  </a>
  <a href="https://github.com/hellof2e/quark-core/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/quarkc.svg" alt="License"></a>
</p>


<p align="center">
  <span> 简体中文 | </span>
  <a href="https://github.com/hellof2e/quark-core/blob/main/README.en-US.md">
    English
  </a>
</p>

<p align="center">
<a href="https://stackblitz.com/edit/quarkc-vite-k6t2ge?file=index.html&file=src%2Findex.tsx"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt=""></a>
</p>



### 联系我们

添加微信：Sanqi9675


## 介绍

Quarkc(Quark core缩写) 是一个拥有完美开发体验的 web components 工具（jsx + web components）。通过它，您可以开发标准的**跨框架组件** 或 **独立前端应用**（脱离框架的原生web应用，性能可达百分百💯）。

### 特性

*   **跨技术栈**：组件可以在任何框架或无框架的环境下使用，让你的代码更具复用性
*   **组件体积极小，性能极高**：因为 Quarkc 使用的是浏览器原生 API，所以你的组件可以达到最优性能，且体积小巧
*   Web Components, Simple, Fast！
*   浏览器原生API，组件可以跨技术栈使用
*   没有前端框架 Runtime，Web 组件体积小到极致
*   **高性能**设计，Shadow DOM 与 Virtual DOM 融合
*   组件直接解耦，独立打磨，按需引用

## Online Demo

[StackBlitz](https://stackblitz.com/edit/quarkc-vite-k6t2ge?file=index.html&file=src%2Findex.tsx)


## 使用

### 组件起手架模版

1. 工程安装

创建模版
```bash
npm create quarkc@latest
```

启动工程
```bash
npm install
npm start
```

2. 自定义组件/标签（Custom Elements）
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



## 文档

完整文档，请访问 [quarkc.hellobike.com](https://quarkc.hellobike.com)


## Why Quarkc ?

<details/>
 <summary>
  Why?
 </summary>
 
背景 1:【前端的历史】

前端发展多年，无论大小公司，一般都存在各种技术栈(React, Angular, Jq, Vue) / 同种技术栈的不同版本（Vue2, Vue3）。如果要开发某个通用组件（比如：营销弹窗），工作量就是 double+（不同技术框架需要分开开发/维护/上线，同技术不同版本可能也需要分开开发/维护/上线）

背景 2:【前端的未来】

前端框架会继续迭代/发展，会有新的版本，新的框架出现。用 Quarkc 开发“通用型组件”，不会随着“前端框架浪潮”而更新迭代（极大降低组件研发/维护成本）。

以上背景，决定了 **前端通用型组件** 的开发和维护成本比较高。
</details>


## Quarkc 目标

让 Web 组件实现技术栈无关！



## 性能参考

一个复杂的页面跑分截图：

<img width="600" alt="image" src="https://github.com/hellof2e/quark-core/assets/14307551/8eda52c8-4ad7-4e92-ab09-602cf7771d96">



## 单元测试

<details>
  <summary>
  我们使用了 @open-wc/testing 来进行单元测试。以下是我们示例组件的 <my-component /> 的单元测试。
  </summary>    

```js
import { expect, fixture } from "@open-wc/testing";
import "./lib/index";

const data = {
  count: 0,
  text: '测试'
};
let el;

describe("<my-component />", async () => {
  it("property text exist", async () => {
    el = await fixture(
      `<my-component
        text=${data.text}
        >
        </my-component>`
    );
    expect(el.text).to.equal(data.text);
  });

  it("property count exist", async () => {
    el = await fixture(
      `<my-component
          count=${data.count}
        >
        </my-component>`
    );
    expect(el.count).to.equal(data.count);
  });

  it("property count changed", async () => {
    el = await fixture(
      `<my-component
        count=${data.count}
        >
        </my-component>`
    );
    el.add()
    expect(el.count).to.equal(data.count + 1);
  });
})

```

</details>





