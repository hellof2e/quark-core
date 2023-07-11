[简体中文](./README.md) | English

# use local Quarkc component bundle example

## run

```bash
npm i
# important: make sure you've installed quarkc before using Quarkc component
# in the projects generated with quark-cli's component template, by default quarkc will be externalized and excluded from bundle
# it's meant to avoid including different versions of quarkc in distributed components, causing bundler's tree-shaking cannot work as expected,
# to reduce the app's final bundle size
npm i quarkc --save
npm start
```

## extra description
The `src/lib` directory is directly copied from the component example (the `lib` directory generated under component example with command `npm run build`)。
