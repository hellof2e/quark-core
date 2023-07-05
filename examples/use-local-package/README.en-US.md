[简体中文](./README.md) | English

# use local Quarkc component package example

## run

```bash
npm i
# important: make sure you've installed quarkc before using Quarkc component
# in the projects generated with quark-cli's component template, by default quarkc will be externalized and excluded from bundle
# it's meant to avoid including different versions of quarkc in distributed components, causing bundler's tree-shaking cannot work as expected,
# to reduce the app's final bundle size
npm i quarkc --save
# or list the local dependency in the package.json
npm i ../component/my-component-0.0.0.tgz --save
npm start
```
