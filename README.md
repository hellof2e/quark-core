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


## 使用

### 1、创建组件构建模版工程

创建模版
```bash
npm create quarkc@latest
```

启动工程
```bash
npm install
npm start
```

### 2、自定义你的 Custom Elements（组件/元素）
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

### 3、组件 Build 打包

打包默认输出为 UMD / ESM 格式

```bash
npm run build
```

此时，构建产物 `lib/` 下的资源可以直接被任何框架的前端项目中使用。

### 4、像常规html标签一样去使用它

##### （1）含有工程管理的前端项目（含有package.json/node_modules等文件）
```jsx
import "./lib/your-element"


<my-element count="count" />

// vue
<my-element :count="count" />

// react
<my-element count={count} />

// svelte
<my-element {count} />

// angular
<my-element [count]="count" />
```

##### （2）无工程管理的前端项目（不含有package.json/node_modules等文件，纯HTML+CSS+JS文件）

- 单个 quarkc 组件，可以直接使用：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- 引用 npm run build 产物 -->
    <script type="module" src="./lib/index.mjs"></script>
  </head>
  <body>
    <my-element></my-element>
  </body>
</html>
```

- 需要使用多个 quarkc 组件，为了共用 quarkc 核心库。

您可以开启了 `external`：
```diff
// vite.config.build.ts
export default defineConfig({
  build: {
    rollupOptions: {
+      external: ['quarkc'],
    },
  },
});

```
然后，用下面方式单独加载 `quarkc` 核心库：
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="importmap">
      {
        "imports": {
          "quarkc": "https://unpkg.com/quarkc@latest/lib/index.browser.js"
        }
      }
    </script>
    <!-- 引用 npm run build 产物 -->
    <!-- quarkc 构建的组件1 -->
    <script type="module" src="my-element1/lib/index.mjs"></script>
    <!-- quarkc 构建的组件2 -->
    <script type="module" src="my-element2/lib/index.mjs"></script>
  </head>
  <body>
    <!-- 使用 quarkc 元素/组件 -->
    <my-element1></my-element1>
    <my-element2></my-element2>
  </body>
</html>
```

### 组件发布

更多发布相关，详情点击 [发布 Publishing](https://quark-ecosystem.github.io/quarkc-docs/#/zh-CN/docs/publishing)


## 文档

完整文档，请访问 [quarkc.hellobike.com](https://quark-ecosystem.github.io/quarkc-docs)