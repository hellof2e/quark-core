# quark-router

A router for quarkc project, supports two routing modes: `history` and `hash`.

<p align="center">
  <a href="https://github.com/hellof2e/quark-core/blob/main/packages/router/README.md">
    简体中文
  </a>
  <span> | English </span>
</p>

## Install

```
npm i quark-router -S
```

You can import all of them from `quark-router`:

```ts
import { Router, Routes } from "quark-router"
```
Note: The `quark-link` component has been introduced and defined from the 'quark-router' as a custom component at this time, and can be used directly without re-introduction.

It can also be introduced separately on demand:

```ts
import { Router } from "quark-router/router"
```
```ts
import { Routes } from "quark-router/routes"
```
```ts
import "quark-router/quark-link"
```

## Overview

`quark-router` is a component-oriented router API vended as reactive controllers. Routes are configured as part of component definitions, and integrated into the component lifecycle and rendering.

Usage will generally look like this, with a configuration in a reactive controller, and rendering done via route-specific render callbacks and an "outlet" to use in the main render() method:

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

Routes can be nested: a route path can include a trailing `/*` pattern to match against a prefix, and will automatically propagate that prefix to Routes controllers defined in child elements.

The general shape of the API includes:

- A `Router` controller that's used as a top-level singleton to set up event listeners
- A `Routes` controller for declaring routes inside components
- Declaration of routes with [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) and render callbacks
- Extraction of URL pattern parameters into data objects passed to render callbacks
- A `quark-link` component for creating links and handling URL generation
- A `routes.outlet()` method that renders the current route's render callback
- A `routes.link()` method to obtain the absolute path corresponding to the current route location
- A `routes.goto()` method for performing a navigation
- The component can execute `dispatchEvent` method, passing defined events for dynamic jumps

## API

### Router

A Router is a controller (a subclass of the Routes controller) for use at the top-level of an application. It's main purpose is to set up global event listeners (which should be installed only once on a page) and excute top-level routing.
It can optionally configure the third parameter `options`,`options` can be configured with two optional fields: `fallback` field, if the navigation address does not match any route configuration, the route configuration is entered by default. The `mode` field indicates the routing mode to be applied by the project, if not configured, the default is `history` mode.

eg:

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

Additional configurations can also be included:

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

Routes is the main interface into the router API. A Routes controller contains route definitions and the templates that each route renders (Note that the subroute does not start with a `/`):

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

The second argument is the route configuration: an array of `RouteConfig` objects.

#### RouteConfig

A RouteConfig contains at the minimum the pattern to match URLs against and a template to render. Names can be provided to reference routes for link generation.

There are two types of `RouteConfig`s: `PathRouteConfig` and `URLPatternRouteConfig`:

`PathRouteConfig` lets you specify the URL pattern as a path string:

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

`URLPatternRouteConfig` lets you specify the URL pattern as a [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) object:

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

#### Render callbacks

The render callback is called when the outlet method of the Routes object is called. It is passed an object with the parameters extracted from the matching URL.

Example with named parameter:

```ts
{
  path: '/sub/:id',
  render: ({id}) => <sub-component id={id}/>
}
```

#### Outlets

An outlet is where a routes object renders the currently selected route's template. It can be used anywhere in the host element's template:

```ts
<div className="router-render">
  { this._routes.outlet() }
</div>
```

#### enter() callbacks

A route can define an `enter()` callback that lets it do work before rendering and optionally reject that route as a match.

`enter()` can be used to load and wait for necessary component definitions:

```ts
{
  path: '/*',
  render: () => <home-component/>,
  enter: async (params) => {
    await import('./x-foo.js');
  },
}
```

or dynamically install new routes:

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
      // Trigger the router again
      await this._router.goto('/' + path);
      // Reject this route so the dynamic one is matched
      return false;
    }
  }
}
```

#### `goto()`

`goto(url: string)` is a programmatic navigation API. It takes full URLs for top-level navigation and relative URLs for navigation within a nested route space. Calling this method manually only performs the rendering of the passed navigation and does not change the current URL.

`goto()` returns a Promise that resolves when any triggered async `enter()` callbacks have completed.

#### `link()`

`link(pathname?: string)` return the URL string of the current route, concatenated the parent route. When the pathname begins with '/', it is treated as an absolute path and is returned directly.


### `quark-link` Component

Using the `quark-link` component to create a routing link, which receives 2 properties as follows:

| Attribute  | Description                             | Type               | Default |
| ----- | -------------------------------- | ------------------ | ------ |
| to | Navigation path, can be set to relative path or absolute path. Paths that start with '/' are considered absolute paths; If it is a relative path, the absolute path is generated within the component based on the route Settings closest to the location  | `string`           | -      |
| replace  | Whether to replace the current history stack | `boolean` | `false`    |

Example:

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

### Dynamic jump

In the root component (the component with the top-level routing configuration installed) and any of its descendants, the route can be dynamically jumped by executing the component's own `dispatchEvent` method, passing a jump event. The event class and event name to be passed can be exported from the `quark-router` :

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

The `RouteEvent` configuration contains two parameters, the first of which is the jump event name, which indicates the jump method, and is of type `RouteMethodEnum` :


```ts
export interface RouteMethodEnum {
  push = 'quark-route-push',
  replace = 'quark-route-replace',
}
```

The second parameter is the route details of type `RouteDetail` :

```ts
export interface RouteDetail {
  path: string;
  query?: {[key: string]: string}; // Parameters added to the path will be converted to '?xx=xx&xx=xx' is added after path
  callback?: (error?: Error) => void; /**
   * At present `callback` function only can make sure it's executed after waiting for the completion of the enter callback execution.
   * Callback and error capture after route rendering are not implemented.
   */
```

### Nested Routes

Nested routes allow child components to define a subset of the route space mounted at a URL prefix path chosen by a parent.

```ts
@customElement({ tag: "my-component" })
class MyComponent extends QuarkElement {
  private _routes = new Router(this, [
    {path: '/', render: () => <home-component/>},
    // Here we mount a child component that defines its own sub-routes.
    // We need the trailing /* parameter to match on the prefix and pass
    // a path to the child to parse.
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

In this example, the page can handle URLs `/`, `/child/1` and `/child/2`.

### `routes` Array

`Routes` (and `Router`) have a property named `routes` that is an array of the route configurations. This array is mutable, so code an dynamically add and remove routes. Routes match in order of the array, so the array defines the route precedence.

## Notes

this router is fork from [@lit-labs/router](https://github.com/lit/lit/tree/main/packages/labs/router), I rewrote it to work with Quarkc and add some functional interfaces needed in common demand.
