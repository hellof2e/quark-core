import { EMPTY_OBJ } from './constants';
import { diff } from './diff/index';
import { createElement, Fragment } from './create-element';
import options from './options';
import { slice } from './util';

/**
 * Render a quark virtual node into a DOM element
 * @param vnode The virtual node to render
 * @param parentDom The DOM element to render into
 */
export function render(vnode, parentDom) {
	if (options._root) options._root(vnode, parentDom);

	// To be able to support calling `render()` multiple times on the same
	// DOM node, we need to obtain a reference to the previous tree. We do
	// this by assigning a new `_children` property to DOM nodes which points
	// to the last rendered tree. By default this property is not present, which
	// means that we are mounting a new tree for the first time.
	let oldVNode = parentDom._children;

	vnode = parentDom._children = createElement(Fragment, null, [vnode]);
	diff(
		parentDom,
		// Determine the new vnode tree and store it on the DOM element on
		// our custom `_children` property.
		vnode,
		oldVNode || EMPTY_OBJ,
		parentDom.ownerSVGElement !== undefined,
		oldVNode
			? null
			: parentDom.firstChild
				? slice.call(parentDom.childNodes)
				: null,
		oldVNode
			? oldVNode._dom
			: parentDom.firstChild,
	);
}