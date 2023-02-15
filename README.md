
<p align="center">
  <a href="https://quark-design.hellobike.com/">
    <img width="200" src="https://user-images.githubusercontent.com/14307551/197440754-08db4379-eb0f-4808-890d-690355e6e8d2.png">
  </a>
</p>
<h2 align="center">QuarkC — 基于 Web Components 跨框架底层</h2>
<hr />
### 介绍
QuarkC 是一个优化 web components 开发体验的轻量级框架。部分实现思路参考[Lit](https://lit.dev/docs/getting-started/)。
### 使用
```shell
npm i quarkc --save
```
```jsx
import QuarkElement, {
  Fragment,
  property,
  state,
  createRef,
  customElement,
} from "quarkc";
import style from "./style.css";

@customElement({ tag: "quark-count", style })
class QuarkButton extends QuarkElement {
  @property()
  count: number = 0;
  add = () => {
    this.count = Number(this.count) + 1;
  }
  render() {
    return (
      <Fragment>
        <button onClick={this.add}>count is: { this.count}</button>
      </Fragment>
    );
  }
}

export default QuarkButton;

```
```html
 <quark-count></quark-count>
```

### 特性

* 可以在任何框架或者无框架使用 QuarkC 自定义元素
* 小巧的尺寸和高性能设计
* Web Components + JSX/TSX 融合
...

### 获取示例

```shell
git clone https://github.com/hellof2e/quark.git
yarn run init 
yarn run dev
```
