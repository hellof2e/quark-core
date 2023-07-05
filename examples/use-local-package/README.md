简体中文 | [English](./README.en-US.md)

# 使用本地Quarkc包示例

## 运行

```bash
npm i
# 像这样指定在本地文件系统上的tgz包路径来安装本地依赖，或者在npm i之前在package.json中手动列出本地依赖和路径
# 在这种使用方式下，quarkc作为my-component的依赖会被自动安装
npm i ./my-component-0.0.0.tgz --save
npm start
```

## 额外说明
`my-component-0.0.0.tgz`文件是直接从component示例中拷贝过来的（通过在component示例中执行`npm run build && npm pack`命令生成）。
