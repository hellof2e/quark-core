# Quark 组件

基于本工程，您可以构建属于自己的跨技术栈/无框架 组件。

## 如何使用

```
npm install
npm run dev
```

入口文件为 `src/index.tsx`，这里使用 `vite` 进行开发和生产打包。

## 打包产物

```
npm run build
```

打包后的产出为： `lib/index.js`和`lib/index.umd.cjs`。


## 使用产物

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

### 3、Build 打包

打包默认输出为 UMD / ESM 格式

```bash
npm run build
```

此时，构建产物 `lib/` 下的资源可以直接被任何框架的前端项目中使用。

```tree
./lib
├── types
|     └── install.d.ts
├── index.js
└── index.umd.js
```

### 4、使用

##### （1）含有工程管理的前端项目（含有package.json/node_modules等文件）
```jsx
import "./lib/index.js"


<my-element count="count" />

// vue
// <my-element :count="count" />

// react
// <my-element count={count} />

// svelte
// <my-element {count} />

// angular
// <my-element [count]="count" />
```

##### （2）无工程管理的前端项目（不含有package.json/node_modules等文件，纯HTML+CSS+JS文件）

单个 quarkc 组件，可以直接使用：

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

多个 quarkc 组件同时加载，为了共用 quarkc 核心库，您可以选择开启了 `external`：
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


## 文档

完整文档，请访问 [https://quark-ecosystem.github.io/quarkc-docs](https://quark-ecosystem.github.io/quarkc-docs)

### 联系我们

添加微信：Sanqi9675

### 社区示例

|  作者   | github 地址  | 截图 / 链接
|  ----  | ----  | ----- |
| @xsf0105  | https://github.com/xsf0105/dark-light-element |  https://unpkg.com/dark-light-element@latest/demo.html |
| @hellof2e  | https://github.com/hellof2e/quark-doc-header | ![1685501041275](https://github.com/hellof2e/quark-core/assets/14307551/24dd5626-e6a9-452c-9c95-c2cdb8891573) https://quarkc.hellobike.com/#/ |
| @yuhaiyang1  | https://github.com/yuhaiyang1/quarkc-time |  https://unpkg.com/quark-timer@0.0.2/demo.html |
| @dyf19118  | https://github.com/dyf19118/quark-ui-rate |  ![image](https://github.com/hellof2e/quark-cli/assets/14307551/e11e6c49-4c18-4bca-adc3-01a7198ab2e2) |
| @hellof2e  | https://github.com/hellof2e/quark-doc-home |  ![1686575964690](https://github.com/hellof2e/quark-core/assets/14307551/9618427c-916b-4dfd-b28b-0e8e0f6ce744)  |
| @zhangfisher  | https://github.com/zhangfisher/lite-tree/tree/master/packages/quark |  [点击查看](https://github.com/zhangfisher/lite-tree/blob/master/docs/tree.png?raw=true)  |

