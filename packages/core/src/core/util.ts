/**
 * Checks if `value` is a `function`.
 * @param value The value to check
 * @returns Returns `true` if `value` is a function, else `false`.
 */
export function isFunction(value: any): value is (...args: any[]) => any {
	return typeof value === "function";
}

export const slice = Array.prototype.slice;

export const noop = () => {};

/** set dom attribute for consistent behavior */
export const updateDomAttr = (dom: HTMLElement, name: string, value: any) => {
	if (value != null && (value !== false || name.indexOf('aria-') === 0)) {
		// any truty value, or falsy aria-* values
		dom.setAttribute(name, value);
	} else {
		dom.removeAttribute(name);
	}
};
