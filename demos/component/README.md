简体中文 | [English](./README.en-US.md)

# Quarkc组件示例

## 运行

```bash
npm install
npm start
```

## 仅打包
```bash
npm run build
```
打包产物会生成在`lib`目录下，其中`index.js`为ESM格式的产物，`index.umd.js`为UMD格式的产物。

## 打包&发布
```bash
npm publish
```
如果想要将Quark组件开源并发布至NPM，执行此命令（需要先登录NPM账号）。
