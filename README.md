
<p align="center">
  <a href="https://quark-design.hellobike.com/">
    <img width="200" src="https://user-images.githubusercontent.com/14307551/197440754-08db4379-eb0f-4808-890d-690355e6e8d2.png">
  </a>
</p>
<h2 align="center"> Quark，构建下一代前端组件！ </h2>  

### 介绍  

Quark 是一个拥有完美开发体验的 web components 框架。

### 使用  

```shell
npm i quarkc --save
```  

Define custom element.
```jsx
import QuarkElement, { property, customElement } from "quarkc";

@customElement({ tag: "quark-count" })
export default class Button extends QuarkElement {
  @property()
  count: number = 0;
  
  render() {
    return (
        <button onClick={this.add}>count is: { this.count}</button>
    );
  }
}
```

Use it.
```html
 <quark-count></quark-count>
```

### 特性

* 可以在任何框架或者无框架使用 QuarkC 自定义元素
* 小巧的尺寸和高性能设计
* Web Components + JSX/TSX 融合  
* To Be Continue......

### 获取示例

```shell
git clone https://github.com/hellof2e/quark.git
yarn run init 
yarn run dev
```
