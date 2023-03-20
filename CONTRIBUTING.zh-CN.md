## 开始

第一次启动

```bash
yarn run init
yarn run dev
```

以后再次启动本工程只需

```bash
yarn run dev
```

## 命令说明（核心维护者发包使用）

第一步：
```bash
// 发布所有子包的最后一位版本号如 0.0.1 -> 0.0.2,
yarn run release:patch

// 发布所有子包的中间一位版本号如 0.0.1 -> 0.1.0,
yarn run release:minor

// 发布所有子包的第一位版本号如 0.0.1 -> 1.0.0,
yarn run release:major
```

第二步：
打 tag
```
git tag // 先看下是否生成最新的 tag
git push origin --tags
```

然后 github 更新 [release](https://github.com/hellof2e/quark/releases/new)

## 常见问题

如何清除子项目的缓存？

```
yarn clean
```

Windows 电脑运行 yarn run link 时乱码？

```
// 在 git bash 中执行 yarn run link 命令
```