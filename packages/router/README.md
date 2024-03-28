# quark-router

为quarkc项目提供的路由控制器，支持`history`和`hash`两种路由模式.

<p align="center">
  <span> 简体中文 | </span>
  <a href="https://github.com/hellof2e/quark-core/blob/main/packages/router/README.en-US.md">
    English
  </a>
</p>

## 安装

```
npm i quark-router -S
```

你可以从`quark-router`中全部引入：

```ts
import { Router, Routes } from "quark-router"
```
注意：此时`quark-link`组件作为自定义组件已从`quark-router`中引入并定义，可直接使用，无需再次引入。

也可以按需单独引入：

```ts
import { Router } from "quark-router/router"
```
```ts
import { Routes } from "quark-router/routes"
```
```ts
import "quark-router/quark-link"
```

## 总览

quark-router 是作为响应式控制器提供的面向组件的路由 API。路由作为组件定义的一部分进行配置，并集成到组件的生命周期和渲染中。

通常的使用方式如下，在一个响应式控制器中进行配置，并通过特定路由的渲染回调以及在render方法中使用的“outlet”来完成渲染：


```ts
@customElement({ tag: "my-component" })
class MyComponent extends QuarkElement {
  private _routes = new Router(this, [
    {path: '/', render: () => <home-component/>},
    {path: '/sub/:id', render: ({id}) => <sub-component id={id}/>},
    {path: '/child/*', render: () => <child-component/>},
  ])

  render() {
    return (
      <>
        <ul>
          <li><quark-link to="/">Home</quark-link></li>
          <li><quark-link to="/sub/3222">Sub</quark-link></li>
          <li><quark-link to="/child/1" replace>Child</quark-link></li>
        </ul>
        <div className="router-render">
          { this._routes.outlet() }
        </div>
      </>
    );
  }
}
```

路由可以嵌套：路由路径可以包含一个尾随的 `/* `来匹配子路径，并且会被自动传递给在子元素中定义的 Routes 控制器。

API的一般表现形式包括：

- 作为顶级单例使用的 `Router` 控制器
- 用于在组件内声明路由的 `Routes` 控制器
- 用[`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)声明路由并呈现回调
- 可将URL模式参数提取传递到呈现回调的数据对象中
- 用于创建链接并处理URL生成的`quark-link`组件
- routes.outlet() 方法，用于渲染当前路由的渲染回调
- routes.link() 方法，用于获取当前路由位置对应的绝对路径
- routes.goto() 方法，执行导航的方法（只完成渲染，不改变URL）
- 组件内可执行自身的`dispatchEvent`方法，传递定义的事件来进行动态跳转

## API

### Router

`Router`是`Routes` 控制器的一个子类，用于应用程序内路由模块的顶层。它的主要目的是设置全局的事件监听器（这些监听器在页面上应该只安装一次）和启动顶层路由跳转。
它可以选择性地配置第三个参数`options`，`options`内可配置2个可选字段：`fallback`字段，当导航地址匹配不到任何路由配置时，则默认进入到该配置；`mode`字段，表明项目要应用的路由模式，未配置时，默认为`history`模式。

代码例子如下：

```ts
@customElement({ tag: "my-component" })
class MyComponent extends QuarkElement {
  private router = new Router(this, [
    {path: '/', render: () => <home-component/>},
  ]);

  render() {
    return this.router.outlet();
  }
}
```

也可以包含其他额外配置：

```ts
@customElement({ tag: "my-component" })
class MyComponent extends QuarkElement {
  private router = new Router(this, [
    {path: '/', render: () => <home-component/>},
  ], {
    mode: 'hash',
    fallback: { render: () => <home-component/> }
  });

  render() {
    return this.router.outlet();
  }
}
```


### Routes

Routes 是进入路由器 API 的主要接口。一个 Routes 控制器包含路由定义以及每个路由将要渲染的模板（注意子路由开头不要加`/`）：

```ts
@customElement({ tag: "child-component" })
class ChildComponent extends QuarkElement {
  private _routes = new Routes(this, [
    {path: '1', render: () => <child-first/>},
    {path: '2', render: () => <child-second/>},
  ])

  render() {
    return this._routes.outlet();
  }
}
```
第二个参数是路由配置：一个`RouteConfig[]`类型的数组。

#### RouteConfig

一个RouteConfig至少包含要匹配url的模式和要呈现的模板。可以提供名称来引用生成链路的路由。
RouteConfig有两种类型：`PathRouteConfig`和`URLPatternRouteConfig`：
`PathRouteConfig`让你指定URL模式为路径字符串：

```ts
{name: 'home', path: '/', render: () => (<h1>Home</h1>)}
```

```ts
export interface PathRouteConfig {
  name?: string | undefined;
  path: string;
  render: (params: {[key: string]: string}) => unknown;
}
```

`URLPatternRouteConfig`让你指定URL模式为一个 [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) 对象：

```ts
{pattern: new URLPattern({pathname: '/'}), render: () => (<h1>Home</h1>)}
```

```ts
export interface URLPatternRouteConfig {
  name?: string | undefined;
  pattern: URLPattern;
  render: (params: {[key: string]: string}) => unknown;
}
```

#### Render 回调

当Routes对象的outlet方法被调用时，渲染回调函数被调用。它被传递给一个对象，其中包含从匹配URL中提取的参数。带有命名参数的示例：

```ts
{
  path: '/sub/:id',
  render: ({id}) => <sub-component id={id}/>
}
```

#### Outlets

`outlet()`是routes对象渲染当前所匹配到的路由模板的地方。它可以在宿主元素模板中的任何地方使用:

```ts
<div className="router-render">
  { this._routes.outlet() }
</div>
```

#### enter() 回调

路由可以定义一个`enter()`回调，让它在渲染之前完成工作，并选择性地拒绝匹配的路由。 `enter()`可用于加载并等待必要的组件定义：

```ts
{
  path: '/*',
  render: () => <home-component/>,
  enter: async (params) => {
    await import('./x-foo.js');
  },
}
```

或者动态安装新路由：

```ts
{
  path: '/*',
  render: (params) => (<h1>Not found: {params[0]}</h1>),
  enter: async (params) => {
    const path = params[0];
    const dynamicRoute = getDynamicRoute(path);
    if (dynamicRoute) {
      const {routes} = this._router;
      routes.splice(routes.length - 1, 0, dynamicRoute);
      // 重新触发路由
      await this._router.goto('/' + path);
      // 拒绝此路由，以便匹配动态路由
      return false;
    }
  }
}
```
#### `goto()`

`goto(url: string)`是一个编程导航API。它使用完整的url进行顶层导航，使用相对url进行嵌套路由空间内的导航。手动调用此方法只执行传入导航的渲染，不改变当前URL。

`goto()`返回一个Promise，该Promise会在任何触发的async`enter()`回调完成时resolve。

#### `link()`

`link(pathname?: string)`返回当前路由的URL字符串拼接pathname，包括父路由; 当pathname以`/`开头时会被视为绝对路径被直接返回。


### `quark-link` 组件

使用`quark-link`组件创建路由链接，组件接收2个属性如下：

| 参数  | 说明                             | 类型               | 默认值 |
| ----- | -------------------------------- | ------------------ | ------ |
| to | 导航路径，可设置为相对路径和绝对路径。以`/`开头的路径会被视为绝对路径；若为相对路径，组件内会根据所在位置最靠近的路由设置来生成绝对路径  | `string`           | -      |
| replace  | 跳转时是否替换当前历史栈 | `boolean` | `false`    |


例子：

```ts
@customElement({ tag: "child-component", style })
class ChildComponent extends QuarkElement {
  private _routes = new Routes(this, [
    {path: '1', render: () => <child-first/>},
    {path: '2/*', render: () => <child-second/>},
  ])

  render() {
    return (
      <div className="main">
        <ul>
          <li><quark-link to="1">child/1</quark-link></li>
          <li><quark-link to="2/1" replace>child/2/1</quark-link></li>
        </ul>
        <div className="router-render">
          { this._routes.outlet() }
        </div>
      </div>
    );
  }
}
```

### 动态跳转

在路由根组件（安装了顶层路由配置的组件）以及它的任意子孙组件内，都可以通过执行组件自身的`dispatchEvent`方法，传递跳转事件来进行路由的动态跳转。
可从`quark-router`中导出要传递的事件类以及事件名等：

```ts
import { Routes, RouteEvent, RouteMethodEnum } from "quark-router"

@customElement({ tag: "child-first" })
class ChildFirst extends QuarkElement {

  goToLink() {
    this.dispatchEvent(
      new RouteEvent(RouteMethodEnum.push, {
        path: '2/1'
      })
    );
  }

  render() {
    return (
      <>
        <button onClick={() => this.goToLink()}>go to child2-1</button>
      </>
    );
  }
}
```

`RouteEvent`配置包含两个参数，第一个参数为跳转事件名称，表示跳转方式，类型为`RouteMethodEnum`：

```ts
export interface RouteMethodEnum {
  push = 'quark-route-push',
  replace = 'quark-route-replace',
}
```

第二个参数为路由详情，类型为`RouteDetail`：

```ts
export interface RouteDetail {
  path: string;
  query?: {[key: string]: string}; // 路径上添加的参数，会被序列号为?xx=xx&xx=xx加在path之后
  callback?: (error?: Error) => void; // 目前callback函数只能确保在等待enter回调执行完成之后才执行，暂未实现路由渲染完成后的回调及错误捕获
}
```

### 嵌套路由

嵌套路由允许子组件在父组件选择的URL前缀路径上定义路由空间的子集。

```ts
@customElement({ tag: "my-component" })
class MyComponent extends QuarkElement {
  private _routes = new Router(this, [
    {path: '/', render: () => <home-component/>},
    /**
     * 这里我们挂载了一个子组件，它定义了自己的子路由。 
     * 我们需要后面的/*形参匹配前缀并传递要解析的子节点的路径。
     */
    {path: '/child/*', render: () => <child-component/>},
  ])

  render() {
    return (
      <>
        <ul>
          <li><quark-link to="/">Home</quark-link></li>
          <li><quark-link to="/child/1">Child1</quark-link></li>
          <li><quark-link to="/child/2">Child2</quark-link></li>
        </ul>
        <div className="router-render">
          { this._routes.outlet() }
        </div>
      </>
    );
  }
}

@customElement({ tag: "child-component", style })
class ChildComponent extends QuarkElement {
  private _routes = new Routes(this, [
    {path: '1', render: () => <child-first/>},
    {path: '2', render: () => <child-second/>},
  ])

  render() {
    return (
        <div className="router-render">
          { this._routes.outlet() }
        </div>
    );
  }
}
```
在这个例子中，页面可以处理url`/`，`/child/1`和`/child/2`。

### `routes` 数组

`Routes`(和`Router`)有一个名为`routes`的属性，它是路由配置的数组。这个数组是可变的，所以代码可以动态地添加和删除路由。路由按照数组的顺序匹配，因此数组定义了路由优先级。

## 说明

`quark-router`是由[@lit-labs/router](https://github.com/lit/lit/tree/main/packages/labs/router)fork而来，我在此基础上做了一些修改使其适用于Quarkc项目，并加入了一些日常项目中需要用到的功能接口。