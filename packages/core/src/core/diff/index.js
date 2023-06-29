import { EMPTY_OBJ } from '../constants';
import { Component, getDomSibling } from '../component';
import { Fragment } from '../create-element';
import { diffChildren } from './children';
import { diffProps, setProperty } from './props';
import { removeNode, slice } from '../util';
import options from '../options';

/**
 * Diff two virtual nodes and apply proper changes to the DOM
 * @param parentDom The parent of the DOM element
 * @param newVNode The new virtual node
 * @param oldVNode The old virtual node
 * @param {boolean} isSvg Whether or not this element is an SVG node
 * @param excessDomChildren
 * @param oldDom The current attached DOM
 * element any new dom elements should be placed around. Likely `null` on first
 * render (except when hydrating). Can be a sibling DOM element when diffing
 * Fragments that have siblings. In most cases, it starts out as `oldChildren[0]._dom`.
 */
export function diff(
	parentDom,
	newVNode,
	oldVNode,
	isSvg,
	excessDomChildren,
	oldDom,
) {
	let tmp,
		newType = newVNode.type;

	// When passing through createElement it assigns the object
	// constructor as undefined. This to prevent JSON-injection.
	if (newVNode.constructor !== undefined) return null;

	if ((tmp = options._diff)) tmp(newVNode);

	try {
		outer: if (typeof newType == 'function') {
			let c, isNew, oldProps, clearProcessingException;
			let newProps = newVNode.props;

			// Get component and set it to `c`
			if (oldVNode._component) {
				c = newVNode._component = oldVNode._component;
				clearProcessingException = c._processingException = c._pendingError;
			} else {
				if ('prototype' in newType && newType.prototype.render) {
					if (process.env.NODE_ENV === 'development') {
						throw new Error('Class component in render method is not supported.')
					}
				}

				newVNode._component = c = new Component(newProps);
				c.constructor = newType;
				c.render = doRender;
				c.props = newProps;
				isNew = c._dirty = true;
			}

			oldProps = c.props;
			c._vnode = newVNode;

			if (isNew) {
				// noop
			} else {
				if (newVNode._original === oldVNode._original) {
					newVNode._dom = oldVNode._dom;
					newVNode._children = oldVNode._children;
					newVNode._children.forEach(vnode => {
						if (vnode) vnode._parent = newVNode;
					});
					break outer;
				}
			}

			c.props = newProps;
			c._parentDom = parentDom;

			let renderHook = options._render;
			let count = 0;

			do {
				c._dirty = false;
				if (renderHook) renderHook(newVNode);

				tmp = c.render(c.props);

				// Handle state change in render
			} while (c._dirty && ++count < 25);

			let isTopLevelFragment =
				tmp != null && tmp.type === Fragment && tmp.key == null;
			let renderResult = isTopLevelFragment ? tmp.props.children : tmp;

			diffChildren(
				parentDom,
				Array.isArray(renderResult) ? renderResult : [renderResult],
				newVNode,
				oldVNode,
				isSvg,
				excessDomChildren,
				oldDom,
			);

			c.base = newVNode._dom;

			if (clearProcessingException) {
				c._pendingError = c._processingException = null;
			}
		} else if (
			excessDomChildren == null &&
			newVNode._original === oldVNode._original
		) {
			newVNode._children = oldVNode._children;
			newVNode._dom = oldVNode._dom;
		} else {
			newVNode._dom = diffElementNodes(
				oldVNode._dom,
				newVNode,
				oldVNode,
				isSvg,
				excessDomChildren,
			);
		}

		if ((tmp = options.diffed)) tmp(newVNode);
	} catch (e) {
		newVNode._original = null;
		// if hydrating or creating initial tree, bailout preserves DOM:
		if (excessDomChildren != null) {
			newVNode._dom = oldDom;
			excessDomChildren[excessDomChildren.indexOf(oldDom)] = null;
			// ^ could possibly be simplified to:
			// excessDomChildren.length = 0;
		}
		options._catchError(e, newVNode, oldVNode);
	}
}

/**
 * Diff two virtual nodes representing DOM element
 * @param dom The DOM element representing
 * the virtual nodes being diffed
 * @param newVNode The new virtual node
 * @param oldVNode The old virtual node
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node
 * @param excessDomChildren
 * @returns
 */
function diffElementNodes(
	dom,
	newVNode,
	oldVNode,
	isSvg,
	excessDomChildren,
) {
	let oldProps = oldVNode.props;
	let newProps = newVNode.props;
	let nodeType = newVNode.type;
	let i = 0;

	// Tracks entering and exiting SVG namespace when descending through the tree.
	if (nodeType === 'svg') isSvg = true;

	if (excessDomChildren != null) {
		for (; i < excessDomChildren.length; i++) {
			const child = excessDomChildren[i];

			// if newVNode matches an element in excessDomChildren or the `dom`
			// argument matches an element in excessDomChildren, remove it from
			// excessDomChildren so it isn't later removed in diffChildren
			if (
				child &&
				'setAttribute' in child === !!nodeType &&
				(nodeType ? child.localName === nodeType : child.nodeType === 3)
			) {
				dom = child;
				excessDomChildren[i] = null;
				break;
			}
		}
	}

	if (dom == null) {
		if (nodeType === null) {
			// @ts-ignore createTextNode returns Text, we expect QuarkElement
			return document.createTextNode(newProps);
		}

		if (isSvg) {
			dom = document.createElementNS(
				'http://www.w3.org/2000/svg',
				// @ts-ignore We know `newVNode.type` is a string
				nodeType
			);
		} else {
			dom = document.createElement(
				// @ts-ignore We know `newVNode.type` is a string
				nodeType,
				newProps.is && newProps
			);
		}

		// we created a new parent, so none of the previously attached children can be reused:
		excessDomChildren = null;
	}

	if (nodeType === null) {
		if (oldProps !== newProps) {
			dom.data = newProps;
		}
	} else {
		// If excessDomChildren was not null, repopulate it with the current element's children:
		excessDomChildren = excessDomChildren && slice.call(dom.childNodes);

		oldProps = oldVNode.props || EMPTY_OBJ;

		let oldHtml = oldProps.dangerouslySetInnerHTML;
		let newHtml = newProps.dangerouslySetInnerHTML;

		// TODO we should warn in debug mode when props don't match here.
		// But, if we are in a situation where we are using existing DOM (e.g. replaceNode)
		// we should read the existing DOM attributes to diff them
		if (excessDomChildren != null) {
			oldProps = {};
			for (i = 0; i < dom.attributes.length; i++) {
				oldProps[dom.attributes[i].name] = dom.attributes[i].value;
			}
		}

		if (newHtml || oldHtml) {
			// Avoid re-applying the same '__html' if it did not changed between re-render
			if (
				!newHtml ||
				((!oldHtml || newHtml.__html != oldHtml.__html) &&
					newHtml.__html !== dom.innerHTML)
			) {
				dom.innerHTML = (newHtml && newHtml.__html) || '';
			}
		}

		diffProps(dom, newProps, oldProps, isSvg);

		// If the new vnode didn't have dangerouslySetInnerHTML, diff its children
		if (newHtml) {
			newVNode._children = [];
		} else {
			i = newVNode.props.children;
			diffChildren(
				dom,
				Array.isArray(i) ? i : [i],
				newVNode,
				oldVNode,
				isSvg && nodeType !== 'foreignObject',
				excessDomChildren,
				excessDomChildren
					? excessDomChildren[0]
					: oldVNode._children && getDomSibling(oldVNode, 0),
			);

			// Remove children that are not part of any vnode.
			if (excessDomChildren != null) {
				for (i = excessDomChildren.length; i--;) {
					if (excessDomChildren[i] != null) removeNode(excessDomChildren[i]);
				}
			}
		}

		if (
			'value' in newProps &&
			(i = newProps.value) !== undefined &&
			// For the <progress>-element the initial value is 0,
			// despite the attribute not being present. When the attribute
			// is missing the progress bar is treated as indeterminate.
			// To fix that we'll always update it when it is 0 for progress elements
			(i !== dom.value ||
				(nodeType === 'progress' && !i) ||
				// This is only for IE 11 to fix <select> value not being updated.
				// To avoid a stale select value we need to set the option.value
				// again, which triggers IE11 to re-evaluate the select value
				(nodeType === 'option' && i !== oldProps.value))
		) {
			setProperty(dom, 'value', i, oldProps.value, false);
		}
		if (
			'checked' in newProps &&
			(i = newProps.checked) !== undefined &&
			i !== dom.checked
		) {
			setProperty(dom, 'checked', i, oldProps.checked, false);
		}
	}

	return dom;
}

/**
 * Invoke or update a ref, depending on whether it is a function or object ref.
 * @param {object|function} ref
 * @param {any} value
 * @param vnode
 */
export function applyRef(ref, value, vnode) {
	try {
		if (typeof ref == 'function') ref(value);
		else ref.current = value;
	} catch (e) {
		options._catchError(e, vnode);
	}
}

/**
 * Unmount a virtual node from the tree and apply DOM changes
 * @param vnode The virtual node to unmount
 * @param parentVNode The parent of the VNode that
 * initiated the unmount
 * @param {boolean} [skipRemove] Flag that indicates that a parent node of the
 * current element is already detached from the DOM.
 */
export function unmount(vnode, parentVNode, skipRemove) {
	let r;
	if (options.unmount) options.unmount(vnode);

	if ((r = vnode.ref)) {
		if (!r.current || r.current === vnode._dom) {
			applyRef(r, null, parentVNode);
		}
	}

	if ((r = vnode._component) != null) {
		r.base = r._parentDom = null;
		vnode._component = undefined;
	}

	if ((r = vnode._children)) {
		for (let i = 0; i < r.length; i++) {
			if (r[i]) {
				unmount(
					r[i],
					parentVNode,
					skipRemove || typeof vnode.type !== 'function'
				);
			}
		}
	}

	if (!skipRemove && vnode._dom != null) {
		removeNode(vnode._dom);
	}

	// Must be set to `undefined` to properly clean up `_nextDom`
	// for which `null` is a valid value. See comment in `create-element.js`
	vnode._parent = vnode._dom = vnode._nextDom = undefined;
}

/** The `.render()` method for a PFC backing instance. */
function doRender(props) {
	return this.constructor(props);
}
