[简体中文](./README.md) | English

# use local Quarkc component package example

## run

```bash
npm i
# install by specifying the .tgz package path on local file system like this
# or list the local dependency and it's path in the package.json before npm i
# in this use case, quarkc will be installed automatically as a dependency of my-component
npm i ../component/my-component-0.0.0.tgz --save
npm start
```
