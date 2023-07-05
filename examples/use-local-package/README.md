简体中文 | [English](./README.en-US.md)

# 使用本地Quarkc包示例

## 运行

```bash
npm i
# 重要：需要确保使用Quarkc组件之前已经安装quarkc依赖
# 使用quark-cli component模板生成的项目，默认情况下quarkc依赖会被外置从而不被打包进产物中
# 这么做是为了避免分发的单个组件中包含不同版本的quarkc代码，从而影响打包工具的tree-shaking
# 以减小应用最终的打包体积
npm i quarkc --save
# 或者在package.json中手动列出本地依赖
npm i ../component/my-component-0.0.0.tgz --save
npm start
```
