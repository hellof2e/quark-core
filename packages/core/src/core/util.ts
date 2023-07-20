import { EMPTY_ARR } from "./constants";

/**
 * Assign properties from `props` to `obj`
 * @template O, P The obj and props types
 * @param obj The object to copy properties to
 * @param props The object to copy properties from
 * @returns
 */
export function assign(obj, props) {
	// @ts-ignore We change the type of `obj` to be `O & P`
	for (let i in props) obj[i] = props[i];
	return obj;
}

/**
 * Remove a child node from its parent if attached. This is a workaround for
 * IE11 which doesn't support `Element.prototype.remove()`. Using this function
 * is smaller than including a dedicated polyfill.
 * @param node The node to remove
 */
export function removeNode(node: Node) {
	let parentNode = node.parentNode;
	if (parentNode) parentNode.removeChild(node);
}

/**
 * Checks if `value` is a `function`.
 * @param value The value to check
 * @returns Returns `true` if `value` is a function, else `false`.
 */
export function isFunction(value: any): value is (...args: any[]) => any {
	return typeof value === "function";
}

export const slice = EMPTY_ARR.slice;
