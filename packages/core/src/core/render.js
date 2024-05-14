import { EMPTY_OBJ } from './constants';
import { diff } from './diff';
import { createElement, Fragment } from './create-element';
import options from './options';
import { slice } from './util';

/**
 * Render a quark virtual node into a DOM element
 * @param vnode The virtual node to render
 * @param root The root DOM element to render into
 */
export function render(vnode, root) {
	if (options._root) options._root(vnode, root);

	// To be able to support calling `render()` multiple times on the same
	// DOM node, we need to obtain a reference to the previous tree. We do
	// this by assigning a new `_children` property to DOM nodes which points
	// to the last rendered tree. By default this property is not present, which
	// means that we are mounting a new tree for the first time.
	let oldVNode = root._children;

	vnode = root._children = createElement(Fragment, null, [vnode]);
	
	diff(
		root,
		// Determine the new vnode tree and store it on the DOM element on
		// our custom `_children` property.
		vnode,
		oldVNode || EMPTY_OBJ,
		root.ownerSVGElement !== undefined,
		oldVNode
			? null
			: root.firstChild
				? slice.call(root.childNodes)
				: null,
		oldVNode
			? oldVNode._dom
			: root.firstChild,
	);
}