
<p align="center">
  <a href="https://quark.hellobike.com/">
    <img src="https://github.com/hellof2e/quark/assets/14307551/4fa59176-09f7-422c-8eef-4947b71322c8" >
  </a>
</p>
<h2 align="center"> Quark Everything! </h2>

### 优秀案例
|  作者   | github 地址  | 截图 ｜
|  ----  | ----  | ----- |
| hellof2e  | https://github.com/hellof2e/quark-doc-header | ![1685501041275](https://github.com/hellof2e/quark/assets/14307551/24dd5626-e6a9-452c-9c95-c2cdb8891573) |


### 介绍

Quark 是一个拥有完美开发体验的 web components 框架。

### 起手架模版(推荐)

1、工程安装
```bash
npx create-quark-app create project-name
cd project-name

npm install
npm start
```

2. 自定义组件
```jsx
import { QuarkElement, property, customElement } from "quarkc"
import style from "./main.css"

@customElement({ tag: "my-element", style }) // 自定义标签/组件、CSS
export default class MyElement extends QuarkElement {
  @property({ type: Number }) // 外部属性
  count = 0;

  add = () => {
    this.count += 1;
  }
  
  render() {
    return (
        <button onClick={this.add}>count is: { this.count }</button>
    );
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

4. 构建


可以打包为 UMD / ESM 格式，然后发布到 npm
```
npm run build
```

### 特性

* 可以在任何框架或者无框架使用 Quark 自定义元素
* 小巧的尺寸和高性能设计
* Web Components + JSX/TSX 融合


## 文档

完整文档，请访问 [quark.hellobike.com](https://quark.hellobike.com)
