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

```tree
.
├── types
|     └── install.d.ts
├── index.js
└── index.umd.js
```

## 使用产物

无论是`Vue`，`React`，`Angular`还是`Jq`项目，该组件都可以被使用。

```js
import "my-component/lib";

<my-component count="0" />;
```

详细文档，请访问：https://quarkc.hellobike.com/#/zh-CN/docs/publishing
