# quark-router

A router for quarkc project.

## Install

```ts
import { Router, Routes } from "quark-router"
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
          <li><a href="/">Home</a></li>
          <li><a href="/sub/3222">Sub</a></li>
          <li><a href="/child/1">Child</a></li>
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
- A `routes.outlet()` method that renders the current route's render callback
- A `routes.link()` method to generate URLs to use in `<a>` tags, etc.
- A `routes.goto()` method for performing a navigation

## API

### Router

A Router is a controller (a subclass of the Routes controller) for use at the top-level of an application. It's main purpose is to set up global `click` and `popstate` event listeners (which should be installed only once on a page). It can optionally contain route definitions as a convenience.

It can be installed with no configuration:

```ts
@customElement({ tag: "my-component" })
class MyComponent extends QuarkElement {
  private router = new Router(this);
}
```

Or contain route configurations:

```ts
@customElement({ tag: "my-component" })
class MyComponent extends QuarkElement {
  private router = new Router(this, {
    {path: '/', render: () => <home-component/>},
  });

  render() {
    return this.router.outlet();
  }
}
```

### Routes

Routes is the main interface into the router API. A Routes controller contains route definitions and the templates that each route renders:

```ts
@customElement({ tag: "child-component", style })
class ChildComponent extends QuarkElement {
  private _routes = new Routes(this, [
    {path: '1', render: () => <child-first/>},
    {path: '2', render: () => <child-second/>},
  ])

  render() {
    return (
      <div className="main">
        <ul>
          <li><a href="/child/1">child1</a></li>
          <li><a href="/child/2">child2</a></li>
        </ul>
        <div className="router-render">
          { this._routes.outlet() }
        </div>
      </div>
    );
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

`goto(url: string)` is a programmatic navigation API. It takes full URLs for top-level navigation and relative URLs for navigation within a nested route space.

`goto(name: string, params: object)` _(not implemented)_ allows navigation via named routes. The name and params are scoped to the Routes object it's called on, though nested routes can be triggered by a "tail" parameter - the match of a trailing `/*` parameter (See tail groups).

`goto()` returns a Promise that resolves when any triggered async `enter()` callbacks have completed.

#### `link()`

Components need to generate links to resources within the app. It's desirable to not require that link generation has global knowledge of URLs, so links should be able to be generated with either only local information, or with abstracted parameters. `routes.link()` helps generate different kinds of links:

##### Relative links

Relative links are relative to the parent route and its current state, and can be specified with a path string or name and parameters.

Examples

- `this._routes.link(user.id)` - within a `<x-user>` component that has a route pattern like `':id'`, this would link to another user profile.
- `this._routes.link('profile', {id: user.id})` - the same URL generated with a named route

These links work regardless of where the component is mounted in the URL space.

##### Global links

_Not implemented_

Global or absolute links don't need a `link(url: string)` form - an absolute URL can already be used in the `href` attribute of an `<a>` tag. But links within components shouldn't need to be tied to the specific URL layout - you should be able to describe the route by name and parameters. These names and parameters need to be nested to work with nested routes. _TBD_

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
          <li><a href="/">Home</a></li>
          <li><a href="/child/1">Child</a></li>
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

this router is fork from [@lit-labs/router](https://github.com/lit/lit/tree/main/packages/labs/router) and I rewrote it to work with Quarkc.
